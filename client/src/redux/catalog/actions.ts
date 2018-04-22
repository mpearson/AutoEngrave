import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Design, CATALOG_PREFIX } from "./types";

export const createDesign = makeCreate<Design>(CATALOG_PREFIX);
export const listDesigns = makeList<Design>(CATALOG_PREFIX);
export const updateDesign = makeUpdate<Design>(CATALOG_PREFIX);
export const deleteDesign = makeDelete<Design>(CATALOG_PREFIX);
