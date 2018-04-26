import { APIAction, AsyncAction } from "./../types";
import { Template, TemplateSlot } from "../templates/types";
import { Job } from "./types";
import { Design } from "../catalog/types";

export const SELECT_TEMPLATE = "workspace/SELECT_TEMPLATE";
export const SELECT_MACHINE = "workspace/SELECT_MACHINE";
export const SET_ACTIVE_JOB = "workspace/SET_ACTIVE_JOB";

export interface WorkspaceAction extends APIAction {
  template?: Template;
  templateID?: number;
  machineID?: number;
  job?: Job;
}

export const addDesignToTemplate = (design: Design, slot: TemplateSlot): AsyncAction => {
  return (dispatch, getState) => {
    const state = getState().workspace;
    const job: Job = state.activeJob || {
      name: "Untitled Job",
      tasks: [],
    };

    return { type: SET_ACTIVE_JOB, job };
  };
};
