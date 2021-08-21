define(["jquery", "leaflet", "leaflet.ajax"], ($, leaflet, leafletAjax) => ({
	create: () => {
    var pumpMap = leaflet.map('PumpMap');
    var baseMap = leaflet.tileLayer('https://{s}.tile.openaddressmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openaddressmap.org/copyright">OpenAddressMap</a> contributors, <a href="https://opendata.leipzig.de/dataset/strassenbaumkataster">Pumpedaten aus dem OpenDataPortal Leipzig</a>'
    })
    baseMap.addTo(pumpMap);
    return pumpMap;
  },
  createCircleMarker: (state) => (feature, latlng) => {
    const selectedPump = state.getSelectedPump();
    const selectedAddress = state.getLastSelectedAddress();
    const address = feature.properties["address"];
    state.addAddress(address);
    const selectedPumpType = state.getLastSelectedPumpType();
    const pumpType = feature.properties["type"];
    state.addPumpType(pumpType);
    const selectedPumpOperatingState = state.getLastSelectedPumpOperatingState();
    const pumpOperatingState = feature.properties["state"];
    state.addPumpOperatingState(pumpOperatingState);
    const selectedYearFrom = state.getLastSelectedYearFrom();
    const yearFrom = feature.properties["controls"];
    state.addYearFrom(yearFrom);
    const selectedYearTo = state.getLastSelectedYearTo();
    const yearTo = feature.properties["controls"];
    state.addYearTo(yearTo);
    var options = {
      radius: 8,
      fillColor: selectedPump && selectedPump === feature.properties["numberAnke"] ? "red" : "lightgreen",
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    const matchesAddress = !selectedAddress || selectedAddress == 0 || state.getAddresss()[selectedAddress] == address;
    const matchesPumpType = !selectedPumpType || selectedPumpType == 0 || state.getPumpTypes()[selectedPumpType] == pumpType;
    const matchesPumpOperatingState = !selectedPumpOperatingState || selectedPumpOperatingState == 0 || state.getPumpOperatingStates()[selectedPumpOperatingState] == pumpOperatingState;
    const matchesYearFrom = !selectedYearFrom || selectedYearFrom == 0 || parseInt(state.getYearFroms()[selectedYearFrom]) <= parseInt(yearFrom);
    const matchesYearTo = !selectedYearTo || selectedYearTo == 0 || parseInt(state.getYearTos()[selectedYearTo]) >= parseInt(yearTo);
    const showMarker = matchesAddress && matchesPumpType && matchesPumpOperatingState && matchesYearFrom && matchesYearTo;
    if (showMarker) {
      state.setMatchCount(state.getMatchCount() + 1);
      return L.circleMarker(latlng, options);
    }
  },
  districtCenter: (arr) => {
    var arrToUse;
    if (arr.length == 1) {
      arrToUse = arr[0];
    } else {
      arrToUse = arr;
    }
    var center = arrToUse.reduce(function (x, y) {
      return [x[0] + y[0] / arrToUse.length, x[1] + y[1] / arrToUse.length]
    }, [0, 0])
    return [center[1], center[0]];
  }
}));