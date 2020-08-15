import { Reducer, AnyAction } from "redux";
import { Set } from "immutable";
import { makeReducer, getDefaultCrudState } from "../CRUD/reducer";
import { CatalogState, Design, CATALOG_PREFIX, CatalogAction } from "./types";
import * as actions from "./actions";

export const baseReducer = makeReducer<Design>(CATALOG_PREFIX);

export const getDefaultState = (): CatalogState => ({
  ...getDefaultCrudState<Design>(),
  selectedIds: Set(),
});

export const catalogReducer: Reducer<CatalogState, AnyAction> = (
  state = getDefaultState(),
  action: CatalogAction
): CatalogState => {
  switch (action.type) {
    case actions.SET_SELECTED_DESIGNS: {
      return {
        ...state,
        selectedIds: action.selectedIds,
      };
    }
    default: {
      return baseReducer(state, action) as CatalogState;
    }
  }
};
