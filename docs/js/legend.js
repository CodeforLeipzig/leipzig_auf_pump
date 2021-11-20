define(["jquery", "leaflet"], ($, leaflet) => {
  return {
    configureLegend: () => {
      var legend = L.control({
        position: 'topleft'
      });
      legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<div style="font-weight: bold; padding-bottom: 5px">Pumpen-Zustände</div>';
        div.innerHTML += '<i style="background: black"></i>nicht mehr vorhanden<br />';
        div.innerHTML += '<i style="background: darkgrey"></i>außer Betrieb<br />';
        div.innerHTML += '<i style="background: white"></i>unbekannter Zustand<br />';
        div.innerHTML += '<i style="background: lightgreen"></i>betriebsbereit<br />';
        div.innerHTML += '<i style="background: yellow"></i>aktuell selektiert';
        return div;
      };
      return legend;
    }
  };
});