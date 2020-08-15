import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Design, CATALOG_PREFIX, CatalogAction } from "./types";
import { Set } from "immutable";

export const SET_SELECTED_DESIGNS = CATALOG_PREFIX + "/SET_SELECTED_DESIGNS";

export const createDesign = makeCreate<Design>(CATALOG_PREFIX);
export const listDesigns = makeList<Design>(CATALOG_PREFIX);
export const updateDesign = makeUpdate<Design>(CATALOG_PREFIX);
export const deleteDesign = makeDelete<Design>(CATALOG_PREFIX);
export const selectDesign = (selectedIds: Set<number>): CatalogAction => ({
  type: SET_SELECTED_DESIGNS, selectedIds
});
