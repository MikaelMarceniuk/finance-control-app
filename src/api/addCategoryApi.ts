'use server'

import axiosInstance from '@/lib/axios'

type apiResponse = {
	id: string
	name: string
}

type AddCategoryApiParams = {
	name: string
}

type AddCategoryApiSuccessResponse = {
	isSuccess: true
	data: apiResponse
}

type AddCategoryApiErrorResponse = {
	isSuccess: false
	message: string
}

type AddCategoryApiResponse =
	| AddCategoryApiSuccessResponse
	| AddCategoryApiErrorResponse

const AddCategoryApi = async (
	body: AddCategoryApiParams,
): Promise<AddCategoryApiResponse> => {
	try {
		const apiResp = await axiosInstance.post<apiResponse>('/category', body)

		return {
			isSuccess: true,
			data: apiResp.data,
		}
	} catch (e) {
		console.log('Error creating revenue: ', e)

		return {
			isSuccess: false,
			message: 'Failed to create category.',
		}
	}
}

export default AddCategoryApi
