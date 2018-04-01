import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

export type AsyncAction<T = any> = ThunkAction<T, RootState, void>;
export type AsyncPromiseAction<T = any> = ThunkAction<Promise<T>, RootState, void>;

