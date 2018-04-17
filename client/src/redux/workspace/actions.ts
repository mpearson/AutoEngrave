import { APIAction } from "./../types";
import { Template } from "../templates/types";

export const SELECT_TEMPLATE = "workspace/SELECT_TEMPLATE";

export interface WorkspaceAction extends APIAction {
  template?: Template;
  templateID?: number;
}
