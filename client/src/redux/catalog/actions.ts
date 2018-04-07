import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Design } from "./types";

export const createDesign = makeCreate<Design>("catalog", "catalog");
export const listDesigns = makeList<Design>("catalog", "catalog");
export const updateDesign = makeUpdate<Design>("catalog", "catalog");
export const deleteDesign = makeDelete<Design>("catalog", "catalog");
