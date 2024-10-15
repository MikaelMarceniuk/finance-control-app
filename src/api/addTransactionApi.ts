'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { addMonths } from 'date-fns'

type AddTransactionErrorResponse = {
	isSuccess: false
	message: string
}

const AddTransactionApi = async (
	data: Prisma.TransactionUncheckedCreateInput,
): Promise<undefined | AddTransactionErrorResponse> => {
	try {
		const newTransaction = await prisma.transaction.create({ data })

		const { isInstallment, installmentAmount } = data
		if (isInstallment && installmentAmount && installmentAmount > 1) {
			const installments: Prisma.TransactionUncheckedCreateInput[] = []
			for (let i = 0; i < installmentAmount; i++) {
				installments.push({
					...data,
					amount: newTransaction.amount / installmentAmount,
					installmentNumber: i + 1,
					parentTransactionId: newTransaction.id,
					date: addMonths(data.date, i),
				})
			}

			await prisma.transaction.createMany({ data: installments })
		}
	} catch (e) {
		console.log('Error in AddTransaction: ', e)
		return {
			isSuccess: false,
			message: 'Failed to create transaction. Try again later.',
		}
	}
}

export default AddTransactionApi
