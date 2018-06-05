import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Design, CATALOG_PREFIX } from "./types";
import { CrudAction } from "../CRUD/types";

export const SELECT_DESIGN = CATALOG_PREFIX + "/SELECT_DESIGN";

export const createDesign = makeCreate<Design>(CATALOG_PREFIX);
export const listDesigns = makeList<Design>(CATALOG_PREFIX);
export const updateDesign = makeUpdate<Design>(CATALOG_PREFIX);
export const deleteDesign = makeDelete<Design>(CATALOG_PREFIX);
export const selectDesign = (item: Design): CrudAction<Design> => ({ type: SELECT_DESIGN, item });
