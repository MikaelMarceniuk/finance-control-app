'use server'

import prisma from '@/lib/prisma'
import { ETransactionType, Installments } from '@prisma/client'

type TransactionsWithInstallments = {
	id: string
	description: string
	amount: number
	type: ETransactionType
	date: Date
	createAt: Date
	categoryId: string
	Installments: Installments[]
}

export type GetTransactionsApiParams = {
	type?: ETransactionType
	startDate?: Date
	endDate?: Date
}

const GetTransactionsApi = async ({
	type,
	startDate,
	endDate,
}: GetTransactionsApiParams): Promise<TransactionsWithInstallments[]> => {
	return await prisma.transaction.findMany({
		where: {
			type: {
				equals: type,
			},
			date: {
				gte: startDate,
				lte: endDate,
			},
		},
		include: {
			Installments: true,
		},
	})
}

export default GetTransactionsApi
