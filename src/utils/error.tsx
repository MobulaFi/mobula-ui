interface EthersError extends Error {
  data?: {
    message?: string;
  };
  reason?: string;
}

export const handleEthersError = (e: EthersError, alert: any) => {
  if (e.data && e.data.message) {
    alert.error(e.data.message);
  } else if (e.reason) {
    const errorMessage = e.reason.split(": ")[1] || e.reason;
    alert.error(errorMessage);
  } else {
    alert.error("Something went wrong.");
  }
};

export const handleViewError = (e: Error, alert: any) => {
  alert.error(e.message);
};
