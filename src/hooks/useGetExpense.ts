import GetExpenseApi, { GetExpenseApiParams } from '@/api/getExpenseApi'
import useSWR from 'swr'

const useGetExpense = (apiParams: GetExpenseApiParams) => {
	const { data, error, isLoading } = useSWR(
		'http://localhost:3010/expense',
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
	}
}

export default useGetExpense
