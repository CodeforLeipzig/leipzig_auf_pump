define({
  state: () => {
    var zoomLevel = 15;
    var pumpMap;
    var lastSelectedDistrict;
    var lastSelectedAddress;
    var addressExplicitySet = false;
    var lastSelectedPumpType;
    var lastSelectedPumpOperatingState;
    var pumpTypeExplicitySet = false;
    var pumpOperatingStateExplicitySet = false;
    var lastSelectedYearFrom;
    var yearFromExplicitySet = false;
    var lastSelectedYearTo;
    var yearToExplicitySet = false;
    var oldLayer;
    var lastCoordinates;
    var lastPumpLayer;
    var lastClusterLayer;
    var lastDistrictLayer;
    var selectedPump;
    var addresss = [ " " ];
    var pumpTypes = [ " " ];
    var pumpOperatingStates = [ " " ];
    var yearFroms = [ " " ];
    var yearTos = [ " " ];
    var lastHoveredCoords;
    var info;
    var matchCount = 0;
    var pumpLocs = new Map();
    var currentPosition;
    var shareLocation = false;

    return {
      getZoomLevel: () => { return zoomLevel },
      getPumpMap: () => { return pumpMap },
      getLastSelectedDistrict: () => { return lastSelectedDistrict },
      getLastSelectedAddress: () => { return lastSelectedAddress },
      getLastSelectedPumpType: () => { return lastSelectedPumpType },
      getLastSelectedPumpOperatingState: () => { return lastSelectedPumpOperatingState },
      getLastSelectedYearFrom: () => { return lastSelectedYearFrom },
      getLastSelectedYearTo: () => { return lastSelectedYearTo },
      getOldLayer: () => { return oldLayer },
      getLastCoordinates: () => { return lastCoordinates },
      getLastPumpLayer: () => { return lastPumpLayer },
      getLastClusterLayer: () => { return lastClusterLayer },
      getLastDistrictLayer: () => { return lastDistrictLayer },
      getSelectedPump: () => { return selectedPump },
      getLastHoveredCoords: () => { return lastHoveredCoords },
      getInfo: () => { return info },
      getAddresss: ()  => { return addresss.sort() },
      getPumpTypes: ()  => { return pumpTypes.sort() },
      getPumpOperatingStates: ()  => { return pumpOperatingStates.sort() },
      getYearFroms: ()  => { return yearFroms.sort() },
      getYearTos: ()  => { return yearTos.sort() },
      getAddressExplicitySet: () => { return addressExplicitySet },
      getPumpTypeExplicitySet: () => { return pumpTypeExplicitySet },
      getPumpOperatingStateExplicitySet: () => { return pumpOperatingStateExplicitySet },
      getYearFromExplicitySet: () => { return yearFromExplicitySet },
      getYearToExplicitySet: () => { return yearToExplicitySet },
      getMatchCount: () => { return matchCount },
      hasPumpLocs: () => pumpLocs.size > 0,
      getNearestPumpLoc: (userLoc) => [...pumpLocs].map(([, value]) => value).reduce((currMin, pumpLoc) => {
          const dist = Math.hypot(userLoc.lng - pumpLoc.x, userLoc.lat - pumpLoc.y)
          return (currMin.dist > dist) ? { dist, ...pumpLoc } : currMin;
        }, { dist: Number.MAX_VALUE }),
      getCurrentPosition: () => { return currentPosition; },
      isShareLocation: () => { return shareLocation; },

      setPumpMap: (newPumpMap) => { pumpMap = newPumpMap },
      setLastSelectedDistrict: (newLastSelectedDistrict) => { lastSelectedDistrict = newLastSelectedDistrict },
      setLastSelectedAddress: (newLastSelectedAddress) => { lastSelectedAddress = newLastSelectedAddress },
      setLastSelectedPumpType: (newLastSelectedPumpType) => { lastSelectedPumpType = newLastSelectedPumpType },
      setLastSelectedPumpOperatingState: (newLastSelectedPumpOperatingState) => { lastSelectedPumpOperatingState = newLastSelectedPumpOperatingState },
      setLastSelectedYearFrom: (newLastSelectedYearFrom) => { lastSelectedYearFrom = newLastSelectedYearFrom },
      setLastSelectedYearTo: (newLastSelectedYearTo) => { lastSelectedYearTo = newLastSelectedYearTo },
      setOldLayer: (newOldLayer) => { oldLayer = newOldLayer },
      setLastCoordinates: (newLastCoordinates) => { lastCoordinates = newLastCoordinates },
      setLastPumpLayer: (newLastPumpLayer) => { lastPumpLayer = newLastPumpLayer },
      setLastClusterLayer: (newLastClusterLayer) => { lastClusterLayer = newLastClusterLayer },
      setLastDistrictLayer: (newLastDistrictLayer) => { lastDistrictLayer = newLastDistrictLayer },
      setSelectedPump: (newSelectedPump) => { selectedPump = newSelectedPump },
      setLastHoveredCoords: (newLastHoveredCoords) => { lastHoveredCoords = newLastHoveredCoords },
      setInfo: (newInfo) => { info = newInfo },
      addAddress: (address) => { if (addresss.indexOf(address) < 0) addresss.push(address) },
      resetAddresss: () => { addresss = [ " " ] },
      addPumpType: (pumpType) => { if (pumpTypes.indexOf(pumpType) < 0) pumpTypes.push(pumpType) },
      resetPumpTypes: () => { pumpTypes = [ " " ] },
      addPumpOperatingState: (pumpOperatingState) => { if (pumpOperatingStates.indexOf(pumpOperatingState) < 0) pumpOperatingStates.push(pumpOperatingState) },
      resetPumpOperatingStates: () => { pumpOperatingStates = [ " " ] },
      addYearFrom: (yearFrom) => { if (yearFroms.indexOf(yearFrom) < 0) yearFroms.push(yearFrom) },
      resetYearFroms: () => { yearFroms = [ " " ] },
      addYearTo: (yearTo) => { if (yearTos.indexOf(yearTo) < 0) yearTos.push(yearTo) },
      resetYearTos: () => { yearTos = [ " " ] },
      setAddressExplicitySet: (newAddressExplicitySet) => { addressExplicitySet = newAddressExplicitySet },
      setPumpTypeExplicitySet: (newPumpTypeExplicitySet) => { pumpTypeExplicitySet = newPumpTypeExplicitySet },
      setPumpOperatingStateExplicitySet: (newPumpOperatingStateExplicitySet) => { pumpOperatingStateExplicitySet = newPumpOperatingStateExplicitySet },
      setYearFromExplicitySet: (newYearFromExplicitySet) => { yearFromExplicitySet = newYearFromExplicitySet },
      setYearToExplicitySet: (newYearToExplicitySet) => { yearToExplicitySet = newYearToExplicitySet },
      setMatchCount: (newMatchCount) => { matchCount = newMatchCount},
      setPumpLoc: (pumpLoc) => { pumpLocs.set(pumpLoc.id, pumpLoc) },
      setCurrentPosition: position => {
        if (position) {
          currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        } else {
          currentPosition = undefined;
        }
      },
      setShareLocation: (newShareLocation) => { shareLocation = newShareLocation; }
    }
  }
});


