'use server'

import prisma from '@/lib/prisma'
import { Category, ETransactionType } from '@prisma/client'

export type GetGategoryApiParams = {
	type?: ETransactionType
	userId: string
}

const GetCategoryApi = async ({
	type,
	userId,
}: GetGategoryApiParams): Promise<Category[]> => {
	return await prisma.category.findMany({
		where: {
			type: {
				equals: type,
			},
			userId: {
				equals: userId,
			},
		},
	})
}

export default GetCategoryApi
