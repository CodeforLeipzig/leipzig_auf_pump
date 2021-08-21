define(["jquery", "leaflet", "leaflet.ajax", "district", "address", "pump_type", "pump_operatingState", "year_from", "year_to", "location"], ($, leaflet, leafletAjax, district, address, pumpType, pumpOperatingState, yearFrom, yearTo, location) => {
  return {
    configureInfo: (state, data) => {
      // control that shows state info on hover
      var info = leaflet.control();
      info.onAdd = function (map) {
        this._div = leaflet.DomUtil.create('div', 'info');
        this.update();
        return this._div;
      };
      info.update = function (id, props) {
        var htmlInner = '<div style="width: 350px;">';
        htmlInner += '<input id="shareLocation" type="button" value="Teile Standort" />'
        htmlInner += "<br /><br />"
        if (!props) {
          htmlInner += '<h4>Hovere &uuml;ber eine Pumpe</h4>'
        } else {
          htmlInner += '<h4>Infos</h4>'
        }
        htmlInner += "<br />"
        htmlInner += "<b>Suchtreffer:</b> "
        htmlInner += state.getMatchCount();
        htmlInner += "<br /><br />"
        htmlInner += "<b>Ortsteil:</b> "
        htmlInner += district.districtSelectionBox(state);
        htmlInner += "<br /><br />"
        htmlInner += "<b>Nummer [Anke]:</b> "
        if (props) {
          htmlInner += props["numberAnke"]
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>offizielle Nummer:</b> "
        if (props) {
          htmlInner += props["numberOfficial"]
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Bezeichnung:</b> "
        if (props) {
          htmlInner += props["name"]
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Datierung:</b> "
        if (props) {
          htmlInner += props["date"]
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Beschreibung:</b> "
        if (props) {
          htmlInner += props["description"]
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Fütterung:</b> "
        if (props) {
          htmlInner += props["feeding"]
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Kontrollen:</b> "
        if (props) {
          htmlInner += props["controls"]
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Adresse:</b> "
        htmlInner += address.addressSelectionBox(state);
        if (props) {
          state.setLastSelectedAddress(state.getAddresss().indexOf(props["address"]));
        } else if (!state.getAddressExplicitySet()) {
          state.setLastSelectedAddress(0);
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Betriebszustand:</b> "
        htmlInner += pumpOperatingState.pumpOperatingStateSelectionBox(state);
        if (props) {
          state.setLastSelectedPumpOperatingState(state.getPumpOperatingStates().indexOf(props["state"]));
        } else if (!state.getPumpOperatingStateExplicitySet()) {
          state.setLastSelectedPumpOperatingState(0);
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Pumpenart:</b> "
        htmlInner += pumpType.pumpTypeSelectionBox(state);
        if (props) {
          state.setLastSelectedPumpType(state.getPumpTypes().indexOf(props["type"]));
        } else if (!state.getPumpTypeExplicitySet()) {
          state.setLastSelectedPumpType(0);
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Zuletzt kontrolliert:</b> zwischen "
        htmlInner += yearFrom.yearFromSelectionBox(state);
        if (props) {
          state.setLastSelectedYearFrom(state.getYearFroms().indexOf(props["controls"]));
        } else {
          state.setLastSelectedYearFrom(state.getYearFromExplicitySet());
        }
        htmlInner += " und "
        htmlInner += yearTo.yearToSelectionBox(state);
        if (props) {
          state.setLastSelectedYearTo(state.getYearTos().indexOf(props["controls"]));
        } else {
          state.setLastSelectedYearTo(state.getYearToExplicitySet());
        }
        if (props) {
          htmlInner += "<br /><br />"
        }
        htmlInner += '</div>';
        this._div.innerHTML = htmlInner;
        district.setDistrictInSelectionBox(state);
        address.setAddressInSelectionBox(state);
        pumpType.setPumpTypeInSelectionBox(state);
        pumpOperatingState.setPumpOperatingStateInSelectionBox(state);
        yearFrom.setYearFromInSelectionBox(state);
        yearTo.setYearToInSelectionBox(state);
        $("#districtSelection").off('change');
        $("#districtSelection").on('change', function(e) {
          district.handleDistrictChange(document, data, state);
          state.getInfo().update();
        });
        $("#addressSelection").off('change');
        $("#addressSelection").on('change', function(e) {
          state.setAddressExplicitySet(true);
          address.handleAddressChange(document, data, state);
          state.setAddressExplicitySet(state.getLastSelectedAddress() != 0);
        });
        $("#pumpTypeSelection").off('change');
        $("#pumpTypeSelection").on('change', function(e) {
          state.setPumpTypeExplicitySet(true);
          pumpType.handlePumpTypeChange(document, data, state);
          state.setPumpTypeExplicitySet(state.getLastSelectedPumpType() != 0);
        });
        $("#pumpOperatingStateSelection").off('change');
        $("#pumpOperatingStateSelection").on('change', function(e) {
          state.setPumpOperatingStateExplicitySet(true);
          pumpOperatingState.handlePumpOperatingStateChange(document, data, state);
          state.setPumpOperatingStateExplicitySet(state.getLastSelectedPumpOperatingState() != 0);
        });
        $("#yearFromSelection").off('change');
        $("#yearFromSelection").on('change', function(e) {
          state.setYearFromExplicitySet(true);
          yearFrom.handleYearFromChange(document, data, state);
          state.setYearFromExplicitySet(state.getLastSelectedYearFrom());
        });
        $("#yearToSelection").off('change');
        $("#yearToSelection").on('change', function(e) {
          state.setYearToExplicitySet(true);
          yearTo.handleYearToChange(document, data, state);
          state.setYearToExplicitySet(state.getLastSelectedYearTo());
        });
        $("#shareLocation").on('click', function(e) {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              state.setShareLocation(true);
              location.fillPumpLocations(state).then(() => {
                state.setCurrentPosition(position);
                location.setNearestDistrict(state, data);
              });
            });
          }
        })
      }
      state.setInfo(info);
      return info;
    },
    highlightFeature: (state, e) => {
      var layer = e.target;
      if (!leaflet.Browser.ie && !leaflet.Browser.opera && !leaflet.Browser.edge) {
        layer.bringToFront();
      }
      state.getInfo().update(e.layer.feature.id, e.layer.feature.properties);
    },
    resetHighlight: (state, e) => {
      state.getInfo().update();
    }
  };
});