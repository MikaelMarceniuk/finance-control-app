'use client'

import CurrentBalanceCard from './cards/currentBalance'
import TotalExpensesCard from './cards/totalExpenses'
import TotalRevenueCard from './cards/totalRevenue'
import RevenueInMonth from './charts/revenueInMonth'
import ExpensesInMonthChart from './charts/expensesInMonth'
import AddRevenueDialog from './dialogs/addRevenue'
import AddExpenseDialog from './dialogs/addExpense'

const DashboardPage = () => {
	return (
		<div className="min-h-screen space-y-4 px-4 py-4">
			<div className="flex justify-between">
				<h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
				<div className="flex gap-2">
					<AddRevenueDialog />
					<AddExpenseDialog />
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<TotalRevenueCard />
				<TotalExpensesCard />
				<CurrentBalanceCard />
			</div>

			<div className="grid grid-cols-8 gap-4">
				<RevenueInMonth />
				<ExpensesInMonthChart />
			</div>
		</div>
	)
}

export default DashboardPage
