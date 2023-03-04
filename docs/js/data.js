define(["jquery", "leaflet", "show_district_border_layer", "show_pump_layer", "show_tree_layer"], function ($, leaflet, showDistrictBorderLayer, showPumpLayer, showTreeLayer) {
  return {
    loadData: (state, district) => {
      $.getJSON(`geojsons/districts/${district}.geojson`, data => {
        showDistrictBorderLayer(state, data);
        $.getJSON(`geojsons/pumps/${district}.geojson`, data => showPumpLayer(state, data))
      });
    },
    loadPumpData: (state, district) => {
      $.getJSON(`geojsons/pumps/${district}.geojson`, data => showPumpLayer(state, data));
    },
    loadTreeData: (state, pumpId) => {
      $.getJSON(`geojsons/trees/${pumpId}.geojson`, data => showTreeLayer(state, data));
    }
  }
});