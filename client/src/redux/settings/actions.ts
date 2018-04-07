import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Machine, Material } from "./types";

export const createMachineProfile = makeCreate<Machine>("settings/machines");
export const listMachineProfiles = makeList<Machine>("settings/machines");
export const updateMachineProfile = makeUpdate<Machine>("settings/machines");
export const deleteMachineProfile = makeDelete<Machine>("settings/machines");

export const createMaterialProfile = makeCreate<Material>("settings/materials");
export const listMaterialProfiles = makeList<Material>("settings/materials");
export const updateMaterialProfile = makeUpdate<Material>("settings/materials");
export const deleteMaterialProfile = makeDelete<Material>("settings/materials");
