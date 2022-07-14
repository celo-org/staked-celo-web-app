const estDepositValue = (amount: number) => amount * 1.03;

export function useEstimate() {
  return {
    estDepositValue,
  };
}
