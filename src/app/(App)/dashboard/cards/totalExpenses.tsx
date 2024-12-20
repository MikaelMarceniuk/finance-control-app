'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import useGetTransactions from '@/hooks/useGetTransactions'
import moneyFormatter from '@/lib/moneyFormatter'
import { endOfMonth, startOfMonth } from 'date-fns'

const TotalExpensesCard = () => {
	const { totalAmount } = useGetTransactions({
		type: 'expense',
		startDate: startOfMonth(new Date()),
		endDate: endOfMonth(new Date()),
	})

	return (
		<Card className="h-fit w-full max-w-96">
			<CardHeader>
				<CardTitle>Despesas total (mês)</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<span className="text-3xl font-bold">
					{moneyFormatter.format(Math.abs(totalAmount / 100))}
				</span>
			</CardContent>
		</Card>
	)
}

export default TotalExpensesCard
