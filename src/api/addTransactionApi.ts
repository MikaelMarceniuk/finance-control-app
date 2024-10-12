'use server'

import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { addMonths } from 'date-fns'

type AddTransactionApiParams = {
	transactionData: Prisma.TransactionUncheckedCreateInput
	hasInstallment: boolean
	installmentAmount: number
}

type AddTransactionErrorResponse = {
	isSuccess: false
	message: string
}

const AddTransactionApi = async ({
	transactionData,
	hasInstallment,
	installmentAmount,
}: AddTransactionApiParams): Promise<
	undefined | AddTransactionErrorResponse
> => {
	try {
		const newTransaction = await prisma.transaction.create({
			data: transactionData,
		})

		if (hasInstallment) {
			const installmentDatas: Prisma.InstallmentsCreateManyInput[] = []
			for (let i = 0; i < installmentAmount; i++) {
				installmentDatas.push({
					number: i + 1,
					amount: newTransaction.amount / installmentAmount,
					dueDate: addMonths(new Date(newTransaction.date), i),
					transactionId: newTransaction.id,
				})
			}

			await prisma.installments.createMany({ data: installmentDatas })
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
