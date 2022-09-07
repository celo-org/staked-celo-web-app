import type { NextPage } from 'next';
import { PropsWithChildren, useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { TextLayout } from 'src/layout/TextLayout';

const FaqPage: NextPage = () => {
  return <Faq />;
};

const Faq = () => {
  return (
    <TextLayout header="Frequently asked questions">
      <FaqItem question="What is StakedCelo?">
        StakedCelo is a Celo-native open source liquid staking protocol developed by{' '}
        <Link url="https://clabs.co/">cLabs</Link> to encourage the active participation of users in
        the protocol. It allows anyone to stake CELO to support the network and receive the{' '}
        <EpochRewardsLink /> associated with staking, and at the same time to keep these assets
        liquid so that they can be used to help participate in and engage across other applications
        in the ecosystem. The StakedCelo protocol can be directly accessed through the{' '}
        <Link url="https://docs.stcelo.xyz/contracts/deployed-contracts">
          smart contracts deployed on chain
        </Link>
        , or through a WebApp developed by cLabs. Users can also obtain stCELO on decentralized
        exchanges or engage in the protocol through other third parties that have chosen to
        integrate StakedCelo.
      </FaqItem>
      <FaqItem question="What is liquid staking?">
        Liquid staking protocols allow users to receive staking rewards without locking assets or
        maintaining staking infrastructure to increase active participation in the protocol. Users
        can deposit tokens and receive tradeable liquid tokens in return to further encourage active
        participation of users in the protocol, dApps, and the wider Celo ecosystem. The assets are
        controlled by smart contracts in a non-custodial manner.
      </FaqItem>
      <FaqItem question="How does StakedCelo work?">
        Users can deposit CELO into the StakedCelo protocol and in turn receive stCELO tokens
        representing their assets transferred to the protocol. The protocol stakes deposited CELO
        and receives the <EpochRewardsLink /> associated with staking, which are shared equally
        among all holders of stCELO. The protocol is completely non-custodial, meaning that no one
        can ever withdraw the funds of a given user besides that user themself. At any point in
        time, a user can choose to withdraw their assets from the protocol by returning the stCELO
        and receiving the corresponding CELO (including accrued rewards).
        <br />
        <br />
        Note that the increase in CELO balance for a user only results from receiving{' '}
        <EpochRewardsLink />
        and no lending or borrowing or other activities take place. Unlike other Proof-of-Stake
        protocols, Celo does not reduce the Locked CELO balance of holders if a validator they are
        voting for is slashed. Together, this means that no principal is at risk under normal
        operating circumstances when using StakedCelo.
      </FaqItem>
      <FaqItem question="What are Epoch Rewards and how do they impact StakedCelo?">
        Celo <EpochRewardsLink /> are similar to block rewards in other blockchains and used to
        create several types of incentives which help to keep the blockchain working securely. Among
        others, CELO holders who lock their tokens into{' '}
        <Link url="https://docs.celo.org/celo-codebase/protocol/proof-of-stake/epoch-rewards/locked-gold-rewards">
          Locked CELO
        </Link>
        receive rewards for active participation, including voting for groups that elected
        validators. The StakedCelo protocol receives such rewards as it stakes CELO into Locked
        CELO.
        <br />
        <br />
        These rewards are{' '}
        <Link url="https://docs.celo.org/celo-codebase/protocol/proof-of-stake/epoch-rewards/locked-gold-rewards#introduction-to-locked-celo-rewards">
          automatically compounded
        </Link>{' '}
        at the Celo protocol level. The rewards accruing in the StakedCelo protocol depend on
        several factors, including participants and events. For example, the validator groups that
        StakedCelo votes for and the behavior of their validators (the Slashing Penalty and the
        Uptime Score influence the distributed tokens), the total amount of CELO staked (the reward
        rate is adjusted if the number of staked CELO deviates from the target) or Celo governance
        (Celo governance can vote to change the underlying mechanism fundamentally). More details
        can be found in the Celo docs on <EpochRewardsLink />.
      </FaqItem>
      <FaqItem question="Why is 1 stCELO not equal 1 CELO?">
        stCELO is an ERC-20 compatible non-rebasing token. This means that the amount of tokens a
        user has in their wallet stays constant over time if that user takes no actions.
        Consequently, one stCELO is increasing in value over time (measured in CELO), as epoch
        rewards are being accrued in the protocol. Note that this only describes the value of stCELO
        and CELO when being staked and unstaked via the StakedCelo protocol. Prices on decentralized
        exchanges are subject to market conditions, market fluctuations, and not per se predictable.
      </FaqItem>
      <FaqItem question="What is the difference between StakedCelo and stCELO?">
        StakedCelo is the name of the protocol and stCELO is the ERC20 token users receive when
        staking their CELO with the protocol.
      </FaqItem>
      <FaqItem question="How is StakedCelo secure?">
        StakedCelo has been audited and the reports are published{' '}
        <Link url="https://github.com/celo-org/staked-celo/tree/master/audit">here</Link>.
      </FaqItem>
      <FaqItem question="How long is stCELO locked?">
        To withdraw stCELO from the protocol and transfer it into unlocked CELO a waiting period of
        3 days has to elapse. This is based on the implementation of the Celo protocol (specifically
        the{' '}
        <Link url="https://docs.celo.org/celo-codebase/protocol/proof-of-stake/locked-gold">
          Locked Gold contract
        </Link>
        ) and the same waiting period as if the CELO were staked directly.
      </FaqItem>
      <FaqItem question="How does unstaking work?">
        After a user unstakes stCELO, the WebApp ensures that all the votes for the validator groups
        are withdrawn. Then the three day waiting period starts. After this has ended, the WebApp
        automatically claims the now available CELO, which then appears in the user’s wallet (see{' '}
        <Link url="https://docs.stcelo.xyz/deposit-and-withdrawal-flows">
          “Deposit and withdrawal flows”
        </Link>{' '}
        in the documentation for details). The claiming should take about 5 minutes. If it takes
        longer, the WebApp backend is not working properly. Feel free to contact the core
        engineering team and protocol validators on Discord.
      </FaqItem>
      <FaqItem question="Why do I see “Still claiming…” after unstaking stCELO and waiting for three days?">
        See the FAQ “How does unstaking work?”.
      </FaqItem>
      <FaqItem question="What validator groups does StakedCelo vote for?">
        StakedCelo votes for a group of randomly selected validator groups, adhering to the principles 
        of increasing decentralization and on-chain verifiable neutrality. The details of the selection 
        process are described {' '}
        <Link url="https://docs.stcelo.xyz/voting-for-validator-groups">
          here
        </Link>.
      </FaqItem>
      <FaqItem question="What are the risks of staking with StakedCelo?">
        There exist a number of potential risks when staking with StakedCelo, in particular smart
        contract security, which we discuss in more detail below. There is an inherent risk that
        StakedCelo could contain a smart contract vulnerability or bug. The code is open source and
        has been audited, however, this provides no guarantee that it will always perform as
        intended. Additionally, independently of how CELO is staked, general staking risks apply. In
        particular, the underlying tokens have to be locked up for 3 days, meaning that a user is
        dependent on secondary markets for stCELO for instant liquidity. To access a predictable
        exchange rate of stCELO &gt; CELO withdrawing from the StakedProtocol can be used, however,
        in that case the withdrawal period of 3 days has to be awaited.
      </FaqItem>
      <FaqItem question="What fee is applied by StakedCelo?">
        At this time, there are no fees. This might change at a later point in time and will be
        enacted through on-chain code changes.
      </FaqItem>
    </TextLayout>
  );
};

interface FaqItemProps {
  question: string;
}

const FaqItem = ({ question, children }: PropsWithChildren<FaqItemProps>) => {
  const [opened, setOpened] = useState(false);
  const answerStateClasses = opened ? 'my-[16px]' : 'max-h-0';

  return (
    <div className="mb-[24px] last:mb-0">
      <div
        className="inline-flex flex-row w-full cursor-pointer"
        onClick={() => setOpened(!opened)}
      >
        <div className="inline-flex w-[calc(100%-24px)] font-normal mr-[16px]">{question}</div>
        <div className="inline-flex items-center">
          <ThemedIcon
            classes={`transition ${opened ? 'rotate-180' : ''}`}
            name="caret"
            alt="Toggle faq item"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div
        className={`rounded-[8px] font-normal overflow-hidden bg-secondary ${answerStateClasses}`}
      >
        <div className="p-[16px]">{children}</div>
      </div>
    </div>
  );
};

const EpochRewardsLink = () => {
  return (
    <Link url="https://docs.celo.org/celo-codebase/protocol/proof-of-stake/epoch-rewards">
      Epoch Rewards
    </Link>
  );
};

interface LinkProps {
  url: string;
}
const Link = ({ url, children }: PropsWithChildren<LinkProps>) => {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="underline">
      {children}
    </a>
  );
};

export default FaqPage;
