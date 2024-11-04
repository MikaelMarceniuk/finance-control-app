import GetTransactionInfo, {
	GetTransactionInfoParams,
} from '@/api/getTransactionInfo'
import useSWR from 'swr'

const useGetTransactionInfo = ({ id }: Partial<GetTransactionInfoParams>) => {
	const { data, error, isLoading, mutate } = useSWR(['transaction', id], () => {
		if (!id) return null
		return GetTransactionInfo({ id })
	})

	return {
		transaction: data,
		isLoading,
		isError: Boolean(error),
		error,
		mutate,
	}
}

export default useGetTransactionInfo
