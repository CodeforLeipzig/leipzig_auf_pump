define(["jquery"], ($) => ({
  pumpPhysicalStateSelectionBox: (state) => {
    var htmlCode = '<select id="pumpPhysicalStateSelection">';
    for (var index in state.getPumpPhysicalStates()) {
      var pumpPhysicalState = state.getPumpPhysicalStates()[index];
      if (pumpPhysicalState) {
        htmlCode += '<option id="' + index + '">' + pumpPhysicalState + '</option>';
      }
    }
    htmlCode += '</select>';
    return htmlCode;
  },

  selectedPumpPhysicalState: () => {
    var selectionBox = document.getElementById("pumpPhysicalStateSelection");
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
  setPumpPhysicalStateInSelectionBox: (state) => {
    var selectionBox = document.getElementById('pumpPhysicalStateSelection');
    if (selectionBox) {
      for (var option, index = 0; option = selectionBox.options[index]; index++) {
        if (option.attributes["id"].value == state.getLastSelectedPumpPhysicalState()) {
          selectionBox.selectedIndex = index;
          break;
        }
      }
    }
  },
  handlePumpPhysicalStateChange: (document, data, state) => {
    var pumpPhysicalStateSelectionBox = document.getElementById("pumpPhysicalStateSelection");
    var districtSelectionBox = document.getElementById("districtSelection");
    if (pumpPhysicalStateSelectionBox && pumpPhysicalStateSelectionBox.selectedIndex != -1 &&
      districtSelectionBox && districtSelectionBox.selectedIndex != -1) {
      var selectedPumpPhysicalState = pumpPhysicalStateSelectionBox.options[pumpPhysicalStateSelectionBox.selectedIndex].attributes["id"].value;
      var selectedDistrict = districtSelectionBox.options[districtSelectionBox.selectedIndex].attributes["id"].value;
      state.setLastSelectedPumpPhysicalState(selectedPumpPhysicalState);
      if (selectedPumpPhysicalState != "" && selectedDistrict != "") {
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