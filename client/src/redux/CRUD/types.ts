import { OrderedMap } from "immutable";
import { APIAction, AsyncPromiseAction } from "../types";

export interface CrudItem {
  id?: number;
  isFetching?: boolean;
}

export interface CrudState<T extends CrudItem> {
  items: OrderedMap<number, T>;
  isFetchingItems: boolean;
  isCreatingItem: boolean;
  isUpdatingItem: boolean;
  isDeletingItem: boolean;
}

export interface CrudAction<T extends CrudItem> extends APIAction {
  item?: T;
  oldItem?: T;
  tempID?: number;
}

export type CreateActionCreator<T extends CrudItem> = (item: T) => AsyncPromiseAction<CrudAction<T>>;
export type ReadActionCreator<T extends CrudItem> = () => AsyncPromiseAction<CrudAction<T>>;
export type UpdateActionCreator<T extends CrudItem> = (oldItem: T, item: T) => AsyncPromiseAction<CrudAction<T>>;
export type DeleteActionCreator<T extends CrudItem> = (item: T) => AsyncPromiseAction<CrudAction<T>>;
