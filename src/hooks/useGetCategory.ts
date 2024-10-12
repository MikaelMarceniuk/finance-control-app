'use client'

import GetCategoryApi, { GetGategoryApiParams } from '@/api/getCategoryApi'
import useSWR from 'swr'

const useGetCategory = ({ type }: GetGategoryApiParams) => {
	const { data, error, isLoading, mutate } = useSWR(['category', 'type'], () =>
		GetCategoryApi({ type }),
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
