import { useEffect, useState } from "react";

export const useTimeAgo = (dateBuffer: Date) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const date = new Date(dateBuffer);
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`${minutes}min ago`);
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours}h ago`);
      } else {
        const days = Math.floor(seconds / 86400);
        setTimeAgo(`${days + (days > 1 ? " days" : " day")} ago`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dateBuffer]);

  return timeAgo;
};
