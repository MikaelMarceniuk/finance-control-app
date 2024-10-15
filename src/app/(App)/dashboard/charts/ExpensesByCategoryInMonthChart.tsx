'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import { endOfMonth, startOfMonth } from 'date-fns'
import useGetCategory from '@/hooks/useGetCategory'
import useGetTransactions from '@/hooks/useGetTransactions'
import getTransactionsWithoutInstallments from '@/lib/getTransactionsWithoutInstallments'

export const description = 'A bar chart'

const chartConfig = {
	category: {
		label: 'Categoria',
		color: 'hsl(var(--chart-1))',
	},
} satisfies ChartConfig

const dateParams = {
	startDate: startOfMonth(new Date()),
	endDate: endOfMonth(new Date()),
}

const ExpensesByCategoryInMonthChart = () => {
	const { categories } = useGetCategory({ type: 'expense' })
	const { transactions } = useGetTransactions({
		type: 'expense',
		...dateParams,
	})

	const chartData = categories.map((c) => {
		const expensesInThisCategory = getTransactionsWithoutInstallments(
			transactions.filter((t) => t.categoryId == c.id),
		)

		const amount = expensesInThisCategory.reduce(
			(acc, expense) => acc + expense!.amount,
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
				<CardTitle>Despesas por categoria (mês)</CardTitle>
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
