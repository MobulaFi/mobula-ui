import { parse } from "cookie";
import {
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface UserBalance {
  actual_balance: number;
  prev_balance: number;
  color: string;
  change_color: boolean;
}

interface IUserBalance {
  setUserBalance: React.Dispatch<SetStateAction<UserBalance>>;
  userBalance: UserBalance;
}

const UserBalanceContext = createContext({} as IUserBalance);

export const useUserBalance = () => useContext(UserBalanceContext);

export const UserBalanceProvider = ({ children, cookies }) => {
  const newCookie = parse(cookies);
  const userCookie = newCookie["user-balance"];
  const balance = userCookie ? JSON.parse(userCookie) : null;
  const [userBalance, setUserBalance] = useState({
    actual_balance: balance || 0,
    prev_balance: 0,
    color: "text-green dark:text-green",
    change_color: false,
  });

  const contextValue = useMemo(
    () => ({
      userBalance,
      setUserBalance,
    }),
    [userBalance, setUserBalance]
  );
  return (
    <UserBalanceContext.Provider value={contextValue}>
      {children}
    </UserBalanceContext.Provider>
  );
};
