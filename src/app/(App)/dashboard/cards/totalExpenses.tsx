import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TotalExpensesCard = () => {
	return (
		<Card className="w-full max-w-96">
			<CardHeader>
				<CardTitle>Despesas total (mês)</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<span className="text-3xl font-bold">R$ 1.000,30</span>
				<p>
					<span className="text-red-600">-60%</span> em relacao ao mes passado
				</p>
			</CardContent>
		</Card>
	)
}

export default TotalExpensesCard
