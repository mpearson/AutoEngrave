import { Store, AnyAction, Unsubscribe } from "redux";
import { RootState } from "../redux/types";

export class LocalStorageManager {
  private store: Store<RootState> = null;
  private unsubscribe: Unsubscribe = null;

  private subscriptions: Array<{
    key: string;
    getValue: (state: any) => any;
    setValue: (value: any) => AnyAction;
    lastValue: any;
  }>;

  public constructor(store: Store<any>) {
    this.subscriptions = [];
    this.store = store;
    this.unsubscribe = this.store.subscribe(this.onReduxUpdate);
    window.addEventListener("storage", this.onStorageEvent);
  }

  public registerKey = <T>(key: string, getValue: (state: RootState) => T, setValue: (value: T) => AnyAction) => {
    this.subscriptions.push({
      key,
      getValue,
      setValue,
      lastValue: getValue(this.store.getState()),
    });
  }

  private load() {
    for (const key of this.subscriptions) {
      const {getValue, setValue} = this.subscriptions[key];
      const value = JSON.parse(localStorage.getItem(key));
      if (getValue(this.store) !== value)
        this.store.dispatch(setValue(value));
    }

  }

  private save() {

    localStorage.setItem(this.key, JSON.stringify(settings));
  }



  private onReduxUpdate = () => {
    // const newState = this.getState(this.store.getState());
    const state = this.store.getState();

    for (const key of Object.keys(this.subscriptions)) {

    if (newState !== this.lastState) {
      this.lastState = newState;
      this.save(newState);
    }
  }

  private onStorageEvent = (e: StorageEvent) => {
    if (e.key === this.key && e.newValue !== e.oldValue) {
      const newState = JSON.parse(e.newValue);
      if (newState !== this.lastState) {
        this.lastState = newState;
        this.store.dispatch(this.updateStateAction(newState));
      }
    }
  }

  public destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.store = null;
      this.getState = null;
      this.updateStateAction = null;
      this.unsubscribe = null;

      window.removeEventListener("storage", this.onStorageEvent);
    }
  }
}
