define(["jquery", "leaflet"], ($, leaflet) => ({
	create: () => {
    var pumpMap = leaflet.map('PumpMap');
    var baseMap = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://de.wikipedia.org/wiki/Liste_der_Handschwengelpumpen_in_Leipzig">Pumpendaten aus Wikipedia</a>'
    })
    baseMap.addTo(pumpMap);
    return pumpMap;
  },
  createCircleMarker: (state) => (feature, latlng) => {
    const selectedAddress = state.getLastSelectedAddress();
    const address = feature.properties["address"];
    state.addAddress(address);
    const selectedPumpType = state.getLastSelectedPumpType();
    const pumpType = feature.properties["type"];
    state.addPumpType(pumpType);
    const selectedPumpPhysicalState = state.getLastSelectedPumpPhysicalState();
    const pumpPhysicalState = feature.properties["physicalState"];
    state.addPumpPhysicalState(pumpPhysicalState);
    const selectedPumpDetailedPhysicalState = state.getLastSelectedPumpDetailedPhysicalState();
    const pumpDetailedPhysicalState = feature.properties["detailedPhysicalState"];
    state.addPumpDetailedPhysicalState(pumpDetailedPhysicalState);
    const selectedPumpOperatingState = state.getLastSelectedPumpOperatingState();
    const pumpOperatingState = feature.properties["operatingState"];
    state.addPumpOperatingState(pumpOperatingState);
    const selectedControlledFrom = state.getLastSelectedControlledFrom();
    const controlledFrom = feature.properties["lastControl"];
    state.addControlledFrom(controlledFrom);
    const selectedControlledTo = state.getLastSelectedControlledTo();
    const controlledTo = feature.properties["lastControl"];
    state.addControlledTo(controlledTo);
    var fillColor;
    if (pumpPhysicalState == "nicht vorhanden") {
      fillColor = "black";
    } else if (pumpOperatingState == "außer Betrieb") {
      fillColor = "darkgrey";
    } else if (pumpOperatingState == "unbekannt") {
      fillColor = "white";
    } else {
      fillColor = "lightgreen";
    }
    const number = feature.properties["numberAnke"];
    state.setPumpColor({ id: number, color: fillColor})
    var options = {
      radius: 8,
      fillColor: fillColor,
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    const matchesAddress = !selectedAddress || selectedAddress == 0 || state.getAddresss()[selectedAddress] == address;
    const matchesPumpType = !selectedPumpType || selectedPumpType == 0 || state.getPumpTypes()[selectedPumpType] == pumpType;
    const matchesPumpPhysicalState = !selectedPumpPhysicalState || selectedPumpPhysicalState == 0 || state.getPumpPhysicalStates()[selectedPumpPhysicalState] == pumpPhysicalState;
    const matchesPumpDetailedPhysicalState = !selectedPumpDetailedPhysicalState || selectedPumpDetailedPhysicalState == 0 || state.getPumpDetailedPhysicalStates()[selectedPumpDetailedPhysicalState] == pumpDetailedPhysicalState;
    const matchesPumpOperatingState = !selectedPumpOperatingState || selectedPumpOperatingState == 0 || state.getPumpOperatingStates()[selectedPumpOperatingState] == pumpOperatingState;
    const matchesControlledFrom = !selectedControlledFrom || selectedControlledFrom == 0 || parseInt(state.getControlledFroms()[selectedControlledFrom]) <= parseInt(controlledFrom);
    const matchesControlledTo = !selectedControlledTo || selectedControlledTo == 0 || parseInt(state.getControlledTos()[selectedControlledTo]) >= parseInt(controlledTo);
    const showMarker = matchesAddress && matchesPumpType && matchesPumpPhysicalState && matchesPumpDetailedPhysicalState && matchesPumpOperatingState && matchesControlledFrom && matchesControlledTo;
    if (showMarker) {
      state.setMatchCount(state.getMatchCount() + 1);
      return L.circleMarker(latlng, options);
    }
  },
  createTreeCircleMarker: (state) => (feature, latlng) => {
    const age = 2023 - feature.properties.pflanzjahr
    if (age <= 15) {
      fillColor = "orange";
    } else {
      fillColor = "darkgreen";
    }
    var options = {
      radius: 8,
      fillColor: fillColor,
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }
    return L.circleMarker(latlng, options);
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