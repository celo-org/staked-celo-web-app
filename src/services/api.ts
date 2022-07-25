import axios from 'axios';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

type ActionType = 'withdraw' | 'claim';

const apiService = axios.create({ baseURL: NEXT_PUBLIC_API_URL });

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
