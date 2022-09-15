import axios from 'axios';

type ActionType =  'activate' | 'withdraw' | 'claim';

export const createAPI = (baseURL: string) => {
  const apiService = axios.create({ baseURL });

  const sendRequest = async (action: ActionType, address?: string) => {
    if (!baseURL) return;
    await apiService.post('/', {
      beneficiary: address,
      type: action,
    });
  };

  const activate = () => sendRequest('activate');
  const withdraw = (address: string) => sendRequest('withdraw', address);
  const claim = (address: string) => sendRequest('claim', address);

  return {
    activate,
    withdraw,
    claim,
  };
};
