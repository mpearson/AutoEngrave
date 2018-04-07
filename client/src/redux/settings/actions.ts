import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Machine, Material } from "./types";

export const createMachineProfile = makeCreate<Machine>("machines", "settings/machines");
export const listMachineProfiles = makeList<Machine>("machines", "settings/machines");
export const updateMachineProfile = makeUpdate<Machine>("machines", "settings/machines");
export const deleteMachineProfile = makeDelete<Machine>("machines", "settings/machines");

export const createMaterialProfile = makeCreate<Material>("materials", "settings/materials");
export const listMaterialProfiles = makeList<Material>("materials", "settings/materials");
export const updateMaterialProfile = makeUpdate<Material>("materials", "settings/materials");
export const deleteMaterialProfile = makeDelete<Material>("materials", "settings/materials");
