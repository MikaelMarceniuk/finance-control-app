'use server'

import prisma from '@/lib/prisma'
import { ETransactionType } from '@prisma/client'

export type UpdateTransactionApiParams = {
	id: string
	description: string
	amount: number
	type: ETransactionType
	date: Date
	categoryId: string
}

const UpdateTransactionApi = async ({
	id,
	description,
	amount,
	type,
	date,
	categoryId,
}: UpdateTransactionApiParams) => {
	try {
		await prisma.transaction.update({
			data: {
				description,
				amount,
				type,
				date,
				categoryId,
			},
			where: {
				id,
			},
		})
	} catch (e) {
		console.log('Error in UpdateTransaction: ', e)
		return {
			isSuccess: false,
			message: 'Failed to update transaction. Try again later.',
		}
	}
}

export default UpdateTransactionApi
