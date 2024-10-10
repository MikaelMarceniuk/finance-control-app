'use server'

import axiosInstance from '@/lib/axios'
import { add } from 'date-fns'

type AddExpenseApiParams = {
	description: string
	amount: number
	date: Date
	category: {
		id: number
		label: string
	}
	installmentAmout: number
}

type AddExpenseApiSuccessResponse = {
	isSuccess: true
	message: undefined
}

type AddExpenseApiErrorResponse = {
	isSuccess: false
	message: string
}

type AddRevenueResponse =
	| AddExpenseApiSuccessResponse
	| AddExpenseApiErrorResponse

const AddExpenseApi = async (
	body: AddExpenseApiParams,
): Promise<AddRevenueResponse> => {
	const { installmentAmout, date } = body
	const reqResponses = []

	for (let i = 0; i < installmentAmout; i++) {
		try {
			await axiosInstance.post('/expense', {
				...body,
				amount: (body.amount / installmentAmout) * 100,
				installment: i + 1,
				date: add(date, { months: i + 1 }),
			})

			reqResponses.push(200)
		} catch (e) {
			console.log('Error creating revenue: ', e)
			reqResponses.push(500)
		}
	}

	return {
		isSuccess: reqResponses.every((p) => p == 200),
		message: reqResponses.some((p) => p == 200)
			? undefined
			: 'Failed to add expense. Try again later',
	} as AddRevenueResponse
}

export default AddExpenseApi
