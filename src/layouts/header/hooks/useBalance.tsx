import { useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/user";
import { GET } from "../../../utils/fetch";
import { useUserBalance } from "../context-manager/balance";

export const useBalance = () => {
  const { user } = useContext(UserContext);
  const { userBalance, setUserBalance } = useUserBalance();
  useEffect(() => {
    if (!user) return;
    const fetchData = () => {
      GET("/api/1/wallet/balance-usd", {
        id: user?.portfolios?.[0]?.id,
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) return;
          else {
            const newBalance = r.success;
            const hasBalanceChanged = userBalance.actual_balance !== newBalance;
            const color =
              userBalance.actual_balance > newBalance
                ? "text-red"
                : "text-green";

            setUserBalance((prevState) => ({
              ...prevState,
              prev_balance: prevState.actual_balance,
              actual_balance: newBalance,
              color,
            }));

            if (hasBalanceChanged) {
              setUserBalance((prevState) => ({
                ...prevState,
                change_color: true,
              }));
            }
          }
        });
      setTimeout(fetchData, 5000);
    };
    fetchData();
  }, [user]);
};
