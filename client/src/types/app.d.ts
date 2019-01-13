import { AnyAction } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../redux/types";

// export type Action = { type: string; }
// export type ThunkAction = (dispatch: DispatchFunction, getState: () => GetStateFunction) => any;

declare module "redux" {
  export interface Dispatch {
    (action: AnyAction | ThunkAction<any, RootState, void, AnyAction>): any;
  }
}
// export type GetStateFunction = () => object;


// type PayloadAction<Payload> = {
//   type: string;
//   payload: Payload;
//   error?: boolean;
//   meta?: any;
// }
