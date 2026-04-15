const semver: string =
  typeof __APP_SEMVER__ !== "undefined" ? __APP_SEMVER__ : "0.0.0";
const sha: string =
  typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "0000000";
const buildTime: string =
  typeof __BUILD_TIME__ !== "undefined" ? __BUILD_TIME__ : "";

export const APP_SEMVER = semver;
export const APP_SHA = sha;
export const APP_SHA_SHORT = sha.slice(0, 7);
export const APP_BUILD_TIME = buildTime;
export const APP_VERSION_LABEL = `v${APP_SEMVER} (${APP_SHA_SHORT})`;
