'use client'

import GetExpenseApi, { GetExpenseApiParams } from '@/api/getExpenseApi'
import useSWR from 'swr'

const useGetExpense = (apiParams: GetExpenseApiParams) => {
	const { data, error, isLoading, mutate } = useSWR(
		['expense', { start: apiParams.startDate, end: apiParams.endDate }],
		() => GetExpenseApi(apiParams),
	)

	let totalExpense = 0
	if (data?.isSuccess) {
		totalExpense = data?.data.reduce(
			(prevVal, currentVal) => prevVal + currentVal.amount,
			0,
		)
	}

	return {
		expenses: data?.isSuccess ? data.data : [],
		totalExpense,
		isLoading,
		isError: Boolean(error),
		error,
		mutate,
	}
}

export default useGetExpense
