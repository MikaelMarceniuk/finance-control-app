import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useGetRevenue from '@/hooks/useGetRevenue'
import moneyFormatter from '@/lib/moneyFormatter'
import { endOfMonth, startOfMonth } from 'date-fns'

const TotalRevenueCard = () => {
	const { totalRevenue } = useGetRevenue({
		startDate: startOfMonth(new Date()),
		endDate: endOfMonth(new Date()),
	})

	return (
		<Card className="w-full max-w-96">
			<CardHeader>
				<CardTitle>Receita total (mês)</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<span className="text-3xl font-bold">
					{moneyFormatter.format(totalRevenue / 100)}
				</span>
				<p>
					<span className="text-green-600">+40%</span> em relacao ao mes passado
				</p>
			</CardContent>
		</Card>
	)
}

export default TotalRevenueCard
