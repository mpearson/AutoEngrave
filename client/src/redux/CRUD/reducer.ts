import { Reducer } from "redux";
import * as actions from "./actions";
import { CrudItem, CrudState, CrudAction } from "./types";
import { OrderedMap, Seq } from "immutable";
import * as moment from "moment";

export const getDefaultCrudState = <T extends CrudItem>(): CrudState<T> => ({
  items: OrderedMap(),
  isFetchingItems: false,
  isCreatingItem: false,
  isUpdatingItem: false,
  isDeletingItem: false,
});

const parseDates = <T extends CrudItem>(item: any): T => ({
  ...item,
  created: moment(item.created),
  updated: moment(item.updated),
});

const createItemMap = <T extends CrudItem>(items: any[]): OrderedMap<number, T> => {
  return OrderedMap(Seq(items).map(item => [item.id, parseDates(item)]));
};

export const makeReducer = <T extends CrudItem>(name: string): Reducer<CrudState<T>> => {
  return (state = getDefaultCrudState<T>(), action: CrudAction<T>) => {
    const [ actionPrefix, actionType ] = action.type.split("/");
    if (actionPrefix !== name)
      return state;
    switch (actionType) {
      // Create
      case actions.CREATE_REQUEST: {
        return {
          ...state,
          items: state.items.set(action.tempID, { ...action.item as any, isFetching: true }),
          isCreatingItem: true,
        };
      }
      case actions.CREATE_SUCCESS: {
        const { results } = action;
        const item: T = {
          ...action.item as any,
          id: results.id,
          created: moment(results.created),
          updated: moment(results.created),
        };
        return {
          ...state,
          items: state.items.delete(action.tempID).set(item.id, item),
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
        const item: T = {
          ...action.oldItem as any,
          ...action.item as any,
          updated: moment(action.results.updated),
        };
        return {
          ...state,
          items: state.items.set(item.id, item),
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
