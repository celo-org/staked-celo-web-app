import { DISPLAY_DECIMALS } from 'src/config/consts';
import { TokenCard } from 'src/features/stake/FormTemplate';
import { useEstimations } from 'src/features/stake/useEstimations';

interface ReceiveSummaryProps {
  amount: number | undefined;
}

export const ReceiveSummary = (props: ReceiveSummaryProps) => {
  const { estimateDepositValue } = useEstimations();
  const value = props.amount && estimateDepositValue(props.amount);

  return (
    <TokenCard
      classes="w-full"
      token="stCELO"
      titleChild="Receive"
      inputChild={value ? value.toFixed(DISPLAY_DECIMALS) : 0.0}
      infoChild={<span className="text-pear">4.56% projected APY</span>}
    />
  );
};
