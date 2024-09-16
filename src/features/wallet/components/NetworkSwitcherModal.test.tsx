import { render } from '@testing-library/react';
import { NetworkSwitcherModal } from 'src/features/wallet/components/NetworkSwitcherModal';
import { celo, celoAlfajores } from 'viem/chains';
import { describe, expect, test, vi } from 'vitest';

describe('<NetworkSwitcherModal />', () => {
  test('it shows unambiguous networks names on open modal', () => {
    vi.mock('wagmi', () => ({
      useChainId: () => 42220,
      useSwitchChain: () => {
        return { chains: [celo, celoAlfajores], status: 'idle', switchChain: () => null };
      },
    }));

    const result = render(<NetworkSwitcherModal isOpen={true} close={() => null} />);

    expect(result.getAllByText('Alfajores Testnet')).toHaveLength(1);
    expect(result.getAllByText('Celo Mainnet')).toHaveLength(1);

    vi.clearAllMocks();
  });
});
