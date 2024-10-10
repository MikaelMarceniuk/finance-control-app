'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useGetExpense from '@/hooks/useGetExpense'
import moneyFormatter from '@/lib/moneyFormatter'
import { endOfMonth, startOfMonth } from 'date-fns'

const TotalExpensesCard = () => {
	const { totalExpense } = useGetExpense({
		startDate: startOfMonth(new Date()),
		endDate: endOfMonth(new Date()),
	})

	return (
		<Card className="w-full max-w-96">
			<CardHeader>
				<CardTitle>Despesas total (mês)</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<span className="text-3xl font-bold">
					{moneyFormatter.format(totalExpense / 100)}
				</span>
				<p>
					<span className="text-red-600">-60%</span> em relacao ao mes passado
				</p>
			</CardContent>
		</Card>
	)
}

export default TotalExpensesCard
