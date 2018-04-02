import * as actions from "./actions";
import { ConnectionAction }  from "./actions";
import { ComPort, baudrates, PortState } from "./types";
import * as moment from "moment";

export type ConnectionState = {
  readonly ports: ComPort[];
  readonly port: ComPort;
  readonly baudrate: string;
  readonly isFetchingPorts: boolean;
  readonly state: PortState;
  readonly connectedTime: moment.Moment;
  readonly isConnecting: boolean;
  readonly isDisconnecting: boolean;
  readonly isFetchingStatus: boolean;
};

const defaultState: ConnectionState = {
  ports: [],
  port: "",
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
      return { ...state, ports: action.results, isFetchingPorts: false };
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
      const { port, baudrate } = action.status;
      const connectedTime = moment(action.status.connectedTime);
      return { ...state, isFetchingStatus: false, port, baudrate, connectedTime };
    }
    case actions.GET_STATUS_ERROR: {
      return { ...state, isFetchingStatus: false };
    }
    default:
      return state;
  }
};
