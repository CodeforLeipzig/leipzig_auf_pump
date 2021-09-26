define(["jquery", "leaflet", "leaflet.ajax", "district", "address", "pump_type", "pump_physicalState", "pump_detailedPhysicalState", "pump_operatingState", "controlled_from", "controlled_to", "location"], ($, leaflet, leafletAjax, district, address, pumpType, pumpPhysicalState, pumpDetailedPhysicalState, pumpOperatingState, controlledFrom, controlledTo, location) => {
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
        htmlInner += '<input id="shareLocation" type="button" value="Zoome auf Deinen aktuellen Standort" />'
        htmlInner += "<br /><br />"
        if (!props) {
          htmlInner += '<h4>Hovere &uuml;ber eine Pumpe</h4>'
        } else {
          htmlInner += '<h4>Infos</h4>'
        }
        htmlInner += '<b>Hinweis:</b> Den Marker einer Pumpe einmal anklicken, um Auswahl einzurasten und so dann z.B. die Galerieansicht dieses Marker &ouml;ffnen zu k&ouml;nnen, nochmaliges Anklicken des Markers l&ouml;st die Auswahl wieder<br />';
        htmlInner += "<br />"
        htmlInner += "<b>Suchtreffer:</b> "
        htmlInner += state.getMatchCount();
        htmlInner += "<br /><br />"
        htmlInner += "<b>Ortsteil:</b> "
        htmlInner += district.districtSelectionBox(state);
        htmlInner += "<br /><br />"
        htmlInner += "<b>Nummer:</b> "
        if (props) {
          htmlInner += props["numberAnke"] || ""
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>offizielle Nummer:</b> "
        if (props) {
          htmlInner += props["numberOfficial"] || ""
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Bezeichnung:</b> "
        if (props) {
          htmlInner += props["name"] || ""
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Datierung:</b> "
        if (props) {
          htmlInner += props["date"] || ""
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Beschreibung:</b> "
        if (props) {
          htmlInner += props["description"] || ""
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
        htmlInner += "<b>Zustandsbeschreibung:</b> "
        if (props) {
          htmlInner += props["stateDescription"] || ""
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Physischer Zustand:</b> "
        htmlInner += pumpPhysicalState.pumpPhysicalStateSelectionBox(state);
        if (props) {
          state.setLastSelectedPumpPhysicalState(state.getPumpPhysicalStates().indexOf(props["physicalState"]));
        } else if (!state.getPumpPhysicalStateExplicitySet()) {
          state.setLastSelectedPumpPhysicalState(0);
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Detailierter physischer Zustand:</b> "
        htmlInner += pumpDetailedPhysicalState.pumpDetailedPhysicalStateSelectionBox(state);
        if (props) {
          state.setLastSelectedPumpDetailedPhysicalState(state.getPumpDetailedPhysicalStates().indexOf(props["detailedPhysicalState"]));
        } else if (!state.getPumpDetailedPhysicalStateExplicitySet()) {
          state.setLastSelectedPumpDetailedPhysicalState(0);
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Betriebszustand:</b> "
        htmlInner += pumpOperatingState.pumpOperatingStateSelectionBox(state);
        if (props) {
          state.setLastSelectedPumpOperatingState(state.getPumpOperatingStates().indexOf(props["operatingState"]));
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
        htmlInner += "<b>Zuletzt kontrolliert:</b><br />zwischen "
        htmlInner += controlledFrom.controlledFromSelectionBox(state);
        if (props) {
          state.setLastSelectedControlledFrom(state.getControlledFroms().indexOf(props["lastControl"]));
        } else {
          state.setLastSelectedControlledFrom(state.getControlledFromExplicitySet());
        }
        htmlInner += " und "
        htmlInner += controlledTo.controlledToSelectionBox(state);
        if (props) {
          state.setLastSelectedControlledTo(state.getControlledTos().indexOf(props["lastControl"]));
        } else {
          state.setLastSelectedControlledTo(state.getControlledToExplicitySet());
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Fütterung:</b> "
        if (props) {
          htmlInner += props["feedingDescription"] || ""
        }
        htmlInner += "<br /><br />"
        htmlInner += "<b>Kontrollen:</b> "
        if (props) {
          htmlInner += props["controlsDescription"] || ""
        }
        if (props) {
          htmlInner += "<br /><br />"
        }
        htmlInner += '</div>';
        this._div.innerHTML = htmlInner;
        district.setDistrictInSelectionBox(state);
        address.setAddressInSelectionBox(state);
        pumpType.setPumpTypeInSelectionBox(state);
        pumpPhysicalState.setPumpPhysicalStateInSelectionBox(state);
        pumpDetailedPhysicalState.setPumpDetailedPhysicalStateInSelectionBox(state);
        pumpOperatingState.setPumpOperatingStateInSelectionBox(state);
        controlledFrom.setControlledFromInSelectionBox(state);
        controlledTo.setControlledToInSelectionBox(state);
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
        $("#pumpPhysicalStateSelection").off('change');
        $("#pumpPhysicalStateSelection").on('change', function(e) {
          state.setPumpPhysicalStateExplicitySet(true);
          pumpPhysicalState.handlePumpPhysicalStateChange(document, data, state);
          state.setPumpPhysicalStateExplicitySet(state.getLastSelectedPumpPhysicalState() != 0);
        });
        $("#pumpDetailedPhysicalStateSelection").off('change');
        $("#pumpDetailedPhysicalStateSelection").on('change', function(e) {
          state.setPumpDetailedPhysicalStateExplicitySet(true);
          pumpDetailedPhysicalState.handlePumpDetailedPhysicalStateChange(document, data, state);
          state.setPumpDetailedPhysicalStateExplicitySet(state.getLastSelectedPumpDetailedPhysicalState() != 0);
        });
        $("#pumpOperatingStateSelection").off('change');
        $("#pumpOperatingStateSelection").on('change', function(e) {
          state.setPumpOperatingStateExplicitySet(true);
          pumpOperatingState.handlePumpOperatingStateChange(document, data, state);
          state.setPumpOperatingStateExplicitySet(state.getLastSelectedPumpOperatingState() != 0);
        });
        $("#controlledFromSelection").off('change');
        $("#controlledFromSelection").on('change', function(e) {
          state.setControlledFromExplicitySet(true);
          controlledFrom.handleControlledFromChange(document, data, state);
          state.setControlledFromExplicitySet(state.getLastSelectedControlledFrom());
        });
        $("#controlledToSelection").off('change');
        $("#controlledToSelection").on('change', function(e) {
          state.setControlledToExplicitySet(true);
          controlledTo.handleControlledToChange(document, data, state);
          state.setControlledToExplicitySet(state.getLastSelectedControlledTo());
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
      state.getPictures().update(e.layer.feature.id, e.layer.feature.properties);
    },
    resetHighlight: (state, e) => {
      state.getInfo().update();
    }
  };
});