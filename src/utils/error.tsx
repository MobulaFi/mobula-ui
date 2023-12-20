import { triggerAlert } from "../lib/toastify";

interface EthersError extends Error {
  data?: {
    message?: string;
  };
  reason?: string;
}

export const handleEthersError = (e: EthersError, alert: any) => {
  if (e.data && e.data.message) {
    triggerAlert("Error", e.data.message);
  } else if (e.reason) {
    const errorMessage = e.reason.split(": ")[1] || e.reason;
    triggerAlert("Error", errorMessage);
  } else {
    triggerAlert("Error", "Something went wrong.");
  }
};

export const handleViewError = (e: Error, alert: any) => {
  triggerAlert("Error", e.message);
};
