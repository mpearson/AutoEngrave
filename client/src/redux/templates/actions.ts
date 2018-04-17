import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Template } from "./types";

export const createTemplate = makeCreate<Template>("templates");
export const listTemplates = makeList<Template>("templates");
export const updateTemplate = makeUpdate<Template>("templates");
export const deleteTemplate = makeDelete<Template>("templates");
