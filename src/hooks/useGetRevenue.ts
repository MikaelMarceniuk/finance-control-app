import { GetExpenseApiParams } from '@/api/getExpenseApi'
import GetRevenueApi from '@/api/getRevenueApi'
import useSWR from 'swr'

const useGetRevenue = (apiParams: GetExpenseApiParams) => {
	const { data, error, isLoading, mutate } = useSWR(
		['revenue', { start: apiParams.startDate, end: apiParams.endDate }],
		() => GetRevenueApi(apiParams),
	)

	let totalRevenue = 0
	if (data?.isSuccess) {
		totalRevenue = data.data.reduce(
			(prevVal, currentVal) => prevVal + currentVal.amount,
			0,
		)
	}

	return {
		revenue: data?.isSuccess ? data.data : [],
		totalRevenue,
		isLoading,
		isError: Boolean(error),
		error,
		mutate,
	}
}

export default useGetRevenue
