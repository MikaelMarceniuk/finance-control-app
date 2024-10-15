import { Transaction } from '@prisma/client'

const getTransactionsWithoutInstallments = (data: Transaction[]) => {
	return data.filter((t) => {
		if (!t.isInstallment) return true

		// Ignoring parentTransactions
		if (t.isInstallment && !t.parentTransactionId) return false

		return true
	})
}

export default getTransactionsWithoutInstallments
