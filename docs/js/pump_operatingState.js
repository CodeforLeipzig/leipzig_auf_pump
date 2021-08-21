define(["jquery"], ($) => ({
  pumpOperatingStateSelectionBox: (state) => {
    var htmlCode = '<select id="pumpOperatingStateSelection">';
    for (var index in state.getPumpOperatingStates()) {
      var pumpOperatingState = state.getPumpOperatingStates()[index];
      if (pumpOperatingState) {
        htmlCode += '<option id="' + index + '">' + pumpOperatingState + '</option>';
      }
    }
    htmlCode += '</select>';
    return htmlCode;
  },

  selectedPumpOperatingState: () => {
    var selectionBox = document.getElementById("pumpOperatingStateSelection");
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
  setPumpOperatingStateInSelectionBox: (state) => {
    var selectionBox = document.getElementById('pumpOperatingStateSelection');
    if (selectionBox) {
      for (var option, index = 0; option = selectionBox.options[index]; index++) {
        if (option.attributes["id"].value == state.getLastSelectedPumpOperatingState()) {
          selectionBox.selectedIndex = index;
          break;
        }
      }
    }
  },
  handlePumpOperatingStateChange: (document, data, state) => {
    var pumpOperatingStateSelectionBox = document.getElementById("pumpOperatingStateSelection");
    var districtSelectionBox = document.getElementById("districtSelection");
    if (pumpOperatingStateSelectionBox && pumpOperatingStateSelectionBox.selectedIndex != -1 &&
      districtSelectionBox && districtSelectionBox.selectedIndex != -1) {
      var selectedPumpOperatingState = pumpOperatingStateSelectionBox.options[pumpOperatingStateSelectionBox.selectedIndex].attributes["id"].value;
      var selectedDistrict = districtSelectionBox.options[districtSelectionBox.selectedIndex].attributes["id"].value;
      state.setLastSelectedPumpOperatingState(selectedPumpOperatingState);
      if (selectedPumpOperatingState != "" && selectedDistrict != "") {
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