import axios from 'axios';

type ActionType =
  | 'activate'
  | 'withdraw'
  | 'claim'
  | ['rebalanceDefault', 'rebalance', 'revoke', 'activate']; // must be this order

export const createAPI = (baseURL: string) => {
  const apiService = axios.create({ baseURL });

  const sendRequest = async (action: ActionType, address?: string) => {
    if (!baseURL) return;
    return apiService.post('/', {
      beneficiary: address,
      type: action,
    });
  };

  const afterDeposit = async () => {
    return sendRequest(['rebalanceDefault', 'rebalance', 'revoke', 'activate']);
  };

  const activate = () => sendRequest('activate');
  const withdraw = (address: string) => sendRequest('withdraw', address);
  const claim = (address: string) => sendRequest('claim', address);

  return {
    activate,
    withdraw,
    claim,
    afterDeposit,
  };
};
