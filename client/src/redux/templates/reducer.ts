import { Template } from "./types";
import { makeReducer } from "../CRUD/reducer";

export const templatesReducer = makeReducer<Template>("templates");
