import { LocalSettingsState, LocalSettingsAction } from "./types";

export const LOCAL_SETTINGS_LOAD = "LOCAL_SETTINGS_LOAD";
// export const LOCAL_SETTINGS_UPDATE_KEY = "LOCAL_SETTINGS_UPDATE_KEY";

export const setLocalSettings = (settings: LocalSettingsState): LocalSettingsAction => ({
  type: LOCAL_SETTINGS_LOAD,
  settings,
});

// export const updateLocalSettings = <K extends keyof LocalSettingsState>(
//   key: K,
//   value: LocalSettingsState[K]
// ): LocalSettingsAction => ({
//   type: LOCAL_SETTINGS_LOAD,
//   key,
//   value,
// });
