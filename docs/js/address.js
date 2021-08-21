define(["jquery"], ($) => ({
  addressSelectionBox: (state) => {
    var htmlCode = '<select id="addressSelection">';
    for (var index in state.getAddresss()) {
      var address = state.getAddresss()[index];
      if (address) {
        htmlCode += '<option id="' + index + '">' + address + '</option>';
      }
    }
    htmlCode += '</select>';
    return htmlCode;
  },

  selectedAddress: () => {
    var selectionBox = document.getElementById("addressSelection");
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
  setAddressInSelectionBox: (state) => {
    var selectionBox = document.getElementById('addressSelection');
    if (selectionBox) {
      for (var option, index = 0; option = selectionBox.options[index]; index++) {
        if (option.attributes["id"].value == state.getLastSelectedAddress()) {
          selectionBox.selectedIndex = index;
          break;
        }
      }
    }
  },
  handleAddressChange: (document, data, state) => {
    var addressSelectionBox = document.getElementById("addressSelection");
    var districtSelectionBox = document.getElementById("districtSelection");
    if (addressSelectionBox && addressSelectionBox.selectedIndex != -1 &&
      districtSelectionBox && districtSelectionBox.selectedIndex != -1) {
      var selectedAddress = addressSelectionBox.options[addressSelectionBox.selectedIndex].attributes["id"].value;
      var selectedDistrict = districtSelectionBox.options[districtSelectionBox.selectedIndex].attributes["id"].value;
      state.setLastSelectedAddress(selectedAddress);
      if (selectedAddress != "" && selectedDistrict != "") {
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