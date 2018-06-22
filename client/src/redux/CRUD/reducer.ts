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

const createItemFromJson = <T extends CrudItem>(item: any): T => ({
  ...item,
  created: moment(item.created),
  updated: moment(item.updated),
  isFetching: false,
});

export const makeReducer = <T extends CrudItem>(name: string): Reducer<CrudState<T>> => {
  return (state = getDefaultCrudState<T>(), action: CrudAction<T>) => {
    const [ actionPrefix, actionType ] = action.type.split("/");
    if (actionPrefix !== name)
      return state;
    switch (actionType) {
      // Create
      case actions.CREATE_REQUEST: {
        const { diff, tempID } = action;
        const tempModel: T = {
          ...diff as any,
          id: tempID,
          created: moment(),
          updated: moment(),
          isFetching: true,
        };
        return {
          ...state,
          items: state.items.set(tempID, tempModel),
          isCreatingItem: true,
        };
      }
      case actions.CREATE_SUCCESS: {
        const { diff, tempID, results } = action;
        const newModel: T = {
          ...diff as any,
          id: results.id,
          created: moment(results.created),
          updated: moment(results.created),
          isFetching: false,
        };
        return {
          ...state,
          items: state.items.delete(tempID).set(newModel.id, newModel),
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
        return {
          ...state,
          isFetchingItems: true,
        };
      }
      case actions.LIST_RECEIVE: {
        const items = OrderedMap<number, T>(
          Seq(action.results as any[]).map(row => [row.id, createItemFromJson(row)])
        );
        return {
          ...state,
          items,
          isFetchingItems: false,
        };
      }
      case actions.LIST_ERROR: {
        return {
          ...state,
          isFetchingItems: false,
        };
      }
      // Update
      case actions.UPDATE_REQUEST: {
        return {
          ...state,
          items: state.items.update(action.id, item => ({ ...item as any, isFetching: true })),
          isUpdatingItem: true,
        };
      }
      case actions.UPDATE_SUCCESS: {
        const { id, diff, results } = action;
        const oldModel = state.items.get(id);
        const newModel: T = {
          ...oldModel as any,
          ...diff as any,
          updated: moment(results.updated),
          isFetching: false,
        };
        return {
          ...state,
          items: state.items.set(id, newModel),
          isUpdatingItem: false,
        };
      }
      case actions.UPDATE_ERROR: {
        return {
          ...state,
          items: state.items.update(action.id, item => ({ ...item as any, isFetching: false })),
          isUpdatingItem: false,
        };
      }
      // Delete
      case actions.DELETE_REQUEST: {
        return {
          ...state,
          items: state.items.update(action.id, item => ({ ...item as any, isFetching: true })),
          isDeletingItem: true,
        };
      }
      case actions.DELETE_SUCCESS: {
        return {
          ...state,
          items: state.items.delete(action.id),
          isDeletingItem: false,
        };
      }
      case actions.DELETE_ERROR: {
        return {
          ...state,
          items: state.items.update(action.id, item => ({ ...item as any, isFetching: false })),
          isDeletingItem: false,
        };
      }
      default: {
        return state;
      }
    }
  };
};
