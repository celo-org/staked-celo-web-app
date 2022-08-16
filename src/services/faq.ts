export interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: 'What is StakedCelo?',
    answer:
      'StakedCelo is Celo’s native liquid staking protocol. It allows anyone to stake CELO and receive epoch rewards with a single transaction. This is possible through StakedCelo smart contracts or the StakedCelo WebApp. Alternatively, users can buy stCELO on decentralized exchanges.',
  },
  {
    question: 'How does StakedCelo work?',
    answer: `The protocol stakes deposited CELO on the user’s behalf, earns the epoch rewards associated with staking and then shares them with the user. Users receive stCELO tokens representing their deposits. <br /><br />stCELO is an ERC20 compatible token. They can be used like regular tokens to earn yields and lending rewards or be traded on dApps in the ecosystem. When using StakedCelo, users receive secure staking rewards in real-time, allowing for participation in the securing of the Celo network without the downside of reduced liquidity through locked tokens.`,
  },
  {
    question: 'What is liquid staking?',
    answer:
      'Liquid staking protocols allow users to earn staking rewards without locking assets or maintaining staking infrastructure. Users can deposit tokens and receive tradable liquid tokens in return. The funds are controlled by smart contracts in a non-custodial manner.',
  },
  {
    question: 'Why is 1 stCELO not equal 1 CELO?',
    answer:
      'stCELO is an ERC20 compatible token, which means that the amount of token a user has in their wallet stays constant over time if that user takes no actions (meaning the token is not rebasing). Consequently, one stCELO is increasing in value over time, as epoch rewards are being earned by the protocol. Note that this only describes the value of stCELO and CELO when being staked and unstaked via the StakedCelo protocol. Prices on decentralized exchanges are subject to market conditions and not predictable per se.',
  },
  {
    question: 'What is the difference between StakedCelo and stCELO',
    answer:
      'StakedCelo is the name of the protocol and stCELO is the ERC20 token users receive when staking their CELO with the protocol.',
  },
  {
    question: 'How is StakedCelo secure?',
    answer:
      'StakedCelo has been audited and the reports are published <a class="underline" target="_blank" href="https://github.com/celo-org/staked-celo/tree/master/audit">here</a>.',
  },
  {
    question: 'How long is stCelo locked?',
    answer:
      'To withdraw stCELO from the protocol and transfer it into unlocked CELO a waiting period of 3 days has to elapse. This is based on the Celo core contracts and the same waiting period as if Celo is staked individually.',
  },
  {
    question: 'How does unstaking work?',
    answer:
      'After a user unstakes stCELO, the WebApp ensures that all the votes for the validator groups are withdrawn. Then the three day waiting period starts. After this has ended, the WebApp automatically claims the now available CELO, which then appears in the user’s wallet (see “Deposit and withdrawal flows” in the documentation for details). The claiming should take about 5 minutes. If it takes longer, the WebApp backend is not working properly. Feel free to ping us on Discord in this case.',
  },
  {
    question: 'Why do I see “Still claiming…” after unstaking stCELO and waiting for three days?',
    answer: 'See the FAQ “How does unstaking work?”.',
  },
  {
    question: 'What are the risks of staking with StakedCelo?',
    answer:
      'There exist a number of potential risks when staking with StakedCelo, in particular smart contract security, which we discuss in more detail here. There is an inherent risk that StakedCelo could contain a smart contract vulnerability or bug. The code is open source and has been audited, however, this provides no guarantee that it will always perform as intended.',
  },
  {
    question: 'What fee is applied by StakedCelo?',
    answer:
      'For the launch of the protocol there are no fees. This might change at a later point in time as the protocol grows and more maintenance is required.',
  },
];

export const getFaqItems = () => faqItems;
