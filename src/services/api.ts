import axios from 'axios';

const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_API_ACCESS_TOKEN } = process.env;

type ActionType = 'withdraw' | 'claim';

const apiService = axios.create({ baseURL: NEXT_PUBLIC_API_URL });

apiService.interceptors.request.use((axiosConfig) => ({
  ...axiosConfig,
  headers: { Authorization: NEXT_PUBLIC_API_ACCESS_TOKEN },
}));

const sendRequest = async (address: string, action: ActionType) => {
  if (!NEXT_PUBLIC_API_URL) return;
  await apiService.post('/', {
    beneficiary: address,
    action,
  });
};

const withdraw = (address: string) => sendRequest(address, 'withdraw');
const claim = (address: string) => sendRequest(address, 'claim');

const api = {
  withdraw,
  claim,
};

export default api;