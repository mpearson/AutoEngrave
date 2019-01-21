import { Store, AnyAction, Unsubscribe } from "redux";

export class LocalStorageManager<S, T> {
  private store: Store<S, any> = null;
  private unsubscribe: Unsubscribe = null;
  private getState: (state: S) => T = null;
  private updateStateAction: (state: T) => AnyAction = null;
  private key: string = null;
  private lastState: T = null;

  public constructor(
    key: string,
    store: Store<S>,
    getState: (state: S) => T,
    updateStateAction: (state: T) => AnyAction
  ) {
    this.key = key;
    this.store = store;
    this.getState = getState;
    this.updateStateAction = updateStateAction;

    this.lastState = this.load();

    if (this.lastState === null) {
      this.lastState = getState(this.store.getState());
    } else {
      this.store.dispatch(this.updateStateAction(this.lastState));
    }

    this.unsubscribe = this.store.subscribe(this.onReduxUpdate);

    window.addEventListener("storage", this.onStorageEvent);
  }

  private load(): T {
    return JSON.parse(localStorage.getItem(this.key));
  }

  private save(settings: T) {
    localStorage.setItem(this.key, JSON.stringify(settings));
  }

  private onReduxUpdate = () => {
    const newState = this.getState(this.store.getState());

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
