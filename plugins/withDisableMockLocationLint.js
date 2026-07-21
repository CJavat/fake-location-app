const { withAppBuildGradle } = require("expo/config-plugins");

/**
 * Este app usa ACCESS_MOCK_LOCATION a propósito en todas las variantes
 * (no solo debug), así que el lint "MockLocation" de Android debe
 * deshabilitarse o el build de release falla en `lintVitalRelease`.
 */
const withDisableMockLocationLint = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (
      config.modResults.language === "groovy" &&
      !config.modResults.contents.includes("disable 'MockLocation'")
    ) {
      config.modResults.contents = config.modResults.contents.replace(
        /android\s*\{/,
        `android {\n    lint {\n        disable 'MockLocation'\n        abortOnError false\n    }`,
      );
    }
    return config;
  });
};

module.exports = withDisableMockLocationLint;
