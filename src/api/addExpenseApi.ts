'use server'

import axiosInstance from '@/lib/axios'
import { add } from 'date-fns'

type apiResponse = {
	id: string
	description: string
	amount: number
	date: Date
	category: {
		id: number
		label: string
	}
	installmentAmout: number
	installment: number
}

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
	data: apiResponse[]
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
	const reqResponses: apiResponse[] = []

	for (let i = 0; i < installmentAmout; i++) {
		try {
			const apiResp = await axiosInstance.post<apiResponse>('/expense', {
				...body,
				amount: body.amount / installmentAmout,
				installment: i + 1,
				date: add(date, { months: i }),
			})

			reqResponses.push(apiResp.data)
		} catch (e) {
			console.log('Error creating revenue: ', e)
		}
	}

	if (reqResponses.length == installmentAmout) {
		return {
			isSuccess: true,
			data: reqResponses,
		}
	}

	return {
		isSuccess: false,
		message: 'Failed to add expense. Try again later',
	}
}

export default AddExpenseApi
