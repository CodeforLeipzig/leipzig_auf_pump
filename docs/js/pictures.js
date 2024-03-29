define(["jquery", "leaflet", "fancybox"], ($, leaflet, fancybox) => {
  const resetPictures = () => {
    $("#pumpsPhotoContainer").remove("a");
  };
  const base = window.location.protocol == "file:" ? "file://D:/git/leipzig_auf_pump/docs/" : "https://codeforleipzig.github.io/leipzig_auf_pump/";
  const readFile = (url, ext) => {
    return $.get(base+url+"." + ext).then((result, status, xhr) => {
      console.log(result)
      return { url, result: { status: xhr && xhr.status, responseText: (ext == "html") ? xhr.responseText : null } }
    }).catch((result, other) => {
      return { url, result: { status: result && result.status, responseText: (ext == "html") ? result.responseText : null } }
    });
  };
  const updatePictures = (state, properties) => {
    resetPictures();
    const id = (properties && properties["numberAnke"]) || state.getSelectedPump();
    const openBox = (items) => fancybox.Fancybox.show(items);
    if (id) {
      if ($("#pumpsPhotoContainer > img").length == 0) {
        const images = Array();
        for (var i=1; i<=20; i++) {
          images.push(readFile('images/' + id + '/' + ((i < 10) ? '0' : '') + i, 'jpg'))
        }
        Promise.all(images).then(imageResults => {
          const resolvedImages = imageResults.map(img => img.result && img.result.status === 200 ? img.url : null).filter(res => res != null);
          const creditLines = resolvedImages.map(resolvedImage => readFile(resolvedImage, "html"));
          Promise.all(creditLines).then(creditLineResults => {
            if (resolvedImages.length > 0) {
              const items = [];
              for (var i=0; i<resolvedImages.length; i++) {
                const path = resolvedImages[i];
                const creditLine = creditLineResults.find(res => res.url === path);
                const caption = creditLine && creditLine.result.status === 200 && creditLine.result.responseText || "";
                const source = "./" + resolvedImages[i] + ".jpg";
                items.push({
                  src: source,
                  thumb: source,
                  opts: {
                    caption: caption
                  },
                  caption: caption
                });
                if (i===0) {
                  $("#pumpsPhotoContainer").append("<a id='openGallery'><img alt='Noch keine Fotos verfügbar' src='" + base + "/" + resolvedImages[i] + ".jpg' style='height: 225px' />" + caption + "</a>");
                  $("#openGallery").click(() => openBox(items));
                }
              }
            } else {
              $("#pumpsPhotoContainer").append("<a>Keine Fotos erfasst</a>");
            }
          });
        });
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