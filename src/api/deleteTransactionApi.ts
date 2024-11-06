'use server'

import prisma from '@/lib/prisma'

export type DeleteTransactionApiParams = {
	id: string
}

const DeleteTransactionApi = async ({ id }: DeleteTransactionApiParams) => {
	try {
		await prisma.transaction.delete({
			where: {
				id,
			},
		})
	} catch (e) {
		console.log('Error in DeleteTransactionApi: ', e)
		return {
			isSuccess: false,
			message: 'Failed to delete transaction. Try again later.',
		}
	}
}

export default DeleteTransactionApi
