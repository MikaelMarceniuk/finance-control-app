'use client'

import GetCategoryApi from '@/api/getCategoryApi'
import useSWR from 'swr'

const useGetCategory = () => {
	const { data, error, isLoading, mutate } = useSWR(
		['category'],
		GetCategoryApi,
	)

	return {
		categories: data?.isSuccess ? data.data : [],
		isLoading,
		isError: Boolean(error),
		error,
		mutate,
	}
}

export default useGetCategory
