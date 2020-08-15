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

/**
 * Generates a reducer by chaining the provided functions together,
 * such that the output of R1 is fed into R2, etc.
 * In practice, only one reducer will usually match the provided action,
 * and the rest will return the unmodified state.
 */
export const chainReducers = <S>(...reducers: Array<Reducer<S>>): Reducer<S> => (state, action) => {
  let nextState = state;
  for (const reducer of reducers) {
    nextState = reducer(nextState, action);
  }
  return nextState;
};
