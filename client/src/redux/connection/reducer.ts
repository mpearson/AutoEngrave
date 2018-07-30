import * as actions from "./actions";
import { ConnectionAction }  from "./actions";
import { ConnectionState, baudrates, PortState } from "./types";
import * as moment from "moment";

const defaultState: ConnectionState = {
  ports: [],
  port: null,
  baudrate: baudrates[0],
  isFetchingPorts: false,
  state: PortState.Closed,
  connectedTime: null,
  isConnecting: false,
  isDisconnecting: false,
  isFetchingStatus: false,
};

export const connectionReducer = (state = defaultState, action: ConnectionAction): ConnectionState => {
  switch (action.type) {
    case actions.GET_PORTS_REQUEST: {
      return { ...state, isFetchingPorts: true };
    }
    case actions.GET_PORTS_RECEIVE: {
      const { results } = action;
      const connected = state.state !== PortState.Closed;
      return {
        ...state,
        ports: results,
        // don't change the selected port if we're connected already
        port: connected ? state.port : (results[results.length - 1] || null),
        isFetchingPorts: false,
      };
    }
    case actions.GET_PORTS_ERROR: {
      return { ...state, ports: [], isFetchingPorts: false };
    }
    case actions.SELECT_PORT: {
      return { ...state, port: action.port };
    }
    case actions.SELECT_BAUDRATE: {
      return { ...state, baudrate: action.baudrate };
    }
    case actions.CONNECT_REQUEST: {
      return { ...state, state: PortState.Opening };
    }
    case actions.CONNECT_SUCCESS: {
      return { ...state, state: PortState.Open };
    }
    case actions.CONNECT_ERROR: {
      return { ...state, state: PortState.Closed };
    }
    case actions.DISCONNECT_REQUEST: {
      return { ...state, state: PortState.Closing };
    }
    case actions.DISCONNECT_SUCCESS: {
      return { ...state, state: PortState.Closed };
    }
    case actions.DISCONNECT_ERROR: {
      // TODO: something
      return { ...state };
    }
    case actions.GET_STATUS_REQUEST: {
      return { ...state, isFetchingStatus: true };
    }
    case actions.GET_STATUS_SUCCESS: {
      const { port, baudrate, connected, connectedTime } = action.results;
      return {
        ...state,
        isFetchingStatus: false,
        state: connected ? PortState.Open : PortState.Closed,
        // only update the port/baudrate selection if the server is actually connected
        port: connected ? port : state.port,
        baudrate: connected ? baudrate : state.baudrate,
        connectedTime: connectedTime ? moment(connectedTime) : null,
      };
    }
    case actions.GET_STATUS_ERROR: {
      return { ...state, isFetchingStatus: false };
    }
    default:
      return state;
  }
};
