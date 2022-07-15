const estimateDepositValue = (amount: number) => amount * 1.03;

export function useEstimations() {
  return {
    estimateDepositValue,
  };
}
