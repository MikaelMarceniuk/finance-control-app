'use server'

import axiosInstance from '@/lib/axios'
import { isWithinInterval } from 'date-fns'

type ApiResponse = {
	id: string
	description: string
	amount: number
	date: string
	category: {
		id: string
		name: string
	}
	installmentAmout: number
	installment: number
}

type GetExpenseApiSuccessResponse = {
	isSuccess: true
	data: ApiResponse[]
}

type GetExpenseApiErrorResponse = {
	isSuccess: false
	message: string
}

export type GetExpenseApiParams = {
	startDate: Date
	endDate: Date
}

type GetExpenseResponse =
	| GetExpenseApiSuccessResponse
	| GetExpenseApiErrorResponse

const GetExpenseApi = async ({
	startDate,
	endDate,
}: GetExpenseApiParams): Promise<GetExpenseResponse> => {
	try {
		const apiResp = await axiosInstance.get<ApiResponse[]>('/expense')

		if (apiResp.status == 200) {
			return {
				isSuccess: true,
				data: apiResp.data.filter((p) =>
					isWithinInterval(new Date(p.date), {
						start: startDate,
						end: endDate,
					}),
				),
			}
		}

		return {
			isSuccess: false,
			message: 'Error in getting expenses. Try again.',
		}
	} catch (e) {
		console.log('Error in GetExpenseApi: ', e)
		return {
			isSuccess: false,
			message: 'Failed to get expenses. Try again later.',
		}
	}
}

export default GetExpenseApi
