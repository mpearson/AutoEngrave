import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Machine, Material, MACHINES_PREFIX, MATERIALS_PREFIX } from "./types";

export const createMachineProfile = makeCreate<Machine>(MACHINES_PREFIX);
export const listMachineProfiles = makeList<Machine>(MACHINES_PREFIX);
export const updateMachineProfile = makeUpdate<Machine>(MACHINES_PREFIX);
export const deleteMachineProfile = makeDelete<Machine>(MACHINES_PREFIX);

export const createMaterialProfile = makeCreate<Material>(MATERIALS_PREFIX);
export const listMaterialProfiles = makeList<Material>(MATERIALS_PREFIX);
export const updateMaterialProfile = makeUpdate<Material>(MATERIALS_PREFIX);
export const deleteMaterialProfile = makeDelete<Material>(MATERIALS_PREFIX);
