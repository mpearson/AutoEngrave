import { makeCreate, makeList, makeUpdate, makeDelete } from "../CRUD/actions";
import { Machine, Material, MACHINES_PREFIX, MATERIALS_PREFIX } from "./types";

const machinesEndpoint = "settings/machines";
const materialsEndpoint = "settings/materials";

export const createMachineProfile = makeCreate<Machine>(MACHINES_PREFIX, machinesEndpoint);
export const listMachineProfiles = makeList<Machine>(MACHINES_PREFIX, machinesEndpoint);
export const updateMachineProfile = makeUpdate<Machine>(MACHINES_PREFIX, machinesEndpoint);
export const deleteMachineProfile = makeDelete<Machine>(MACHINES_PREFIX, machinesEndpoint);

export const createMaterialProfile = makeCreate<Material>(MATERIALS_PREFIX, materialsEndpoint);
export const listMaterialProfiles = makeList<Material>(MATERIALS_PREFIX, materialsEndpoint);
export const updateMaterialProfile = makeUpdate<Material>(MATERIALS_PREFIX, materialsEndpoint);
export const deleteMaterialProfile = makeDelete<Material>(MATERIALS_PREFIX, materialsEndpoint);
