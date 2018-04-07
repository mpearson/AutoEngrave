import { Design } from "./types";
import { makeReducer } from "../CRUD/reducer";

export const catalogReducer = makeReducer<Design>("catalog");
