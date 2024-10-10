'use server'

import axiosInstance from '@/lib/axios'

type ApiResponse = {
	id: string
	description: string
	amount: number
	date: Date
}

type AddRevenueApiParams = {
	description: string
	amount: number
	date: Date
}

type AddRevenueApiSuccessResponse = {
	isSuccess: true
	data: ApiResponse
}

type AddRevenueApiErrorResponse = {
	isSuccess: false
	message: string
}

type AddRevenueResponse =
	| AddRevenueApiSuccessResponse
	| AddRevenueApiErrorResponse

const AddRevenueApi = async (
	body: AddRevenueApiParams,
): Promise<AddRevenueResponse> => {
	try {
		const apiResp = await axiosInstance.post<ApiResponse>('/revenue', body)

		return {
			isSuccess: true,
			data: apiResp.data,
		}
	} catch (e) {
		console.log('Error in AddRevenueApi: ', e)
		return {
			isSuccess: false,
			message: 'Failed to create revenue. Try again later.',
		}
	}
}

export default AddRevenueApi
