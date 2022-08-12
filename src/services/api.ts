import axios from 'axios';

type ActionType = 'withdraw' | 'claim';

export const createAPI = (baseURL: string) => {
  const apiService = axios.create({ baseURL });

  const sendRequest = async (address: string, action: ActionType) => {
    if (!baseURL) return;
    await apiService.post('/', {
      beneficiary: address,
      type: action,
    });
  };

  const withdraw = (address: string) => sendRequest(address, 'withdraw');
  const claim = (address: string) => sendRequest(address, 'claim');

  return {
    withdraw,
    claim,
  };
};
