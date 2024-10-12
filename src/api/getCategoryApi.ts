'use server'

import prisma from '@/lib/prisma'
import { Category, ETransactionType } from '@prisma/client'

export type GetGategoryApiParams = {
	type: ETransactionType
}

const GetCategoryApi = async ({
	type,
}: GetGategoryApiParams): Promise<Category[]> => {
	return await prisma.category.findMany({ where: { type: { equals: type } } })
}

export default GetCategoryApi
