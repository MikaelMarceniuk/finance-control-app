'use server'

import axiosInstance from '@/lib/axios'

type AddRevenueApiParams = {
	description: string
	amount: number
	date: Date
}

type AddRevenueApiSuccessResponse = {
	isSuccess: true
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
		await axiosInstance.post('/revenue', body)

		return {
			isSuccess: true,
		}
	} catch (e) {
		console.log('Error in AddRevenueApi: ', e.message)
		return {
			isSuccess: false,
			message: 'Failed to create revenue. Try again later.',
		}
	}
}

export default AddRevenueApi
