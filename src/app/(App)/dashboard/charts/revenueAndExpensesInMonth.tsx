'use client'

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
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
import useGetTransactions from '@/hooks/useGetTransactions'
import getTransactionsWithoutInstallments from '@/lib/getTransactionsWithoutInstallments'

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
	const { transactions } = useGetTransactions(dateParams)

	const getMonthName = (date: Date) => format(date, 'MMMM', { locale: ptBR })

	const chartData = eachMonthOfInterval({
		start: dateParams.startDate,
		end: dateParams.endDate,
	}).map((date) => {
		const intervalValues = {
			start: startOfMonth(date),
			end: endOfMonth(date),
		}

		const revenuesInMonth = transactions
			.filter((t) => t.type == 'revenue')
			.filter((r) => isWithinInterval(new Date(r.date), intervalValues))
			.reduce((acc, currentVal) => acc + currentVal.amount, 0)

		const expensesInMonth = getTransactionsWithoutInstallments(transactions)
			.filter((e) => e.type == 'expense')
			.filter((e) => isWithinInterval(new Date(e.date), intervalValues))
			.reduce((acc, currentVal) => acc + currentVal!.amount, 0)

		return {
			month: getMonthName(date),
			revenue: revenuesInMonth / 100,
			expenses: expensesInMonth / 100,
		}
	})

	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Receitas e Despesas no periodo (mês)</CardTitle>
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
