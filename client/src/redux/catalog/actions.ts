import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Design } from "./types";

export const createDesign = makeCreate<Design>("catalog");
export const listDesigns = makeList<Design>("catalog");
export const updateDesign = makeUpdate<Design>("catalog");
export const deleteDesign = makeDelete<Design>("catalog");
