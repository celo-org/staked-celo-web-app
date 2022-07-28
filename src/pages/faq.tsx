import type { NextPage } from 'next';
import { useState } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { useFaq } from 'src/hooks/useFaq';
import { CenteredLayout } from 'src/layout/CenteredLayout';

const FaqPage: NextPage = () => {
  return <Faq />;
};

const Faq = () => {
  const { faqItems } = useFaq();
  return (
    <CenteredLayout>
      <div className="themed:faq text-3xl font-light leading-normal mt-6 mb-12">
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
  const answerStateClasses = opened ? 'mt-4' : 'max-h-0';

  return (
    <div className="mb-12">
      <div className="flex flex-row">
        <div className="flex-grow mr-2 font-light">{question}</div>
        <ThemedIcon
          classes={`transition cursor-pointer ${opened ? '' : 'rotate-180'}`}
          name="caret"
          alt="Toggle faq item"
          width={24}
          height={24}
          onClick={() => setOpened(!opened)}
        />
      </div>
      <div
        className={`themed:faq__answer rounded-md font-light overflow-hidden ${answerStateClasses}`}
      >
        <div className="p-4">{answer}</div>
      </div>
    </div>
  );
};

export default FaqPage;
