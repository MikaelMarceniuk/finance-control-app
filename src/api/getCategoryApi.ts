'use server'

import axiosInstance from '@/lib/axios'
import { isWithinInterval } from 'date-fns'

type ApiResponse = {
	id: string
	name: string
}

type GetCategoryApiSuccessResponse = {
	isSuccess: true
	data: ApiResponse[]
}

type GetCategoryApiErrorResponse = {
	isSuccess: false
	message: string
}

type GetCategoryApiResponse =
	| GetCategoryApiSuccessResponse
	| GetCategoryApiErrorResponse

const GetCategoryApi = async (): Promise<GetCategoryApiResponse> => {
	try {
		const apiResp = await axiosInstance.get<ApiResponse[]>('/category')

		if (apiResp.status == 200) {
			return {
				isSuccess: true,
				data: apiResp.data,
			}
		}

		return {
			isSuccess: false,
			message: 'Error in creating category. Try again.',
		}
	} catch (e) {
		console.log('Error in GetCategoryApi: ', e)
		return {
			isSuccess: false,
			message: 'Failed to create category. Try again later.',
		}
	}
}

export default GetCategoryApi
