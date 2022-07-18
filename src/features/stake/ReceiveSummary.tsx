import { DISPLAY_DECIMALS } from 'src/config/consts';
import { TokenCard } from 'src/features/stake/FormTemplate';
import { useEstimations } from 'src/features/stake/useEstimations';

interface ReceiveSummaryProps {
  amount: number | undefined;
}

export const ReceiveSummary = (props: ReceiveSummaryProps) => {
  const { estimateDepositValue } = useEstimations();
  const value = props.amount && estimateDepositValue(props.amount);
  const estimatedRate: number = estimateDepositValue(1);

  return (
    <TokenCard
      classes="w-full"
      token="stCELO"
      titleChild="Receive"
      inputChild={value ? value.toFixed(DISPLAY_DECIMALS) : 0.0}
      infoChild={estimatedRate ? `1 stCELO ~ ${estimatedRate} CELO` : 'Loading...'}
    />
  );
};
