const districtDict = {
  "alle": "Alle",
  "althen-kleinpoesna": "Althen-Kleinpösna",
  "altlindenau": "Altlindenau",
  "anger-crottendorf": "Anger-Crottendorf",
  "baalsdorf": "Baalsdorf",
  "burghausen-rueckmarsdorf": "Burghausen-Rückmarsdorf",
  "boehlitz-ehrenberg": "Böhlitz-Ehrenberg",
  "connewitz": "Connewitz",
  "doelitz-doesen": "Dölitz-Dösen",
  "engelsdorf": "Engelsdorf",
  "eutritzsch": "Eutritzsch",
  "gohlis-mitte": "Gohlis-Mitte",
  "gohlis-nord": "Gohlis-Nord",
  "gohlis-sued": "Gohlis-Süd",
  "grosszschocher": "Großzschocher",
  "gruenau-mitte": "Grünau-Mitte",
  "gruenau-nord": "Grünau-Nord",
  "gruenau-ost": "Grünau-Ost",
  "gruenau-siedlung": "Grünau-Siedlung",
  "hartmannsdorf-knautnaundorf": "Hartmannsdorf-Knautnaundorf",
  "heiterblick": "Heiterblick",
  "holzhausen": "Holzhausen",
  "kleinzschocher": "Kleinzschocher",
  "knautkleeberg-knauthain": "Knautkleeberg-Knauthain",
  "lausen-gruenau": "Lausen-Grünau",
  "leutzsch": "Leutzsch",
  "liebertwolkwitz": "Liebertwolkwitz",
  "lindenau": "Lindenau",
  "lindenthal": "Lindenthal",
  "loessnig": "Lößnig",
  "luetzschena-stahmeln": "Lützschena-Stahmeln",
  "marienbrunn": "Marienbrunn",
  "meusdorf": "Meusdorf",
  "miltitz": "Miltitz",
  "mockau-nord": "Mockau-Nord",
  "mockau-sued": "Mockau-Süd",
  "moeckern": "Möckern",
  "moelkau": "Mölkau",
  "neulindenau": "Neulindenau",
  "neustadt-neuschoenefeld": "Neustadt-Neuschönefeld",
  "paunsdorf": "Paunsdorf",
  "plagwitz": "Plagwitz",
  "plaussig-portitz": "Plaußig-Portitz",
  "probstheida": "Probstheida",
  "reudnitz-thonberg": "Reudnitz-Thonberg",
  "schleussig": "Schleußig",
  "schoenau": "Schönau",
  "schoenefeld-abtnaundorf": "Schönefeld-Abtnaundorf",
  "schoenefeld-ost": "Schönefeld-Ost",
  "seehausen": "Seehausen",
  "sellerhausen-stuenz": "Sellerhausen-Stünz",
  "stoetteritz": "Stötteritz",
  "suedvorstadt": "Südvorstadt",
  "thekla": "Thekla",
  "volkmarsdorf": "Volkmarsdorf",
  "wahren": "Wahren",
  "wiederitzsch": "Wiederitzsch",
  "zentrum": "Zentrum",
  "zentrum-nord": "Zentrum-Nord",
  "zentrum-nordwest": "Zentrum-Nordwest",
  "zentrum-ost": "Zentrum-Ost",
  "zentrum-sued": "Zentrum-Süd",
  "zentrum-suedost": "Zentrum-Südost",
  "zentrum-west": "Zentrum-West"
};
const districts = Object.keys(districtDict);

define(["jquery"], ($) => ({
  allDistricts: districts,
  resolveDistrictKeyByName: name => districts.find(district => districtDict[district] == name),
  districtSelectionBox: (state) => {
    var htmlCode = '<select id="districtSelection">';
    for (var index in districts) {
      var district = districts[index];
      if (district) {
        htmlCode += '<option id="' + district + '">' + districtDict[district] + '</option>';
      }
    }
    htmlCode += '</select>';
    return htmlCode;
  },

  selectedDistrict: () => {
    var selectionBox = document.getElementById("districtSelection");
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
  setDistrictInSelectionBox: (state) => {
    var selectionBox = document.getElementById('districtSelection');
    if (selectionBox) {
      for (var option, index = 0; option = selectionBox.options[index]; index++) {
        if (option.attributes["id"].value == state.getLastSelectedDistrict()) {
          selectionBox.selectedIndex = index;
          break;
        }
      }
    }
  },
  handleDistrictChange: (document, data, state) => {
    var selectionBox = document.getElementById("districtSelection");
    if (selectionBox && selectionBox.selectedIndex != -1) {
      var selectedDistrict = selectionBox.options[selectionBox.selectedIndex].attributes["id"].value;
      state.setLastSelectedDistrict(selectedDistrict);
      if (selectedDistrict != "") {
        if (!state.isShareLocation()) {
          state.setCurrentPosition(undefined);
        } else {
          state.setShareLocation(false)
        }
        state.setLastCoordinates(undefined);
        state.setSelectedPump(undefined);
        state.setOldLayer(undefined);
        state.getLastPumpLayer().clearLayers()
        state.getPumpMap().removeLayer(state.getLastClusterLayer());
        state.getPumpMap().removeLayer(state.getLastDistrictLayer());
        state.resetAddresss();
        state.resetPumpTypes();
        state.resetPumpOperatingStates();
        state.resetYearFroms();
        state.resetYearTos();
        state.setAddressExplicitySet(false);
        state.setPumpTypeExplicitySet(false);
        state.setPumpOperatingStateExplicitySet(false);
        state.setYearFromExplicitySet(false);
        state.setYearToExplicitySet(false);
        state.setLastSelectedAddress(0);
        state.setLastSelectedPumpType(0);
        state.setLastSelectedPumpOperatingState(0);
        state.setLastSelectedYearFrom(0);
        state.setLastSelectedYearTo(0);
        data.loadData(state, selectedDistrict);
        $('#addressSelection option:eq(0)').prop('selected', true);
        $('#pumpTypeSelection option:eq(0)').prop('selected', true);
        $('#pumpOperatingStateSelection option:eq(0)').prop('selected', true);
        $('#yearFromSelection option:eq(0)').prop('selected', true);
        $('#yearToSelection option:eq(0)').prop('selected', true);
      }
    }
  }
}));