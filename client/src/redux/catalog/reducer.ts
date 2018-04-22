import { Design, CATALOG_PREFIX } from "./types";
import { makeReducer } from "../CRUD/reducer";

export const catalogReducer = makeReducer<Design>(CATALOG_PREFIX);
