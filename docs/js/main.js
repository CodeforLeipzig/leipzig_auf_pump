var siteUrl = window.location.protocol == "file:" ? "file://D:/git/leipzig_auf_pump/docs/" : "https://codeforleipzig.github.io/leipzig_auf_pump/";
requirejs.config({
  baseUrl: siteUrl + "js/",
  paths: {
    "leaflet": "https://unpkg.com/leaflet@1.7.1/dist/leaflet",
    "leaflet.ajax": "https://cdnjs.cloudflare.com/ajax/libs/leaflet-ajax/2.1.0/leaflet.ajax.min",
    "leaflet.markercluster": "https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster",
    "jquery": "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min",
  }
});

require(["jquery", "map", "data", "shared_state", "info", "district", "leaflet", "leaflet.ajax"], function ($, map, data, state, info, district, leaflet, leafletAjax) {
  $.ajaxSetup({
    scriptCharset: "utf-8",
    contentType: "application/json; charset=utf-8"
  });

  const pumpMap = map.create();
  const globalState = state.state();
  globalState.setPumpMap(pumpMap);
  const infoBox = info.configureInfo(globalState, data);
  data.loadData(globalState, district.allDistricts[0]);
  infoBox.addTo(pumpMap);
});