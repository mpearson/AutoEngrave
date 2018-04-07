import { Reducer } from "redux";
import * as actions from "./actions";
import { CrudItem, CrudState, CrudAction } from "./types";
import { OrderedMap, Seq } from "immutable";

const getDefaultState = <T extends CrudItem>(): CrudState<T> => ({
  items: OrderedMap(),
  isFetchingItems: false,
  isCreatingItem: false,
  isUpdatingItem: false,
  isDeletingItem: false,
});

const createItemMap = <T extends CrudItem>(items: T[]): OrderedMap<number, T> => {
  return OrderedMap(Seq(items).map(item => [item.id, item]));
};

export const makeReducer = <T extends CrudItem>(name: string): Reducer<CrudState<T>> => {
  return (state = getDefaultState<T>(), action: CrudAction<T>) => {
    if (action.type.substr(0, name.length) !== name)
      return state;
    switch (action.type.substr(name.length + 1)) {
      // Create
      case actions.CREATE_REQUEST: {
        return { ...state, isCreatingItem: true };
      }
      case actions.CREATE_SUCCESS: {
        return { ...state, items: state.items.set(action.results, action.item), isCreatingItem: false };
      }
      case actions.LIST_ERROR: {
        return { ...state, isCreatingItem: false };
      }
      // Read
      case actions.LIST_REQUEST: {
        return { ...state, isFetchingItems: true };
      }
      case actions.LIST_RECEIVE: {
        return { ...state, items: createItemMap(action.results), isFetchingItems: false };
      }
      case actions.LIST_ERROR: {
        return { ...state, isFetchingItems: false };
      }
      // Update
      case actions.UPDATE_REQUEST: {
        return { ...state, isUpdatingItem: true };
      }
      case actions.UPDATE_SUCCESS: {
        return { ...state, items: state.items.set(action.item.id, action.item), isUpdatingItem: false };
      }
      case actions.UPDATE_ERROR: {
        return { ...state, isUpdatingItem: false };
      }
      // Delete
      case actions.DELETE_REQUEST: {
        return { ...state, isDeletingItem: true };
      }
      case actions.DELETE_SUCCESS: {
        return { ...state, items: state.items.remove(action.item.id), isDeletingItem: false };
      }
      case actions.DELETE_ERROR: {
        return { ...state, isDeletingItem: false };
      }

      default:
        return state;
    }
  };
};
