import { Settings } from "./settings";
import { writable } from "svelte/store";

const settingStore = writable<Settings>();
export default { settingStore };
