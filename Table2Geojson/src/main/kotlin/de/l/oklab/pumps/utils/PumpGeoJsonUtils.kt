package de.l.oklab.pumps.utils

import de.l.oklab.pumps.data.*
import de.l.oklab.pumps.utils.GeojsonUtils.stringValueLine
import de.l.oklab.pumps.utils.GeojsonUtils.toCoord
import de.l.oklab.pumps.utils.PumpCheckUtils.getControls
import de.l.oklab.pumps.utils.PumpCheckUtils.getFeedings
import de.l.oklab.pumps.utils.PumpStateUtils.getState
import java.time.format.DateTimeFormatter

object PumpGeoJsonUtils {

    fun feature(jsonPump: Pump): String {
        val pump = PumpToSerialize(
            pump = jsonPump,
            state = State(PhysicalState.unknown, DetailedPhysicalState.notSpecified, OperatingState.unknown),
            type = getType(jsonPump),
            controls = getControls(jsonPump),
            feedings = getFeedings(jsonPump),
        )
        pump.state = getState(pump)
        val dateTimeFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")
        return """
        {
            "type": "Feature",
            "properties": {
                ${stringValueLine("numberAnke", pump.numberAnke)},
                ${stringValueLine("numberOfficial", pump.numberOfficial)},
                ${stringValueLine("name", pump.name)},
                ${stringValueLine("district", pump.district)},
                ${stringValueLine("address", pump.address)},
                ${stringValueLine("date", pump.date)},
                ${stringValueLine("description", pump.description)},
                ${stringValueLine("type", pump.type?.translated)}                ,
                ${stringValueLine("stateDescription", pump.stateDescription)},
                ${stringValueLine("physicalState", pump.state?.physicalState?.translated)},
                ${stringValueLine("detailedPhysicalState", pump.state?.detailedPhysicalState?.translated)},
                ${stringValueLine("operatingState", pump.state?.operatingState?.translated)},
                ${stringValueLine("feedingDescription", pump.feedingDescription)},
                ${stringValueLine("lastFeeding", pump.feedings.maxOfOrNull { it.date }?.format(dateTimeFormatter))},
                ${stringValueLine("controlsDescription", pump.controlsDescription)},
                ${stringValueLine("lastControl", pump.controls.maxOfOrNull { it.date }?.format(dateTimeFormatter))}
            },
            "geometry": {
                "type": "Point",
                "coordinates": [${toCoord(pump.lon)}, ${toCoord(pump.lat)}]
            },
            "id": "${pump.numberAnke}"    
           
        }
    """.trimIndent()
    }

    private fun getType(pump: Pump): Type {
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