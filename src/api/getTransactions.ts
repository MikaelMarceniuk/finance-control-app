'use server'

import prisma from '@/lib/prisma'
import { Category, ETransactionType } from '@prisma/client'

type TransactionsWithChildrens = {
	id: string
	description: string
	amount: number
	type: ETransactionType
	date: Date
	createAt: Date
	categoryId: string
	isInstallment: boolean
	installmentAmount: number | null
	installmentNumber: number | null
	parentTransactionId: string | null
	category: Category
}

export type TransactionsOrderBy = {
	amount?: 'asc' | 'desc'
	date?: 'asc' | 'desc'
}

export type GetTransactionsApiParams = {
	type?: ETransactionType
	startDate?: Date
	endDate?: Date
	categoryId?: string[]
	orderBy?: TransactionsOrderBy
}

const GetTransactionsApi = async ({
	type,
	startDate,
	endDate,
	categoryId,
	orderBy,
}: GetTransactionsApiParams): Promise<TransactionsWithChildrens[]> => {
	return await prisma.transaction.findMany({
		where: {
			type: {
				equals: type,
			},
			date: {
				gte: startDate,
				lte: endDate,
			},
			categoryId: {
				in: categoryId,
			},
		},
		include: {
			category: true,
		},
		orderBy,
	})
}

export default GetTransactionsApi
