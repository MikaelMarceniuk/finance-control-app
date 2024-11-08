'use client'

import GetCategoryApi from '@/api/getCategoryApi'
import { ETransactionType } from '@prisma/client'
import { useSession } from 'next-auth/react'
import useSWR from 'swr'

type useGetCategoryParams = {
	type?: ETransactionType
}

const useGetCategory = (params: useGetCategoryParams) => {
	const { data: session } = useSession()

	const { data, error, isLoading, mutate } = useSWR(
		['category', { ...params }],
		() => GetCategoryApi({ ...params, userId: session!.user.id }),
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
