var siteUrl = window.location.protocol == "file:" ? "file://D:/git/leipzig_auf_pump/docs/" : "https://codeforleipzig.github.io/leipzig_auf_pump/";
requirejs.config({
  baseUrl: siteUrl + "js/",
  paths: {
    "leaflet": "https://unpkg.com/leaflet@1.7.1/dist/leaflet",
    "leaflet.ajax": "https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min",
    "leaflet.markercluster": "https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster",
    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min",
    "fancybox": "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd",
  },
  shim: {
    "leaflet.ajax": [ "leaflet" ],
    "leaflet.markercluster": [ "leaflet" ]
  }
});

require(["jquery", "map", "data", "shared_state", "info", "legend", "pictures", "district", "leaflet"], function ($, map, data, state, info, legend, pictures, district, leaflet) {
  $.ajaxSetup({
    scriptCharset: "utf-8",
    contentType: "application/json; charset=utf-8"
  });

  const pumpMap = map.create();
  const globalState = state.state();
  globalState.setPumpMap(pumpMap);
  const infoBox = info.configureInfo(globalState, data);
  const legendBox = legend.configureLegend();
  const picturesBox = pictures.configureLegend(globalState, data);
  data.loadData(globalState, district.allDistricts[0]);
  infoBox.addTo(pumpMap);
  legendBox.addTo(pumpMap);
  picturesBox.addTo(pumpMap);
});
