define(["jquery", "leaflet", "leaflet.ajax", "district"], ($, leaflet, leafletAjax, district) => {
  return {
    fillPumpLocations: (state) => {
      if (!state.hasPumpLocs()) {
        return $.getJSON(`geojsons/pumps/alle.geojson`, geojsonData => {
          geojsonData.features.forEach(feature => {
            const id = feature.properties["numberAnke"];
            state.setPumpLoc({
              id,
              district: feature.properties["ortsteil"],
              x: feature.properties["xcoord"],
              y: feature.properties["ycoord"],
            });
            state.setPumpColor({
              id,
              color: 'lightgreen'
            });
          });
        });
      } else {
        return Promise.resolve();
      }
    },
    setNearestDistrict: (state, data) => {
      const latLng = state.getCurrentPosition();
      if (latLng) {
        const pump = state.getNearestPumpLoc(latLng)
        if (pump) {
          $('select[id="districtSelection"]').find('option:contains("' + pump.district + '")').attr("selected", true).parent().change();
        }
      }
    },
    setLocation: (state, centroid) => {
      const position = state.getCurrentPosition() || centroid;
      state.getPumpMap().setView(position, state.getZoomLevel())
      if (state.getCurrentPosition()) {
        L.marker(position).addTo(state.getPumpMap());
      }
    }
  }
});