'use client'

import GetCategoryApi, { GetGategoryApiParams } from '@/api/getCategoryApi'
import useSWR from 'swr'

const useGetCategory = (params: GetGategoryApiParams) => {
	const { data, error, isLoading, mutate } = useSWR(
		['category', { ...params }],
		() => GetCategoryApi(params),
	)

	return {
		categories: data || [],
		isLoading,
		isError: Boolean(error),
		error,
		mutate,
	}
}

export default useGetCategory
