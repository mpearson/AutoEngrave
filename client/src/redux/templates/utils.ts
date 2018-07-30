import { createSelector } from "reselect";
import { RootState } from "../types";

export const getActiveTemplate = createSelector(
  (state: RootState) => state.templates.items,
  (state: RootState) => state.workspace.templateID,
  (templates, templateID) => templates.get(templateID)
);
