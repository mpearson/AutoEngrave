import { Design, CATALOG_PREFIX } from "./types";
import { Reducer } from "redux";
import { makeReducer, getDefaultCrudState } from "../CRUD/reducer";
import { CrudState, CrudAction } from "../CRUD/types";
import * as actions from "./actions";

export const baseReducer = makeReducer<Design>(CATALOG_PREFIX);

export interface CatalogState extends CrudState<Design> {
  selectedID: number;
}

export const getDefaultState = (): CatalogState => ({
  ...getDefaultCrudState<Design>(),
  selectedID: null,
});

export const catalogReducer: Reducer<CatalogState> = (
  state = getDefaultState(),
  action: CrudAction<Design>
) => {
  switch(action.type) {
    case actions.SELECT_DESIGN: {
      return {
        ...state,
        selected: action.item,
      }
    }
    default: {
      return state;
    }
  }
};
