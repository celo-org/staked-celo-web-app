import type { NextPage } from 'next';
import { PropsWithChildren } from 'react';
import { privacyUrl } from 'src/config/externalUrls';

const TermsPage: NextPage = () => {
  return <Terms />;
};

const Terms = () => {
  return (
    <div className="p-base max-w-[800px] mb-[80px]">
      <h1 className="font-medium text-[32px] leading-[40px] mb-[32px]">
        StakedCelo Terms of Service
      </h1>
      <p className="italic">Page last updated: August 17, 2022</p>
      <br />
      <p className="italic">
        Note: The Terms of Service should be read together with the general Terms and Privacy Policy
        of cLabs. All must be read together.
      </p>
      <br />
      <p className="italic">
        Disclaimer: Nothing herein constitutes an offer to sell, or the solicitation of an offer to
        buy, any securities or tokens. As with all virtual currency, there is a risk of volatility
        in market conditions. Please do your own research.
      </p>
      <br />
      <p className="italic">
        You are prohibited from accessing, using or otherwise receiving any benefits of the
        Interface or our other offerings and services if you fail to satisfy the eligibility
        requirements set forth in Section 1 hereof or if you otherwise breach or violate any of the
        terms and conditions set forth herein. The eligibility requirements mandate, among other
        things, that you not reside in or be a citizen of a Restricted Territory (as defined below),
        that you are not a Sanctioned List Person (as defined below) and that you do not intend to
        transact in or with any Restricted Territory or Sanctions List Person. If you fail to meet
        the eligibility requirements set forth in Section 1 or are otherwise not in strict
        compliance with these Terms, then you must not attempt to access or use the Interface or any
        of our other offerings or services. Use of a virtual private network (e.g., a VPN) or other
        means by restricted persons to access or use the Interface is prohibited and may subject you
        to legal liability for fraudulent use of the Interface.
      </p>
      <br />
      <p>
        Welcome to{' '}
        <a className="underline" href="https://app.stcelo.xyz">
          https://app.stcelo.xyz
        </a>
        , a website-hosted user interface (the “Interface”) made available by cLabs Inc. (“we”,
        “our”, or “us”). The Interface provides access to a decentralized protocol, known as
        “StakedCelo,” which allows users to stake CELO and receive in return stCELO tokens
        corresponding to the staked CELO (the “Protocol”).
      </p>
      <br />
      <p>
        These Terms of Use and any terms and conditions incorporated herein by reference
        (collectively, the “Terms”) govern your access to and use of the Interface. You must read
        the Terms carefully. By accessing, browsing or otherwise using the Interface, or by
        acknowledging agreement to the Terms on the Interface, you agree that you have read,
        understood and accepted all of the Terms and our <PrivacyPolicyLink />
        (the “Privacy Policy”), which is incorporated by reference into the Terms. THE TERMS CONTAIN
        IMPORTANT INFORMATION, INCLUDING A BINDING ARBITRATION PROVISION AND A CLASS ACTION WAIVER,
        BOTH OF WHICH IMPACT YOUR RIGHTS AS TO HOW DISPUTES ARE RESOLVED.
      </p>
      <br />
      <p>
        We may change, amend, or revise the Terms from time to time and at any time, in our sole
        discretion. When we make changes, we will make the updated Terms available on the Interface
        and update the “Last Updated” date at the beginning of the Terms accordingly. Please check
        the Terms periodically for changes. Any changes to the Terms will be applicable as of the
        date that they are made, and your continued access to or use of the Interface after the
        Terms have been updated will constitute your binding acceptance of such updates. If you do
        not agree to the revised Terms, then you should not continue to access or use the Interface.
      </p>
      <Section title="Eligibility">
        In order to use the Interface, you must satisfy the following eligibility requirements. You
        hereby represent and warrant, to and for the benefit of us and each of our officers,
        directors, supervisors, shareholders, members, investors, employees, agents, service
        providers and affiliates that you satisfy all of the eligibility requirements as of each
        date that you make any use or receive any benefits of the Interface.
        <ol className="list-decimal list-inside ml-[35px]">
          <li>
            You are of legal age in the jurisdiction in which you reside and you have legal capacity
            to enter into the Terms and be bound by them;
          </li>
          <li>
            if you accept the Terms on behalf of a legal entity, you must have the legal authority
            to accept the Terms on that entity’s behalf, in which case “you” as used herein (except
            as used in this paragraph) will mean that entity;
          </li>
          <li>
            (i) you are not a resident, citizen, national or agent of, or an entity organized,
            incorporated or doing business in Belarus, Burundi, China, Crimea and Sevastopol, Cuba,
            Democratic Republic of Congo, Iran, Iraq, Libya, North Korea, Somalia, Sudan, Syria,
            Venezuela, Zimbabwe or any other country to which the United States, the United Kingdom,
            the Cayman Islands, the European Union or any of its member states or the United Nations
            or any of its member states (collectively, the “Major Jurisdictions”) embargoes goods or
            imposes similar sanctions (such embargoed or sanctioned territories, collectively, the
            “Restricted Territories”); (ii) you are not, and do not directly or indirectly own or
            control, and have not received any assets from, any blockchain address that is, listed
            on any sanctions list or equivalent maintained by any of the Major (such
            sanctions-listed persons, collectively, “Sanctions Lists Persons”); and (iii) you do not
            intend to transact in or with any Restricted Territories or Sanctions List Persons;
          </li>
          <li>and you are not a Restricted Person;</li>
          <li>you are not a Politically Exposed Person, and </li>
          <li>
            your use of the Interface is not prohibited by and does not otherwise violate or
            facilitate the violation of any applicable laws or regulations, or contribute to or
            facilitate any illegal activity, including but not limited to, anti-money laundering,
            terrorist financing, sanctions violations.
          </li>
        </ol>
      </Section>
      <Section title="Access to the Interface">
        We reserve the right to disable access to the Interface at any time, with or without cause
        or good reason. Our grounds for terminating access to the Interface may include, but are not
        limited to, any breach of the Terms, including without limitation, if we, in our sole
        discretion, believe that you, at any time, fail to satisfy the eligibility requirements set
        forth in the Terms. Further, we reserve the right to limit or restrict access to the
        Interface by any person or entity, or within any geographic area or legal jurisdiction, at
        any time and in our sole discretion. We will not be liable to you for any losses or damages
        you may suffer as a result of or in connection with the Interface being inaccessible to you
        at any time or for any reason.
      </Section>
      <Section title="Proprietary Rights">
        <ol className="list-decimal list-inside ml-[35px]">
          <li>
            cLabs and/or its licensors own all rights to the intellectual property and material
            contained in this Site, and all such rights are reserved. You are granted a limited
            license only, subject to the restrictions provided in these Terms, for purposes of
            viewing the material contained on this Site. We own all intellectual property related to
            cLabs and/or its licensors and other rights in the Interface and its contents,
            including, but not limited to, software, text, images, trademarks, service marks,
            copyrights, patents, and designs. Unless expressly authorized by us, you may not copy,
            modify, adapt, rent, license, sell, publish, distribute, or otherwise permit any third
            party to access or use the Interface or any of its contents. Accessing or using the
            Interface does not constitute a grant to you of any proprietary intellectual property or
            other rights in the Interface or its contents.
          </li>
          <li>
            You will retain ownership of all intellectual property and other rights in any
            information and materials you submit through the Interface. However, by uploading such
            information or materials, you grant us a worldwide, royalty-free, irrevocable license to
            use, copy, distribute, publish and send this data in any manner in accordance with
            applicable laws and regulations.
          </li>
          <li>
            You may choose to submit comments, bug reports, ideas or other feedback about the
            Interface, including, without limitation, about how to improve the Interface
            (collectively, “Feedback”). By submitting any Feedback, you agree that we are free to
            use such Feedback at our discretion and without additional compensation to you, and to
            disclose such Feedback to third parties (whether on a non-confidential basis, or
            otherwise). If necessary under applicable law, then you hereby grant us a perpetual,
            irrevocable, non-exclusive, transferable, worldwide license under all rights necessary
            for us to incorporate and use your Feedback for any purpose.
          </li>
          <li>
            If (i) you satisfy all of the eligibility requirements set forth in the Terms, and (ii)
            your access to and use of the Interface complies with the Terms, you hereby are granted
            a single, personal, limited license to access and use the Interface of cLabs. This
            license is non-exclusive, non-transferable, and freely revocable by us at any time
            without notice or cause in our sole discretion. Use of the Interface for any purpose not
            expressly permitted by the Terms is strictly prohibited. Unlike the Interface, the
            Protocol is comprised entirely of open-source software running on the public Celo
            blockchain and is not our proprietary property.
          </li>
        </ol>
      </Section>
      <Section title="Prohibited Activity">
        You agree not to engage in, or attempt to engage in, any of the following categories of
        prohibited activity in relation to your access or use of the Interface:
        <ol className="list-decimal list-inside ml-[35px]">
          <li>Activity that breaches the Terms;</li>
          <li>
            Activity that breaches the{' '}
            <a href="https://github.com/celo-org/website/blob/master/src/content/code-of-conduct.md">
              Community Code of Conduct
            </a>
            ;
          </li>
          <li>
            Activity that infringes on or violates any copyright, trademark, service mark, patent,
            right of publicity, right of privacy, or other proprietary or intellectual property
            rights under the law.
          </li>
          <li>
            Activity that seeks to interfere with or compromise the integrity, security, or proper
            functioning of any computer, server, network, personal device, or other information
            technology system, including, but not limited to, the deployment of viruses and denial
            of service attacks.
          </li>
          <li>
            Activity that seeks to defraud us or any other person or entity, including, but not
            limited to, providing any false, inaccurate, or misleading information in order to
            unlawfully obtain or attempt to obtain the property of another.
          </li>
          <li>
            Activity that violates any applicable law, rule, or regulation concerning the integrity
            of trading markets, including, but not limited to, the manipulative tactics commonly
            known as spoofing and wash trading.
          </li>
          <li>
            Activity that violates any applicable law, rule, or regulation of any Major
            Jurisdiction.
          </li>
          <li>
            Activity that disguises or interferes in any way with the IP address of the computer you
            are using to access or use the Interface or that otherwise prevents us from correctly
            identifying the IP address of the computer you are using to access the Interface.
          </li>
          <li>
            Activity that transmits, exchanges, or is otherwise supported by the direct or indirect
            proceeds of criminal or fraudulent activity.
          </li>
          <li>
            Activity that will not encourage, enable, or facilitate any other individual to do any
            of the foregoing or otherwise violate the Terms. cLabs has the right to investigate
            violations of the Terms. cLabs may further consult and cooperate with law enforcement
            authorities to prosecute those who violate the law.
          </li>
        </ol>
      </Section>
      <Section title="No Professional (Legal, Financial, Tax, etc.) Advice or Fiduciary Duties">
        <ol className="list-decimal list-inside ml-[35px]">
          <li>cLabs and its Affiliates cannot provide legal, financial or tax advice.</li>
          <li>
            All information provided in connection with your access and use of the Interface is for
            informational purposes only and should not be construed as professional advice. You
            should not take, or refrain from taking, any action based on any information contained
            in the Interface or any other information that we make available at any time, including,
            without limitation, blog posts, articles, links to third-party content, news feeds,
            tutorials, tweets and videos. Before you make any financial, legal, or other decisions
            involving the Interface, you should seek independent professional advice from an
            individual who is licensed and qualified in the area for which such advice would be
            appropriate.
          </li>
          <li>
            The Terms are not intended to, and do not, create or impose any fiduciary duties on us.
            To the fullest extent permitted by law, you acknowledge and agree that we owe no
            fiduciary duties or liabilities to you or any other party, and that to the extent any
            such duties or liabilities may exist at law or in equity, those duties and liabilities
            are hereby irrevocably disclaimed, waived, and eliminated. You further agree that the
            only duties and obligations that we owe you are those set forth expressly in the Terms.
          </li>
        </ol>
      </Section>
      <Section title="No Warranties">
        The Interface is provided on an “AS IS” and “AS AVAILABLE” basis. To the fullest extent
        permitted by law, we disclaim any representations and warranties of any kind, whether
        express, implied, or statutory, including, but not limited to, the warranties of
        merchantability and fitness for a particular purpose. You acknowledge and agree that your
        access and use of the Interface is at your own risk. We do not represent or warrant that
        access to the Interface will be continuous, uninterrupted, timely, or secure; that the
        information contained in the Interface will be accurate, reliable, complete, or current; or
        that the Interface will be free from errors, defects, viruses, or other harmful elements. No
        advice, information, or statement that we make should be treated as creating any warranty
        concerning the Interface. We do not endorse, guarantee, or assume responsibility for any
        advertisements, offers, or statements made by third parties concerning the Interface.
      </Section>
      <Section title="Compliance Obligations">
        The Interface may not be available or appropriate for use in all jurisdictions. By accessing
        or using the Interface, you agree that you are solely and entirely responsible for
        compliance with all laws and regulations that may apply to you in your jurisdiction. You
        further agree that cLabs and its Affiliates have no obligation to inform you of any
        potential liabilities or violations of law or regulation that may arise in connection with
        your access and use of the Interface and that cLabs and its Affiliates are not liable in any
        respect for any failure by you to comply with any applicable laws or regulations. Moreover,
        cLabs and its Affiliates are not obligated to ensure your compliance with any laws or
        regulations that may change and apply to you based on your jurisdiction
      </Section>
      <Section title="Assumption of Risk">
        By accessing and using the Interface, you represent that you understand (a) the Interface
        facilitates access to the StakedCelo protocol or the Celo Platfrom, the use of which has
        inherent risks as with any cryptographic and blockchain technology, and (b) the
        cryptographic and blockchain-based systems have inherent risks to which you are exposed when
        using the Interface. You further represent that you have a working knowledge of the usage
        and intricacies of blockchain-based digital assets, including, without limitation, ERC-20
        token standard available on the Celo blockchain. You further understand that the markets for
        these blockchain-based digital assets are highly volatile due to factors that include, but
        are not limited to, adoption, speculation, technology, security, and regulation (which may
        differ depending on jurisdiction). You acknowledge that the cost and speed of transacting
        with blockchain-based systems, such as Celo, are variable and may increase or decrease,
        respectively, drastically at any time. You hereby acknowledge and agree that cLabs and its
        Affiliates are not responsible for any of these variables or risks associated with the
        StakedCelo protocol or Celo Platform and cannot be held liable for any resulting losses that
        you experience while accessing or using the Interface. Accordingly, you understand and agree
        to assume full responsibility for all of the risks of accessing and using the Interface to
        interact with the StakedCelo protocol or Celo Platform.
      </Section>
      <Section title="Third-Party Resources and Promotions">
        The Interface may contain references or links to third-party resources, including, but not
        limited to, information, materials, products, or services, that we do not own or control. In
        addition, third parties may offer promotions related to your access and use of the
        Interface. We do not endorse or assume any responsibility for any such resources or
        promotions. If you access any such resources or participate in any such promotions, you do
        so at your own risk, and you understand that the Terms do not apply to your dealings or
        relationships with any third parties. You expressly relieve us of any and all liability
        arising from your use of any such resources or participation in any such promotions.
      </Section>
      <Section title="Release of Claims">
        You expressly agree that you assume all risks in connection with your access to and use of
        the Interface. Additionally, you expressly waive and release us from any and all liability,
        claims, causes of action, or damages arising from or in any way relating to your access to
        and use of the Interface.
      </Section>
      <Section title="Indemnity">
        You agree to hold harmless, release, defend, and indemnify us and our officers, directors,
        employees, contractors, agents, affiliates, and subsidiaries from and against all claims,
        damages, obligations, losses, liabilities, costs, and expenses arising from: (a) your access
        to and use of the Interface; (b) your violation of the Terms, the rights of any third party,
        or any other applicable law, rule, or regulation; and (c) any other party’s access to and
        use of the Interface with your assistance or using any device or account that you own or
        control.
      </Section>{' '}
      <Section title="Limitation of Liability">
        Under no circumstances shall we or any of our officers, directors, employees, contractors,
        agents, affiliates, or subsidiaries be liable to you for any indirect, punitive, incidental,
        special, consequential, or exemplary damages, including (but not limited to) damages for
        loss of profits, goodwill, use, data, or other intangible property, arising out of or
        relating to any access to or use of the Interface, nor will we be responsible for any
        damage, loss, or injury resulting from hacking, tampering, or other unauthorized access to
        or use of the Interface, or from any access to or use of any information obtained by any
        unauthorized access to or use of the Interface. We assume no liability or responsibility for
        any: (a) errors, mistakes, or inaccuracies of content; (b) personal injury or property
        damage, of any nature whatsoever, resulting from any access to or use of the Interface; (c)
        unauthorized access to or use of any secure server or database in our control, or the use of
        any information or data stored therein; (d) interruption or cessation of function related to
        the Interface; (e) bugs, viruses, trojan horses, or the like that may be transmitted to or
        through the Interface; (f) errors or omissions in, or loss or damage incurred as a result
        of, the use of any content made available through the Interface; and (g) the defamatory,
        offensive, or illegal conduct of any third party. Under no circumstances shall we or any of
        our officers, directors, employees, contractors, agents, affiliates, or subsidiaries be
        liable to you for any claims, proceedings, liabilities, obligations, damages, losses, or
        costs in an amount exceeding the greater of (i) the amount you paid to us in exchange for
        access to and use of the Interface, or (ii) $100.00. Note that to engage with StakedCelo
        there is no fee at this time, and cLabs and its Affliates are not custodians of any digital
        assets (including but not limited to CELO, stCelo). This limitation of liability applies
        regardless of whether the alleged liability is based on contract, tort, negligence, strict
        liability, or any other basis, and even if we have been advised of the possibility of such
        liability. Some jurisdictions do not allow the exclusion of certain warranties or the
        limitation or exclusion of certain liabilities and damages. Accordingly, some of the
        disclaimers and limitations set forth in the Terms may not apply to you. This limitation of
        liability shall apply to the fullest extent permitted by law.
      </Section>
      <Section title="Dispute Resolution">
        These Terms will be governed by and construed in accordance with the laws of the State of
        California and you submit to the non-exclusive jurisdiction of the courts located in San
        Francisco, California for the resolution of any disputes. <br />
        <br /> ANY CLAIMS ARISING OUT OF, RELATING TO, OR CONNECTED WITH THESE TERMS MUST BE
        ASSERTED INDIVIDUALLY IN BINDING ARBITRATION PURSUANT TO THIS{' '}
        <span className="font-bold">“ARBITRATION AGREEMENT”</span>. Before either party may seek
        arbitration, the party must first send to the other party a written notice of dispute
        (&quot;Notice&quot;) describing the nature and basis of the claim or dispute, and the
        requested relief. A Notice to cLabs should be sent to: legal@clabs.co. After the Notice is
        received, you and cLabs may attempt to resolve the claim or dispute informally. If you and
        cLabs do not resolve the claim or dispute within 30 days after the Notice is received,
        either party may begin an arbitration proceeding. The amount of any settlement offer made by
        any party may not be disclosed to the arbitrator until after the arbitrator has determined
        the amount of the award, if any, to which either party is entitled. <br />
        <br />
        Arbitration shall be initiated through the American Arbitration Association
        (&quot;AAA&quot;), an established alternative dispute resolution provider (&quot;ADR
        Provider&quot;) that offers arbitration as set forth in this section. If AAA is not
        available to arbitrate, the parties shall agree to select an alternative ADR Provider. The
        rules of the ADR Provider shall govern all aspects of this arbitration, including but not
        limited to the method of initiating and/or demanding arbitration, except to the extent such
        rules conflict with these Terms. The AAA Consumer Arbitration Rules (&quot;Arbitration
        Rules&quot;) governing the arbitration are available online at www.adr.org. The arbitration
        shall be conducted by a single, neutral arbitrator. Any claims or disputes where the total
        amount of the award sought is less than ten thousand U.S. Dollars (US $10,000) may be
        resolved through binding non-appearance-based arbitration, at the option of the party
        seeking relief. For claims or disputes where the total amount of the award sought is ten
        thousand U.S. Dollars (US $10,000) or more, the right to a hearing will be determined by the
        Arbitration Rules. Any hearing will be held in the city of San Francisco, California, unless
        the parties agree otherwise. Any judgment on the award rendered by the arbitrator may be
        entered in any court of competent jurisdiction.
        <br />
        <br />
        The United States Arbitration Act shall apply in all cases and govern the interpretation and
        enforcement of the arbitration rules and arbitration proceedings. There are only two
        exceptions to this Arbitration Agreement. First, if cLabs reasonably believes that you have
        in any manner violated or threatened to violate the cLabs’s intellectual property rights,
        cLabs may seek injunctive or other appropriate relief in any court of competent
        jurisdiction. Second, any claim of $500 or less may, at the option of the claiming party, be
        resolved in small claims court in San Francisco, California if the claim and the parties are
        within the jurisdiction of the small claims court. For these two exceptions, you agree to
        submit to the personal jurisdiction of the courts located within San Francisco, California
        for the purpose of litigating such claims or disputes.
        <br />
        <br />
        TO THE EXTENT ALLOWED BY LAW, YOU AGREE TO IRREVOCABLY WAIVE ANY RIGHT YOU MAY HAVE TO A
        TRIAL BY JURY OR OTHER COURT TRIAL (OTHER THAN SMALL CLAIMS COURT) OR TO SERVE AS A
        REPRESENTATIVE, AS A PRIVATE ATTORNEY GENERAL, OR IN ANY OTHER REPRESENTATIVE CAPACITY, OR
        TO PARTICIPATE AS A MEMBER OF A CLASS OF CLAIMANTS, IN ANY LAWSUIT, ARBITRATION OR OTHER
        PROCEEDING FILED AGAINST CLABS AND/OR RELATED THIRD PARTIES.
      </Section>
      <Section title="Class Action and Jury Trial Waiver">
        You must bring any and all Disputes against us in your individual capacity and not as a
        plaintiff in or member of any purported class action, collective action, private attorney
        general action, or other representative proceeding. This provision applies to class
        arbitration. You agree to waive the right to demand a trial by jury.
      </Section>
      <Section title="Governing Law">
        You agree that the laws of the State of California, without regard to principles of conflict
        of laws, govern the Terms and any Dispute between you and us.
      </Section>
      <Section title="Entire Agreement">
        The Terms, including the Privacy Policy, constitute the entire agreement between you and us
        with respect to the subject matter hereof, including the Interface. The Terms, including the
        Privacy Policy, supersede any and all prior or contemporaneous written and oral agreements,
        communications and other understandings relating to the subject matter of the Terms.
      </Section>
      <Section title="Privacy Policy">
        The <PrivacyPolicyLink /> describes the ways we collect, use, store and disclose your
        personal information. You agree to the collection, use, storage, and disclosure of your data
        in accordance with the <PrivacyPolicyLink />.
      </Section>
    </div>
  );
};

interface SectionProps {
  title: string;
}

const Section = ({ title, children }: PropsWithChildren<SectionProps>) => {
  return (
    <section className="mt-[30px]">
      <SectionHeader>{title}</SectionHeader>
      {children}
    </section>
  );
};

const SectionHeader = ({ children }: PropsWithChildren) => {
  return <h2 className="text-[24px] leading-[32px] mb-[10px]">{children}</h2>;
};

const PrivacyPolicyLink = () => {
  return (
    <a className="underline" href={privacyUrl} target="_blank" rel="noreferrer">
      Privacy Policy
    </a>
  );
};

export default TermsPage;
