'use client'

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import useGetRevenue from '@/hooks/useGetRevenue'
import useGetExpense from '@/hooks/useGetExpense'
import {
	eachMonthOfInterval,
	endOfMonth,
	endOfYear,
	format,
	isWithinInterval,
	startOfMonth,
	startOfYear,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

const chartConfig = {
	revenue: {
		label: 'Receitas',
		color: 'hsl(var(--chart-1))',
	},
	expenses: {
		label: 'Despesas',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig

const dateParams = {
	startDate: startOfYear(new Date()),
	endDate: endOfYear(new Date()),
}

const RevenueAndExpensesInMonthChart = () => {
	const { revenue } = useGetRevenue(dateParams)
	const { expenses } = useGetExpense(dateParams)

	const getMonthName = (date: Date) => format(date, 'MMMM', { locale: ptBR })

	const chartData = eachMonthOfInterval({
		start: dateParams.startDate,
		end: dateParams.endDate,
	}).map((date) => {
		const monthStart = startOfMonth(date)
		const monthEnd = endOfMonth(date)

		const revenuesInMonth = revenue
			.filter((r) =>
				isWithinInterval(new Date(r.date), {
					start: monthStart,
					end: monthEnd,
				}),
			)
			.reduce((acc, currentVal) => acc + currentVal.amount, 0)

		const expensesInMonth = expenses
			.filter((r) =>
				isWithinInterval(new Date(r.date), {
					start: monthStart,
					end: monthEnd,
				}),
			)
			.reduce((acc, currentVal) => acc + currentVal.amount, 0)

		return {
			month: getMonthName(date),
			revenue: revenuesInMonth / 100,
			expenses: expensesInMonth / 100,
		}
	})

	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Receitas e Despesas no periodo (mes)</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent formatValueToCurrency />}
						/>
						<Line
							dataKey="revenue"
							type="monotone"
							stroke="var(--color-revenue)"
							strokeWidth={2}
							dot={false}
						/>
						<Line
							dataKey="expenses"
							type="monotone"
							stroke="var(--color-expenses)"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export default RevenueAndExpensesInMonthChart
