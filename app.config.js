const appConfig = require("./app.json");

const mapboxDownloadsToken = process.env.MAPBOX_DOWNLOADS_TOKEN;

// if (!mapboxDownloadsToken) {
//   throw new Error(
//     "MAPBOX_DOWNLOADS_TOKEN must be defined to configure @rnmapbox/maps.",
//   );
// }

module.exports = {
  ...appConfig.expo,
  plugins: appConfig.expo.plugins.map((plugin) =>
    plugin === "@rnmapbox/maps"
      ? [
          "@rnmapbox/maps",
          {
            RNMapboxMapsImpl: "mapbox",
            RNMapboxMapsDownloadToken: mapboxDownloadsToken,
          },
        ]
      : plugin,
  ),
};
