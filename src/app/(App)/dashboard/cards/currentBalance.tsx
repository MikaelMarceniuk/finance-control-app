'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useGetExpense from '@/hooks/useGetExpense'
import useGetRevenue from '@/hooks/useGetRevenue'
import moneyFormatter from '@/lib/moneyFormatter'
import { endOfMonth, startOfMonth } from 'date-fns'

const apiParams = {
	startDate: startOfMonth(new Date()),
	endDate: endOfMonth(new Date()),
}

const CurrentBalanceCard = () => {
	const { totalRevenue } = useGetRevenue(apiParams)
	const { totalExpense } = useGetExpense(apiParams)

	const currentBalance = totalRevenue - totalExpense

	return (
		<Card className="h-fit w-full max-w-96">
			<CardHeader>
				<CardTitle>Saldo Atual (mês)</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<span className="text-3xl font-bold">
					{moneyFormatter.format(currentBalance / 100)}
				</span>
			</CardContent>
		</Card>
	)
}

export default CurrentBalanceCard
