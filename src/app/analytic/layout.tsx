import { AnalyticsProvider } from "features/analytic/context-manager";

export default function Layout({ children }) {
  return <AnalyticsProvider>{children}</AnalyticsProvider>;
}
