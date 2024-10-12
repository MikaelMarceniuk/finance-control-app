'use server'

import prisma from '@/lib/prisma'
import { Category, Prisma } from '@prisma/client'

const AddCategoryApi = async (
	data: Prisma.CategoryCreateInput,
): Promise<Category> => {
	return await prisma.category.create({ data })
}

export default AddCategoryApi
