import { createContext } from "react";
import { IEntryContext, ITableContext } from "../model";

export const TableContext = createContext({} as ITableContext);

export const EntryContext = createContext({} as IEntryContext);
