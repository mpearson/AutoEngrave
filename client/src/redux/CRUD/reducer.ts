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
    const [ actionPrefix, actionName ] = action.type.split("/", 1);
    if (actionPrefix)
      return state;
    switch (actionName) {
      // Create
      case actions.CREATE_REQUEST: {
        return {
          ...state,
          items: state.items.set(action.tempID, { ...action.item as any, isFetching: true }),
          isCreatingItem: true,
        };
      }
      case actions.CREATE_SUCCESS: {
        const id: number = action.results;
        return {
          ...state,
          items: state.items.delete(action.tempID).set(id, { ...action.item as any, id }),
          isCreatingItem: false,
        };
      }
      case actions.CREATE_ERROR: {
        return {
          ...state,
          items: state.items.delete(action.tempID),
          isCreatingItem: false,
        };
      }
      // Read
      case actions.LIST_REQUEST: {
        return { ...state, isFetchingItems: true };
      }
      case actions.LIST_RECEIVE: {
        return { ...state, items: createItemMap<T>(action.results), isFetchingItems: false };
      }
      case actions.LIST_ERROR: {
        return { ...state, isFetchingItems: false };
      }
      // Update
      case actions.UPDATE_REQUEST: {
        return {
          ...state,
          items: state.items.set(action.item.id, { ...action.item as any, isFetching: true }),
          isUpdatingItem: true,
        };
      }
      case actions.UPDATE_SUCCESS: {
        return {
          ...state,
          items: state.items.set(action.item.id, action.item),
          isUpdatingItem: false,
        };
      }
      case actions.UPDATE_ERROR: {
        return {
          ...state,
          items: state.items.set(action.item.id, action.oldItem),
          isUpdatingItem: false,
        };
      }
      // Delete
      case actions.DELETE_REQUEST: {
        return {
          ...state,
          items: state.items.set(action.item.id, { ...action.item as any, isFetching: true }),
          isDeletingItem: true,
        };
      }
      case actions.DELETE_SUCCESS: {
        return {
          ...state,
          items: state.items.delete(action.item.id),
          isDeletingItem: false,
        };
      }
      case actions.DELETE_ERROR: {
        return {
          ...state,
          items: state.items.set(action.item.id, action.item),
          isDeletingItem: false,
        };
      }
      default: {
        return state;
      }
    }
  };
};
