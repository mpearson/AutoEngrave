import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Template, TEMPLATES_PREFIX } from "./types";

export const createTemplate = makeCreate<Template>(TEMPLATES_PREFIX);
export const listTemplates = makeList<Template>(TEMPLATES_PREFIX);
export const updateTemplate = makeUpdate<Template>(TEMPLATES_PREFIX);
export const deleteTemplate = makeDelete<Template>(TEMPLATES_PREFIX);
