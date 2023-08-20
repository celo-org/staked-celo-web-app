import type { NextPage } from 'next';

const GasSnapsPage: NextPage = () => {
  return <GasSnaps />;
};

const GasSnaps = () => {
  return (
    <div className="p-base max-w-[800px] mb-[80px]">
      <h1 className="font-medium text-[32px] leading-[40px] mb-[32px]">Gas-Snap Setup Guide</h1>
      <p className="italic">Page last updated: August 17, 2023</p>
      <br />
      <p className="italic">
        Note: It is essential to use Flask version 10.33.1 due to changes by the MetaMask team
        regarding the derivation of coin-path 60 keys. Please ensure you&apos;re following the steps
        closely.
      </p>
      <br />
      <p className="italic">
        Disclaimer: This guide is for informational purposes. Ensure you have the necessary backups
        and security measures before making changes to your extensions and wallets.
      </p>
      <br />

      <h2 className="font-medium text-[24px] leading-[30px] mb-[24px]">Step 1: Install Flask</h2>

      <p>
        <strong>1.1. Why Version 10.33.1?</strong> <br />
        The MetaMask team disabled the derivation of coin-path 60 keys in recent versions. Version
        10.33.1 doesn&apos;t have this restriction.
      </p>
      <br />

      <p>
        <strong>1.2. Download and Install Flask:</strong> <br />
        Visit the{' '}
        <a className="underline" href="https://github.com/MetaMask/metamask-extension/tags">
          MetaMask GitHub
        </a>{' '}
        to download Flask version 10.33.1. Unzip after downloading.
      </p>
      <br />

      <p>
        <strong>1.3. Install the Flask Extension to Chrome:</strong> <br />
        Open Chrome, navigate to{' '}
        <a className="underline" href="chrome://extensions">
          chrome://extensions
        </a>
        . Click on “Load Unpacked”, then locate the downloaded and unzipped Flask folder. Click
        “Select”.
      </p>
      <br />

      <p>
        <strong>1.4. Setup Your Wallet:</strong> <br />
        Open the Flask extension (Purple Fox) and set up your wallet. Note: Importing an existing
        wallet is possible.
      </p>
      <br />

      <p>
        <strong>1.5. Disable Orange MetaMask:</strong> <br />
        Ensure only the Flask extension (Purple Fox) is enabled and disable the original MetaMask
        (Orange Fox).
      </p>
      <br />

      <h2 className="font-medium text-[24px] leading-[30px] mb-[24px]">Step 2: Test the Snap</h2>

      <p>
        <strong>2.1. Test Staking:</strong> <br />
        Visit the{' '}
        <a
          className="underline"
          href="https://staked-celo-web-app-git-aaronmgdr-snap-example-c-labs.vercel.app/stake"
        >
          Staked Celo Web App
        </a>
        . Follow the staking steps as described above.
      </p>
      <br />

      <p>
        <strong>2.2. Toggling Snap On or Off:</strong> <br />
        Click on the MetaMask Flask icon, navigate to “Settings” - “Snap” and toggle accordingly.
      </p>
      <br />

      <h2 className="font-medium text-[24px] leading-[30px] mb-[24px]">
        Step 3: Rolling Back to Orange MetaMask
      </h2>

      <p>
        <strong>3.1. Disable the Flask Extension:</strong> <br />
        Disable the Flask extension (Purple Fox) in{' '}
        <a className="underline" href="chrome://extensions">
          chrome://extensions
        </a>
        . You can then operate without the Gas-Snap feature.
      </p>
      <br />
    </div>
  );
};

export default GasSnapsPage;
