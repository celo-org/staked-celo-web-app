export const GA_TRACKING_ID: string = process.env.NEXT_PRIVATE_GOOGLE_ANALYTICS!;

// log the pageview with their URL
export const pageview = (url: URL) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// log general events happening.
export const event = ({ action, status, label, value }: GTagEvent) => {
  window.gtag('event', action, {
    event_status: status,
    event_label: label,
    event_value: value,
  });
};

// log transaction events happening.
export const transactionEvent = ({ action, status, value }: GTagEvent) => {
  window.gtag('event', action, {
    transaction_status: status,
    transaction_value: value,
  });
};

// log wallet events happening.
export const walletEvent = ({ action, status, label }: GTagEvent) => {
  window.gtag('event', action, {
    connection_status: status,
    wallet_type: label,
  });
};

export type GTagEvent = {
  action: string;
  status: string;
  label?: string;
  value?: string;
};
