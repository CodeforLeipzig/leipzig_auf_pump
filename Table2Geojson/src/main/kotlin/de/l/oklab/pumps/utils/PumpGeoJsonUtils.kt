package de.l.oklab.pumps.utils

import de.l.oklab.pumps.data.*
import de.l.oklab.pumps.utils.GeojsonUtils.toCoord
import de.l.oklab.pumps.utils.PumpCheckUtils.getControls
import de.l.oklab.pumps.utils.PumpCheckUtils.getFeedings
import de.l.oklab.pumps.utils.PumpStateUtils.getState

object PumpGeoJsonUtils {

    fun feature(
        jsonPump: CsvPump,
        wikipediaPump: WikipediaPump? = null,
        osmPump: GeojsonFeature<OsmPump>? = null
    ): GeojsonFeature<PumpToSerialize> {
        val pump = PumpToSerialize.from(
            pump = jsonPump,
            wikipediaPump = wikipediaPump,
            osmPump = osmPump?.properties,
            state = getState(jsonPump),
            type = getType(jsonPump),
            controls = getControls(jsonPump),
            feedings = getFeedings(jsonPump),
        )
        val osmCoords = osmPump?.geometry?.coordinates?.let { if (it.size == 2) it else null  }
        val lon = osmCoords?.let { it[0].toString() } ?: wikipediaPump?.lon ?: jsonPump.lon
        val lat = osmCoords?.let { it[1].toString() } ?: wikipediaPump?.lat ?: jsonPump.lat
        return GeojsonFeature(
            id = pump.numberAnke,
            properties = pump,
            geometry = Geometry.from(lon, lat)
        )
    }

    private fun getType(pump: CsvPump): Type {
        if (pump.description != null) {
            for (type in Type.values()) {
                if (pump.description.indexOf("Typ ${type.translated}") >= 0) {
                    return type
                }
            }
        }
        return Type.unknown
    }
}