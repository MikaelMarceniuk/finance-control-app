'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import useGetExpense from '@/hooks/useGetExpense'
import { endOfMonth, isWithinInterval, startOfMonth } from 'date-fns'
import useGetCategory from '@/hooks/useGetCategory'

export const description = 'A bar chart'

const chartConfig = {
	category: {
		label: 'Categoria',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig

const expenseParams = {
	startDate: startOfMonth(new Date()),
	endDate: endOfMonth(new Date()),
}

const ExpensesByCategoryInMonthChart = () => {
	const { expenses } = useGetExpense(expenseParams)
	const { categories } = useGetCategory()

	const chartData = categories.map((c) => {
		const expensesInThisCategory = expenses.filter((exp) => {
			if (exp.category.id != c.id) return false
			if (
				!isWithinInterval(exp.date, {
					start: expenseParams.startDate,
					end: expenseParams.endDate,
				})
			)
				return false

			return true
		})

		const amount = expensesInThisCategory.reduce(
			(acc, { amount }) => acc + amount,
			0,
		)

		return {
			category: c.name,
			amount: amount / 100,
		}
	})

	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Despesas por categoria (mes)</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel formatValueToCurrency />}
						/>
						<Bar dataKey="amount" fill="var(--color-category)" radius={8} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export default ExpensesByCategoryInMonthChart
