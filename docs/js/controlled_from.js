define(["jquery"], ($) => ({
  controlledFromSelectionBox: (state) => {
    var htmlCode = '<select id="controlledFromSelection">';
    for (var index in state.getControlledFroms()) {
      var controlledFrom = state.getControlledFroms()[index];
      if (controlledFrom) {
        htmlCode += '<option id="' + index + '">' + controlledFrom + '</option>';
      }
    }
    htmlCode += '</select>';
    return htmlCode;
  },

  selectedControlledFrom: () => {
    var selectionBox = document.getElementById("controlledFromSelection");
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
  setControlledFromInSelectionBox: (state) => {
    var selectionBox = document.getElementById('controlledFromSelection');
    if (selectionBox) {
      for (var option, index = 0; option = selectionBox.options[index]; index++) {
        if (option.attributes["id"].value == state.getLastSelectedControlledFrom()) {
          selectionBox.selectedIndex = index;
          break;
        }
      }
    }
  },
  handleControlledFromChange: (document, data, state) => {
    var controlledToSelectionBox = document.getElementById("controlledToSelection");
    var controlledFromSelectionBox = document.getElementById("controlledFromSelection");
    var districtSelectionBox = document.getElementById("districtSelection");
    if (controlledFromSelectionBox && controlledFromSelectionBox.selectedIndex != -1 &&
      districtSelectionBox && districtSelectionBox.selectedIndex != -1) {
      var selectedControlledFrom = controlledFromSelectionBox.options[controlledFromSelectionBox.selectedIndex].attributes["id"].value;
      var selectedDistrict = districtSelectionBox.options[districtSelectionBox.selectedIndex].attributes["id"].value;
      state.setLastSelectedControlledFrom(selectedControlledFrom);
      if (selectedControlledFrom != "" && selectedDistrict != "") {
        if (controlledToSelectionBox && controlledToSelectionBox.selectedIndex != -1) {
          var selectedControlledTo = controlledToSelectionBox.options[controlledToSelectionBox.selectedIndex].attributes["id"].value;
          if (selectedControlledTo != "") {
            const fromSegments = selectedControlledFrom.split(".")
            const fromStr = fromSegments[2] + "-" + fromSegments[1] + "-" + fromSegments[0]
            const toSegments = selectedControlledTo.split(".")
            const toStr = toSegments[2] + "-" + toSegments[1] + "-" + toSegments[0]
            if (fromStr.localeCompare(toStr) > 0) {
              $('#controlledToSelection option:contains(' + selectedControlledFrom + ')').prop({selected: true});
              state.setLastSelectedControlledTo(selectedControlledFrom);
              state.setControlledToExplicitySet(selectedControlledFrom);
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