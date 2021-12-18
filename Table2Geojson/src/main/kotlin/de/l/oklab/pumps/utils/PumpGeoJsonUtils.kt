package de.l.oklab.pumps.utils

import de.l.oklab.pumps.data.*
import de.l.oklab.pumps.utils.PumpCheckUtils.getControls
import de.l.oklab.pumps.utils.PumpCheckUtils.getFeedings
import de.l.oklab.pumps.utils.PumpStateUtils.getState

object PumpGeoJsonUtils {

    fun feature(jsonPump: CsvPump): GeojsonFeature {
        val pump = PumpToSerialize(
            pump = jsonPump,
            state = State(PhysicalState.unknown, DetailedPhysicalState.notSpecified, OperatingState.unknown),
            type = getType(jsonPump),
            controls = getControls(jsonPump),
            feedings = getFeedings(jsonPump),
        )
        pump.state = getState(pump)
        return GeojsonFeature(
            id = pump.numberAnke,
            properties = pump.toMap(),
            geometry = Geometry.from(pump.lat, pump.lon)
        )
    }

    private fun getType(pump: CsvPump): Type {
        if (pump.description != null) {
            for (type in Type.values()) {
                if (pump.description.indexOf("Typ ${type.translated}") >= 0) {
                    return type;
                }
            }
        }
        return Type.unknown
    }
}