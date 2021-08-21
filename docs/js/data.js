define(["jquery", "leaflet", "leaflet.ajax", "show_district_border_layer", "show_pump_layer"], function ($, leaflet, leafletAjax, showDistrictBorderLayer, showPumpLayer) {
  return {
    loadData: (state, district) => {
      $.getJSON(`geojsons/districts/${district}.geojson`, data => showDistrictBorderLayer(state, data));
      $.getJSON(`geojsons/pumps/${district}.geojson`, data => showPumpLayer(state, data));
    },
    loadPumpData: (state, district) => {
      $.getJSON(`geojsons/pumps/${district}.geojson`, data => showPumpLayer(state, data));
    }
  }
});