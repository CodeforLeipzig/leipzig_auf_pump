define(["jquery"], ($) => ({
  pumpDetailedPhysicalStateSelectionBox: (state) => {
    var htmlCode = '<select id="pumpDetailedPhysicalStateSelection">';
    for (var index in state.getPumpDetailedPhysicalStates()) {
      var pumpDetailedPhysicalState = state.getPumpDetailedPhysicalStates()[index];
      if (pumpDetailedPhysicalState) {
        htmlCode += '<option id="' + index + '">' + pumpDetailedPhysicalState + '</option>';
      }
    }
    htmlCode += '</select>';
    return htmlCode;
  },

  selectedPumpDetailedPhysicalState: () => {
    var selectionBox = document.getElementById("pumpDetailedPhysicalStateSelection");
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
  setPumpDetailedPhysicalStateInSelectionBox: (state) => {
    var selectionBox = document.getElementById('pumpDetailedPhysicalStateSelection');
    if (selectionBox) {
      for (var option, index = 0; option = selectionBox.options[index]; index++) {
        if (option.attributes["id"].value == state.getLastSelectedPumpDetailedPhysicalState()) {
          selectionBox.selectedIndex = index;
          break;
        }
      }
    }
  },
  handlePumpDetailedPhysicalStateChange: (document, data, state) => {
    var pumpDetailedPhysicalStateSelectionBox = document.getElementById("pumpDetailedPhysicalStateSelection");
    var districtSelectionBox = document.getElementById("districtSelection");
    if (pumpDetailedPhysicalStateSelectionBox && pumpDetailedPhysicalStateSelectionBox.selectedIndex != -1 &&
      districtSelectionBox && districtSelectionBox.selectedIndex != -1) {
      var selectedPumpDetailedPhysicalState = pumpDetailedPhysicalStateSelectionBox.options[pumpDetailedPhysicalStateSelectionBox.selectedIndex].attributes["id"].value;
      var selectedDistrict = districtSelectionBox.options[districtSelectionBox.selectedIndex].attributes["id"].value;
      state.setLastSelectedPumpDetailedPhysicalState(selectedPumpDetailedPhysicalState);
      if (selectedPumpDetailedPhysicalState != "" && selectedDistrict != "") {
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