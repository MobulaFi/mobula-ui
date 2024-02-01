"use client";
import { User } from "mobula-utils/lib/user/model";
import React, { useMemo, useState } from "react";
import { defaultResults, defaultUsers } from "../constants";
import { ArticlesType, ISearchBarContext, Page, Token } from "../models";

export const SearchbarContext = React.createContext({} as ISearchBarContext);
export const SearchbarProvider = ({ children }) => {
  const [token, setToken] = useState<string>("");
  const [results, setResults] = useState<Token[]>(defaultResults || []);
  const [active, setActive] = useState(0);
  const [articles, setArticles] = useState<ArticlesType[]>([]);
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [users, setUsers] = useState<Partial<User>[]>(defaultUsers || []);
  const [pages, setPages] = useState<Page[]>([]);
  const [ens, setEns] = useState({ name: "", address: "" || null });
  const [pairs, setPairs] = useState([]);
  const [userWithAddress, setUserWithAddress] = useState<Partial<User>>({
    username: "",
    profile_pic: "",
    address: "",
  });
  const value = useMemo(
    () => ({
      token,
      setToken,
      results,
      setResults,
      active,
      setActive,
      articles,
      setArticles,
      isFocus,
      setIsFocus,
      users,
      setUsers,
      userWithAddress,
      setPages,
      pages,
      setUserWithAddress,
      ens,
      setEns,
      setPairs,
      pairs,
    }),
    [
      token,
      results,
      active,
      articles,
      isFocus,
      users,
      userWithAddress,
      pages,
      ens,
      pairs,
    ]
  );

  return (
    <SearchbarContext.Provider value={value}>
      {children}
    </SearchbarContext.Provider>
  );
};
