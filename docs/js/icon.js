define({
  changeIcon: (state, e) => {
    const lastPumpLayer = state.getLastPumpLayer();
    var keys = Object.keys(lastPumpLayer._layers)
    keys.forEach(function (key) {
      var layerCoord = lastPumpLayer._layers[key]._latlng;
      var currentCoord = e.layer.feature.geometry.coordinates;
      state.setLastHoveredCoords(currentCoord);
      if (layerCoord.lat === currentCoord[1] &&
        layerCoord.lng === currentCoord[0]) {
        lastPumpLayer._layers[key].setStyle({
          fillColor: "#FEFF01"
        });
      }
    })
  },
  resetIcon: (state) => {
    const lastPumpLayer = state.getLastPumpLayer();
    var keys = Object.keys(lastPumpLayer._layers)
    keys.forEach(function (key) {
      var layerCoord = lastPumpLayer._layers[key]._latlng;
      var currentCoord = state.getLastHoveredCoords();
      if (currentCoord && layerCoord.lat === currentCoord[1] &&
        layerCoord.lng === currentCoord[0]) {
        lastPumpLayer._layers[key].setStyle({
          fillColor: "lightgreen"
        });
      }
    })
  }
});