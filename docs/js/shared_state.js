define({
  state: () => {
    var zoomLevel = 15;
    var pumpId;
    var pumpMap;
    var lastSelectedDistrict;
    var lastSelectedAddress;
    var addressExplicitySet = false;
    var lastSelectedPumpType;
    var lastSelectedPumpPhysicalState;
    var lastSelectedPumpDetailedPhysicalState;
    var lastSelectedPumpOperatingState;
    var pumpTypeExplicitySet = false;
    var pumpPhysicalStateExplicitySet = false;
    var pumpDetailedPhysicalStateExplicitySet = false;
    var pumpOperatingStateExplicitySet = false;
    var lastSelectedControlledFrom;
    var controlledFromExplicitySet = false;
    var lastSelectedControlledTo;
    var controlledToExplicitySet = false;
    var oldLayer;
    var lastCoordinates;
    var lastPumpLayer;
    var lastClusterLayer;
    var lastDistrictLayer;
    var selectedPump;
    var addresss = [ " " ];
    var pumpTypes = [ " " ];
    var pumpPhysicalStates = [ " " ];
    var pumpDetailedPhysicalStates = [ " " ];
    var pumpOperatingStates = [ " " ];
    var controlledFroms = [ " " ];
    var controlledTos = [ " " ];
    var lastHoveredCoords;
    var info;
    var pictures;
    var matchCount = 0;
    var pumpLocs = new Map();
    var pumpColors = new Map();
    var currentPosition;
    var shareLocation = false;

    return {
      getZoomLevel: () => { return zoomLevel },
      getPumpId: () =>  { return pumpId },
      getPumpMap: () => { return pumpMap },
      getLastSelectedDistrict: () => { return lastSelectedDistrict },
      getLastSelectedAddress: () => { return lastSelectedAddress },
      getLastSelectedPumpType: () => { return lastSelectedPumpType },
      getLastSelectedPumpPhysicalState: () => { return lastSelectedPumpPhysicalState },
      getLastSelectedPumpDetailedPhysicalState: () => { return lastSelectedPumpDetailedPhysicalState },
      getLastSelectedPumpOperatingState: () => { return lastSelectedPumpOperatingState },
      getLastSelectedControlledFrom: () => { return lastSelectedControlledFrom },
      getLastSelectedControlledTo: () => { return lastSelectedControlledTo },
      getOldLayer: () => { return oldLayer },
      getLastCoordinates: () => { return lastCoordinates },
      getLastPumpLayer: () => { return lastPumpLayer },
      getLastClusterLayer: () => { return lastClusterLayer },
      getLastDistrictLayer: () => { return lastDistrictLayer },
      getSelectedPump: () => { return selectedPump },
      getLastHoveredCoords: () => { return lastHoveredCoords },
      getInfo: () => { return info },
      getPictures: () => { return pictures },
      getAddresss: ()  => { return addresss.sort() },
      getPumpTypes: ()  => { return pumpTypes.sort() },
      getPumpPhysicalStates: ()  => { return pumpPhysicalStates.sort() },
      getPumpDetailedPhysicalStates: ()  => { return pumpDetailedPhysicalStates.sort() },
      getPumpOperatingStates: ()  => { return pumpOperatingStates.sort() },
      getControlledFroms: ()  => { return controlledFroms.sort() },
      getControlledTos: ()  => { return controlledTos.sort() },
      getAddressExplicitySet: () => { return addressExplicitySet },
      getPumpTypeExplicitySet: () => { return pumpTypeExplicitySet },
      getPumpPhysicalStateExplicitySet: () => { return pumpPhysicalStateExplicitySet },
      getPumpDetailedPhysicalStateExplicitySet: () => { return pumpDetailedPhysicalStateExplicitySet },
      getPumpOperatingStateExplicitySet: () => { return pumpOperatingStateExplicitySet },
      getControlledFromExplicitySet: () => { return controlledFromExplicitySet },
      getControlledToExplicitySet: () => { return controlledToExplicitySet },
      getMatchCount: () => { return matchCount },
      hasPumpLocs: () => pumpLocs.size > 0,
      getNearestPumpLoc: (userLoc) => [...pumpLocs].map(([, value]) => value).reduce((currMin, pumpLoc) => {
          const dist = Math.hypot(userLoc.lng - pumpLoc.x, userLoc.lat - pumpLoc.y)
          return (currMin.dist > dist) ? { dist, ...pumpLoc } : currMin;
        }, { dist: Number.MAX_VALUE }),
      getCurrentPosition: () => { return currentPosition; },
      isShareLocation: () => { return shareLocation; },
      getPumpColor: (pumpId) => pumpColors.get(pumpId) || 'lightgreen',

      setPumpId: (newPumpId) => { pumpId = newPumpId },
      setPumpMap: (newPumpMap) => { pumpMap = newPumpMap },
      setLastSelectedDistrict: (newLastSelectedDistrict) => { lastSelectedDistrict = newLastSelectedDistrict },
      setLastSelectedAddress: (newLastSelectedAddress) => { lastSelectedAddress = newLastSelectedAddress },
      setLastSelectedPumpType: (newLastSelectedPumpType) => { lastSelectedPumpType = newLastSelectedPumpType },
      setLastSelectedPumpPhysicalState: (newLastSelectedPumpPhysicalState) => { lastSelectedPumpPhysicalState = newLastSelectedPumpPhysicalState },
      setLastSelectedPumpDetailedPhysicalState: (newLastSelectedPumpDetailedPhysicalState) => { lastSelectedPumpDetailedPhysicalState = newLastSelectedPumpDetailedPhysicalState },
      setLastSelectedPumpOperatingState: (newLastSelectedPumpOperatingState) => { lastSelectedPumpOperatingState = newLastSelectedPumpOperatingState },
      setLastSelectedControlledFrom: (newLastSelectedControlledFrom) => { lastSelectedControlledFrom = newLastSelectedControlledFrom },
      setLastSelectedControlledTo: (newLastSelectedControlledTo) => { lastSelectedControlledTo = newLastSelectedControlledTo },
      setOldLayer: (newOldLayer) => { oldLayer = newOldLayer },
      setLastCoordinates: (newLastCoordinates) => { lastCoordinates = newLastCoordinates },
      setLastPumpLayer: (newLastPumpLayer) => { lastPumpLayer = newLastPumpLayer },
      setLastClusterLayer: (newLastClusterLayer) => { lastClusterLayer = newLastClusterLayer },
      setLastDistrictLayer: (newLastDistrictLayer) => { lastDistrictLayer = newLastDistrictLayer },
      setSelectedPump: (newSelectedPump) => { selectedPump = newSelectedPump },
      setLastHoveredCoords: (newLastHoveredCoords) => { lastHoveredCoords = newLastHoveredCoords },
      setInfo: (newInfo) => { info = newInfo },
      setPictures: (newPictures) => { pictures = newPictures },
      addAddress: (address) => { if (addresss.indexOf(address) < 0) addresss.push(address) },
      resetAddresss: () => { addresss = [ " " ] },
      addPumpType: (pumpType) => { if (pumpTypes.indexOf(pumpType) < 0) pumpTypes.push(pumpType) },
      resetPumpTypes: () => { pumpTypes = [ " " ] },
      addPumpPhysicalState: (pumpPhysicalState) => { if (pumpPhysicalStates.indexOf(pumpPhysicalState) < 0) pumpPhysicalStates.push(pumpPhysicalState) },
      resetPumpPhysicalStates: () => { pumpOperatingStates = [ " " ] },
      addPumpDetailedPhysicalState: (pumpDetailedPhysicalState) => { if (pumpDetailedPhysicalStates.indexOf(pumpDetailedPhysicalState) < 0) pumpDetailedPhysicalStates.push(pumpDetailedPhysicalState) },
      resetPumpDetailedPhysicalStates: () => { pumpDetailedPhysicalStates = [ " " ] },
      addPumpOperatingState: (pumpOperatingState) => { if (pumpOperatingStates.indexOf(pumpOperatingState) < 0) pumpOperatingStates.push(pumpOperatingState) },
      resetPumpOperatingStates: () => { pumpOperatingStates = [ " " ] },
      addControlledFrom : (controlledFrom) => { if (controlledFroms.indexOf(controlledFrom) < 0) controlledFroms.push(controlledFrom) },
      resetControlledFroms: () => { controlledFroms = [ " " ] },
      addControlledTo: (controlledTo) => { if (controlledTos.indexOf(controlledTo) < 0) controlledTos.push(controlledTo) },
      resetControlledTos: () => { controlledTos = [ " " ] },
      setAddressExplicitySet: (newAddressExplicitySet) => { addressExplicitySet = newAddressExplicitySet },
      setPumpTypeExplicitySet: (newPumpTypeExplicitySet) => { pumpTypeExplicitySet = newPumpTypeExplicitySet },
      setPumpPhysicalStateExplicitySet: (newPumpPhysicalStateExplicitySet) => { pumpPhysicalStateExplicitySet = newPumpPhysicalStateExplicitySet },
      setPumpDetailedPhysicalStateExplicitySet: (newPumpDetailedPhysicalStateExplicitySet) => { pumpDetailedPhysicalStateExplicitySet = newPumpDetailedPhysicalStateExplicitySet },
      setPumpOperatingStateExplicitySet: (newPumpOperatingStateExplicitySet) => { pumpOperatingStateExplicitySet = newPumpOperatingStateExplicitySet },
      setControlledFromExplicitySet: (newControlledFromExplicitySet) => { controlledFromExplicitySet = newControlledFromExplicitySet },
      setControlledToExplicitySet: (newControlledToExplicitySet) => { controlledToExplicitySet = newControlledToExplicitySet },
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
      setShareLocation: (newShareLocation) => { shareLocation = newShareLocation; },
      setPumpColor: (pumpColor) => { pumpColors.set(pumpColor.id, pumpColor.color) }
    }
  }
});


