import axios from 'axios'

const axiosInstance = axios.create({
	baseURL: 'http://localhost:3010',
})

export default axiosInstance
