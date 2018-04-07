import { Design } from "./types";
import { createCrudReducer } from "../CRUD/reducer";

export const catalogReducer = createCrudReducer<Design>("catalog");
