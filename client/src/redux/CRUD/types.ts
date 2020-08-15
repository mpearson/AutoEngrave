import { OrderedMap } from "immutable";
import { RestApiAction, AsyncPromiseAction } from "../types";
import { Moment } from "moment";

export interface CrudItem {
  id?: number;
  isFetching?: boolean;
  created?: Moment;
  updated?: Moment;
}

export interface CrudState<T extends CrudItem> {
  readonly items: OrderedMap<number, T>;
  readonly isFetchingItems: boolean;
  readonly isCreatingItem: boolean;
  readonly isUpdatingItem: boolean;
  readonly isDeletingItem: boolean;
}

export interface CrudAction<T extends CrudItem> extends RestApiAction {
  id?: number;
  tempID?: number;
  diff?: Partial<T>;
}

type RestApiReturn<T> = AsyncPromiseAction<CrudAction<T>>;

export type CreateActionCreator<T extends CrudItem> = (diff: Partial<T>) => RestApiReturn<T>;
export type ReadActionCreator<T extends CrudItem> = () => RestApiReturn<T>;
export type UpdateActionCreator<T extends CrudItem> = (id: number, diff: Partial<T>) => RestApiReturn<T>;
export type DeleteActionCreator<T extends CrudItem> = (id: number) => RestApiReturn<T>;
