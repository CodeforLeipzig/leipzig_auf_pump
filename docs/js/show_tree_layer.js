define(["jquery", "leaflet", "leaflet.markercluster", "progress", "map", "icon", "info", "pictures"], ($, leaflet, leafletClusterMap, updateProgressBar, map, icon, info, pictures) => {
  return (state, data) => {
    var clusterLayer = leaflet.markerClusterGroup({ chunkedLoading: true, chunkProgress: updateProgressBar, maxClusterRadius: () => 25 });
    var geoJsonLayer = leaflet.geoJson(data, { pointToLayer: map.createTreeCircleMarker(state) });
    clusterLayer.addLayer(geoJsonLayer);
    state.getPumpMap().addLayer(clusterLayer);
  }
});