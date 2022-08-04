import type { NextPage } from 'next';
import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import * as faq from 'src/services/faq';

const FaqPage: NextPage = () => {
  return <Faq />;
};

const Faq = () => {
  const faqItems = faq.getFaqItems();
  return (
    <CenteredLayout classes="px-base">
      <div className="font-medium text-[32px] leading-[40px] mt-[48px] mb-[32px]">
        Frequently asked questions
      </div>
      {faqItems.map(({ question, answer }, index) => (
        <FaqItem key={index} question={question} answer={answer} />
      ))}
    </CenteredLayout>
  );
};

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [opened, setOpened] = useState(false);
  const answerStateClasses = opened ? 'my-[16px]' : 'max-h-0';

  return (
    <div className="mb-[24px]">
      <div className="flex flex-row cursor-pointer" onClick={() => setOpened(!opened)}>
        <div className="flex-grow mr-[16px] font-normal">{question}</div>
        <ThemedIcon
          classes={`transition ${opened ? 'rotate-180' : ''}`}
          name="caret"
          alt="Toggle faq item"
          width={24}
          height={24}
        />
      </div>
      <div
        className={`rounded-[8px] font-light overflow-hidden bg-secondary ${answerStateClasses}`}
      >
        <div className="p-[16px]">{answer}</div>
      </div>
    </div>
  );
};

export default FaqPage;
