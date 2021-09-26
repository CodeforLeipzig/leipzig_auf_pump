define(["jquery", "leaflet", "leaflet.ajax", "fancybox"], ($, leaflet, leafletAjax, fancybox) => {
  const resetPictures = () => {
    for (var i=0; i<5; i++) {
      $("#pumpsPhotoContainer a:last-child").remove();
    }
  };
  const updatePictures = (state, properties) => {
    resetPictures();
    const id = (properties && properties["numberAnke"]) || state.getSelectedPump()
    if (id) {
      if ($("#pumpsPhotoContainer > img").length == 0) {
        $("#pumpsPhotoContainer").append("<a data-fancybox='gallery' data-src='./images/" + id + "/01.jpg'><img alt='Noch keine Fotos verfügbar' src='./images/" + id + "/01.jpg' style='height:275px' /></a>");
        $("#pumpsPhotoContainer").append("<a data-fancybox='gallery' data-src='./images/" + id + "/02.jpg'><img src='./images/" + id + "/02.jpg' style='width:0px' /></a>");
        $("#pumpsPhotoContainer").append("<a data-fancybox='gallery' data-src='./images/" + id + "/03.jpg'><img src='./images/" + id + "/03.jpg' style='width:0px' /></a>");
        $("#pumpsPhotoContainer").append("<a data-fancybox='gallery' data-src='./images/" + id + "/04.jpg'><img src='./images/" + id + "/04.jpg' style='width:0px' /></a>");
        $("#pumpsPhotoContainer").append("<a data-fancybox='gallery' data-src='./images/" + id + "/05.jpg'><img src='./images/" + id + "/05.jpg' style='width:0px' /></a>");
      }
    }
  }
  return {
    configureLegend: (state, data) => {
      var picturePane = L.control({
        position: 'bottomleft'
      });
      picturePane.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info legend');
        this.update();
        return this._div;
      };
      picturePane.update = function (id, data) {
        var htmlInner = '<div style="width: 370px; height: 300px;"><h4>Fotos (Klick auf Foto für Galerie aller Fotos)</h4>';
        htmlInner += '<div style="width: 350px; height: 250px;" id="pumpsPhotoContainer"/>'
        htmlInner += '</div>'
        this._div.innerHTML = htmlInner;
        updatePictures(state, data);
      };
      state.setPictures(picturePane);
      return picturePane;
    },
    resetPictures,
    updatePictures,
  };
});