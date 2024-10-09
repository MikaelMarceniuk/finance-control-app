'use client'

import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A multiple line chart'

const chartData = [
	{ month: 'January', revenue: 186, expenses: 80 },
	{ month: 'February', revenue: 305, expenses: 200 },
	{ month: 'March', revenue: 237, expenses: 120 },
	{ month: 'April', revenue: 73, expenses: 190 },
	{ month: 'May', revenue: 209, expenses: 130 },
	{ month: 'June', revenue: 214, expenses: 140 },
]

const chartConfig = {
	revenue: {
		label: 'Revenue',
		color: 'hsl(var(--chart-1))',
	},
	expenses: {
		label: 'Expenses',
		color: 'hsl(var(--chart-2))',
	},
} satisfies ChartConfig

const RevenueInMonth = () => {
	return (
		<Card className="col-span-4">
			<CardHeader>
				<CardTitle>Receitas e Despesas no periodo (semana)</CardTitle>
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
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
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

export default RevenueInMonth
