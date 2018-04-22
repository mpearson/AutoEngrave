import { Template, TEMPLATES_PREFIX } from "./types";
import { makeReducer } from "../CRUD/reducer";

export const templatesReducer = makeReducer<Template>(TEMPLATES_PREFIX);
