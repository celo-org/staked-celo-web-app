import { DISPLAY_DECIMALS } from 'src/config/consts';
import { TokenCard } from 'src/features/stake/FormTemplate';
import { useEstimations } from 'src/features/stake/useEstimations';

interface ReceiveSummaryProps {
  amount: number | undefined;
}

export const ReceiveSummary = ({ amount }: ReceiveSummaryProps) => {
  const { estimateDepositValue } = useEstimations();
  const estimatedValue = amount && estimateDepositValue(amount);
  const displayValue = estimatedValue ? estimatedValue.toFixed(DISPLAY_DECIMALS) : 0.0;

  return (
    <TokenCard
      classes="w-full"
      token="stCELO"
      titleChild="Receive"
      inputChild={displayValue}
      infoChild={<span className="text-pear">4.56% projected APY</span>}
    />
  );
};
