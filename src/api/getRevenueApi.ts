'use server'

import axiosInstance from '@/lib/axios'
import { isWithinInterval } from 'date-fns'

type ApiResponse = {
	id: string
	description: string
	amount: number
	date: string
}

type GetRevenueApiSuccessResponse = {
	isSuccess: true
	data: ApiResponse[]
}

type GetRevenueApiErrorResponse = {
	isSuccess: false
	message: string
}

type GetRevenueApiResponse =
	| GetRevenueApiSuccessResponse
	| GetRevenueApiErrorResponse

type GetRevenueApiParams = {
	startDate: Date
	endDate: Date
}

const GetRevenueApi = async ({
	startDate,
	endDate,
}: GetRevenueApiParams): Promise<GetRevenueApiResponse> => {
	try {
		const apiResp = await axiosInstance.get<ApiResponse[]>('/revenue')

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
			message: 'Error in creating revenue. Try again.',
		}
	} catch (e) {
		console.log('Error in GetRevenueApi: ', e)
		return {
			isSuccess: false,
			message: 'Failed to create revenue. Try again later.',
		}
	}
}

export default GetRevenueApi
