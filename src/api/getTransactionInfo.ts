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

export type GetTransactionInfoParams = {
	id: string
}

const GetTransactionInfo = async ({
	id,
}: GetTransactionInfoParams): Promise<TransactionsWithChildrens | null> => {
	return await prisma.transaction.findUnique({
		where: {
			id,
		},
		include: {
			category: true,
		},
	})
}

export default GetTransactionInfo
