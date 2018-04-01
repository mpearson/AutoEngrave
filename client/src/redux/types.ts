import { ConsoleState } from "./console/reducer";
import { ThunkAction } from "redux-thunk";

export type RootState = {
  console: ConsoleState;
};

export type AsyncAction<T = any> = ThunkAction<T, RootState, void>;
export type AsyncPromiseAction<T = any> = ThunkAction<Promise<T>, RootState, void>;

