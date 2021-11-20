define(["jquery", "leaflet", "leaflet.markercluster", "progress", "map", "icon", "info", "pictures"], ($, leaflet, leafletClusterMap, updateProgressBar, map, icon, info, pictures) => {
  return (state, data) => {
    state.setMatchCount(0);
    var clusterLayer = leaflet.markerClusterGroup({ chunkedLoading: true, chunkProgress: updateProgressBar, maxClusterRadius: () => 25 });
    state.setLastClusterLayer(clusterLayer);
    var geoJsonLayer = leaflet.geoJson(data, { pointToLayer: map.createCircleMarker(state) });
    state.setLastPumpLayer(geoJsonLayer);
    clusterLayer.addLayer(geoJsonLayer);
    state.getPumpMap().addLayer(clusterLayer);
    registerLayerMouseOver(state, icon, info, geoJsonLayer);
    registerLayerMouseOut(state, icon, info, pictures, geoJsonLayer);
    geoJsonLayer.on('click', registerLayerMouseClick(state, icon, info, pictures));
    state.getInfo().update();
    state.getPictures().update();
  }
});

function registerLayerMouseOver(state, icon, info, geoJsonLayer) {
  geoJsonLayer.on('mouseover', function (e) {
    if (!state.getLastCoordinates()) {
      state.setSelectedPump(e.layer.feature.properties["numberAnke"]);
      icon.changeIcon(state, e);
      info.highlightFeature(state, e);
    }
  });
};

function registerLayerMouseOut(state, icon, info, pictures, geoJsonLayer) {
  geoJsonLayer.on('mouseout', function (e) {
    if (!state.getLastCoordinates()) {
      info.resetHighlight(state, e);
      icon.resetIcon(state);
      pictures.resetPictures();
    }
  });
};

function registerLayerMouseClick(state, icon, info, pictures) {
  return (e) => {
    var coordinates = e.layer.feature.geometry.coordinates;
    var layer = e.layer;
    if (state.getLastCoordinates() != coordinates) {
      if (state.getLastCoordinates()) {
        icon.resetIcon(state);
        icon.changeIcon(state, e);
      }
      info.highlightFeature(state, e);
      state.setLastCoordinates(coordinates);
    } else {
      icon.resetIcon(state);
      pictures.resetPictures();
      state.setLastCoordinates(undefined);
      state.setSelectedPump(undefined);
    }
    state.setOldLayer(layer);
  }
}
