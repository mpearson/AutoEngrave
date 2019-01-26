import { Reducer, AnyAction } from "redux";
import { Dictionary } from "lodash";

/**
 * Builds a reducer function from a map of individual action case reducers.
 */
export const createReducer = <S, A extends AnyAction>(
  actionReducers: Dictionary<(state: S, action: A) => S>,
  initialState: S
): Reducer<S, A> => (
  state = initialState,
  action
) => {
  const reducer = actionReducers[action.type];
  return reducer === undefined ? state : reducer(state, action);
};
