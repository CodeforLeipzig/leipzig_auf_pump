define(["jquery", "leaflet", "leaflet.markercluster", "progress", "map", "icon", "info", "pictures"], ($, leaflet, leafletClusterMap, updateProgressBar, map, icon, info, pictures) => {
  return (state, data) => {
    var geoJsonLayer = leaflet.geoJson(data, { pointToLayer: map.createTreeCircleMarker(state) });
    state.getPumpMap().addLayer(geoJsonLayer);
  }
});