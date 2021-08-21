define(["jquery"], ($) => ({
  pumpTypeSelectionBox: (state) => {
    var htmlCode = '<select id="pumpTypeSelection">';
    for (var index in state.getPumpTypes()) {
      var pumpType = state.getPumpTypes()[index];
      if (pumpType) {
        htmlCode += '<option id="' + index + '">' + pumpType + '</option>';
      }
    }
    htmlCode += '</select>';
    return htmlCode;
  },

  selectedPumpType: () => {
    var selectionBox = document.getElementById("pumpTypeSelection");
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
  setPumpTypeInSelectionBox: (state) => {
    var selectionBox = document.getElementById('pumpTypeSelection');
    if (selectionBox) {
      for (var option, index = 0; option = selectionBox.options[index]; index++) {
        if (option.attributes["id"].value == state.getLastSelectedPumpType()) {
          selectionBox.selectedIndex = index;
          break;
        }
      }
    }
  },
  handlePumpTypeChange: (document, data, state) => {
    var pumpTypeSelectionBox = document.getElementById("pumpTypeSelection");
    var districtSelectionBox = document.getElementById("districtSelection");
    if (pumpTypeSelectionBox && pumpTypeSelectionBox.selectedIndex != -1 &&
      districtSelectionBox && districtSelectionBox.selectedIndex != -1) {
      var selectedPumpType = pumpTypeSelectionBox.options[pumpTypeSelectionBox.selectedIndex].attributes["id"].value;
      var selectedDistrict = districtSelectionBox.options[districtSelectionBox.selectedIndex].attributes["id"].value;
      state.setLastSelectedPumpType(selectedPumpType);
      if (selectedPumpType != "" && selectedDistrict != "") {
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