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

type APIReturn<T> = AsyncPromiseAction<CrudAction<T>>;

export type CreateActionCreator<T extends CrudItem> = (item: T) => APIReturn<T>;
export type ReadActionCreator<T extends CrudItem> = () => APIReturn<T>;
export type UpdateActionCreator<T extends CrudItem> = (oldItem: T, item: Partial<T>) => APIReturn<T>;
export type DeleteActionCreator<T extends CrudItem> = (item: T) => APIReturn<T>;
