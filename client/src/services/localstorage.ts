import { Store, AnyAction, Unsubscribe } from "redux";
import { RootState } from "../redux/types";

type StoreValueGetter = (state: any) => any;
type StoreValueSetter = (state: any) => AnyAction;

interface LocalStorageSubscription {
  key: string;
  getValue: StoreValueGetter;
  setValue: StoreValueSetter;
  currentValue: any;
}

export class LocalStorageManager {
  private store: Store<RootState> = null;
  private unsubscribe: Unsubscribe = null;

  private subscriptions: LocalStorageSubscription[] = [];

  public constructor(store: Store<any>) {
    this.store = store;
    this.unsubscribe = this.store.subscribe(this.onReduxUpdate);
    window.addEventListener("storage", this.onStorageEvent);
  }

  public registerKey = <T>(key: string, getValue: StoreValueGetter, setValue: StoreValueSetter) => {
    const entry: LocalStorageSubscription = {
      key,
      getValue,
      setValue,
      currentValue: getValue(this.store.getState()),
    };

    this.subscriptions.push(entry);
    this.loadKey(entry);
  }

  private loadKey(entry: LocalStorageSubscription, e?: StorageEvent) {
    const value = JSON.parse(e ? e.newValue : localStorage.getItem(entry.key));
    if (entry.currentValue !== value) {
      entry.currentValue = value;
      this.store.dispatch(entry.setValue(value));
    }
  }

  private saveKey(sub: LocalStorageSubscription) {
    localStorage.setItem(sub.key, JSON.stringify(sub.currentValue));
  }

  private onReduxUpdate = () => {
    const state = this.store.getState();

    for (const sub of this.subscriptions) {
      const newValue = sub.getValue(state);
      if (newValue !== sub.currentValue) {
        sub.currentValue = newValue;
        this.saveKey(sub);
      }
    }
  }

  private onStorageEvent = (e: StorageEvent) => {
    const sub = this.subscriptions.find(s => s.key === e.key);
    if (sub)
      this.loadKey(sub, e);
  }

  public destroy() {
    this.unsubscribe();
    this.store = null;
    this.subscriptions = [];
    this.unsubscribe = null;

    window.removeEventListener("storage", this.onStorageEvent);
  }
}
