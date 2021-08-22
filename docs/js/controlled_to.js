define(["jquery"], ($) => ({
  controlledToSelectionBox: (state) => {
    var htmlCode = '<select id="controlledToSelection">';
    for (var index in state.getControlledTos()) {
      var controlledTo = state.getControlledTos()[index];
      if (controlledTo) {
        htmlCode += '<option id="' + index + '">' + controlledTo + '</option>';
      }
    }
    htmlCode += '</select>';
    return htmlCode;
  },

  selectedControlledTo: () => {
    var selectionBox = document.getElementById("controlledToSelection");
    if (selectionBox && selectionBox.selectedIndex != -1) {
      var option = selectionBox.options[selectionBox.selectedIndex];
      if (option) {
        return option.attributes["id"].value;
      } else {
        ''
      }
    } else {
      ''
    }
  },
  setControlledToInSelectionBox: (state) => {
    var selectionBox = document.getElementById('controlledToSelection');
    if (selectionBox) {
      for (var option, index = 0; option = selectionBox.options[index]; index++) {
        if (option.attributes["id"].value == state.getLastSelectedControlledTo()) {
          selectionBox.selectedIndex = index;
          break;
        }
      }
    }
  },
  handleControlledToChange: (document, data, state) => {
    var controlledFromSelectionBox = document.getElementById("controlledFromSelection");
    var controlledToSelectionBox = document.getElementById("controlledToSelection");
    var districtSelectionBox = document.getElementById("districtSelection");
    if (controlledToSelectionBox && controlledToSelectionBox.selectedIndex != -1 &&
      districtSelectionBox && districtSelectionBox.selectedIndex != -1) {
      var selectedControlledTo = controlledToSelectionBox.options[controlledToSelectionBox.selectedIndex].attributes["id"].value;
      var selectedDistrict = districtSelectionBox.options[districtSelectionBox.selectedIndex].attributes["id"].value;
      state.setLastSelectedControlledTo(selectedControlledTo);
      if (selectedControlledTo != "" && selectedDistrict != "") {
        if (controlledFromSelectionBox && controlledFromSelectionBox.selectedIndex != -1) {
          var selectedControlledFrom = controlledFromSelectionBox.options[controlledFromSelectionBox.selectedIndex].attributes["id"].value;
          if (selectedControlledFrom != "") {
            const fromSegments = selectedControlledFrom.split(".")
            const fromStr = fromSegments[2] + "-" + fromSegments[1] + "-" + fromSegments[0]
            const toSegments = selectedControlledTo.split(".")
            const toStr = toSegments[2] + "-" + toSegments[1] + "-" + toSegments[0]
            if (fromStr.localeCompare(toStr) > 0) {
              $('#controlledFromSelection option:contains(' + selectedControlledTo + ')').prop({selected: true});
              state.setLastSelectedControlledFrom(selectedControlledTo);
              state.setControlledFromExplicitySet(selectedControlledTo);
            }
          }
        }
        state.setLastCoordinates(undefined);
        state.setSelectedPump(undefined);
        state.setOldLayer(undefined);
        state.getLastPumpLayer().clearLayers()
        state.getPumpMap().removeLayer(state.getLastClusterLayer());
        data.loadPumpData(state, selectedDistrict);
      }
    }
  }
}));