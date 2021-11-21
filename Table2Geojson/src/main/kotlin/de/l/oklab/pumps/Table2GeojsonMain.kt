package de.l.oklab.pumps

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.MappingIterator
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.csv.CsvMapper
import com.fasterxml.jackson.dataformat.csv.CsvSchema
import java.io.File
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.format.FormatStyle

open class Pump(

    @JsonProperty("Nummer [Anke]")
    val numberAnke: String? = null,

    @JsonProperty("offizielle Nummer")
    val numberOfficial: String? = null,

    @JsonProperty("Bezeichnung")
    val name: String? = null,

    @JsonProperty("Stadtteil")
    val district: String? = null,

    @JsonProperty("Adresse")
    val address: String? = null,

    @JsonProperty("Koordinaten NS")
    val lat: String? = null,

    @JsonProperty("Koordinaten OW")
    val lon: String? = null,

    @JsonProperty("Datierung")
    val date: String? = null,

    @JsonProperty("Beschreibung")
    val description: String? = null,

    @JsonProperty("Status")
    val stateDescription: String? = null,

    @JsonProperty("Fütterung")
    val feedingDescription: String? = null,

    @JsonProperty("Kontrollen")
    val controlsDescription: String? = null,
)

class PumpToSerialize(
    pump: Pump,
    var type: Type? = null,
    var state: State? = null,
    var controls: List<Check> = mutableListOf(),
    var feedings: List<Check> = mutableListOf()
): Pump(
    numberAnke = pump.numberAnke,
    numberOfficial = pump.numberOfficial,
    name = pump.name,
    district = pump.district,
    address = pump.address,
    lat = pump.lat,
    lon = pump.lon,
    date = pump.date,
    description = pump.description,
    stateDescription = pump.stateDescription,
    feedingDescription = pump.feedingDescription,
    controlsDescription = pump.controlsDescription,
)

enum class Type(val translated: String) {
    gotique("Gotik"),
    bigLion("Großer Löwe"),
    smallLion("Kleiner Löwe"),
    dolphin("Delphin"),
    birdCage("Vogelkäfig"),
    unknown("unbekannt")
}

data class State (
    val physicalState: PhysicalState,
    var detailedPhysicalState: DetailedPhysicalState,
    val operatingState: OperatingState?
)

enum class PhysicalState (val translated: String) {
    existing("vorhanden"), nonExisting("nicht vorhanden"),
    unknown("unbekannt")
}

enum class DetailedPhysicalState(val translated: String) {
    removed("abgebaut"), stub("Torso"),
    reconstructed("rekonstruiert"), notFound("nicht gefunden"),
    notSpecified("nicht weiter spezifiert")
}

enum class OperatingState(val translated: String) {
    outOfOrder("außer Betrieb"), inOrder("betriebsbereit"),
    unknown("unbekannt")
}

data class Check(
    val date: LocalDateTime,
    val result: CheckState
)

enum class CheckState (val translated: String) {
   successful("erfolgreich"), failed("erfolglos")
}

fun main() {
    val csvSchema = CsvSchema.builder().apply {
        addColumn("numberAnke", CsvSchema.ColumnType.STRING)
        addColumn("numberOfficial", CsvSchema.ColumnType.STRING)
        addColumn("name", CsvSchema.ColumnType.STRING)
        addColumn("district", CsvSchema.ColumnType.STRING)
        addColumn("address", CsvSchema.ColumnType.STRING)
        addColumn("lat", CsvSchema.ColumnType.NUMBER)
        addColumn("lon", CsvSchema.ColumnType.NUMBER)
        addColumn("date", CsvSchema.ColumnType.STRING)
        addColumn("description", CsvSchema.ColumnType.STRING)
        addColumn("stateDescription", CsvSchema.ColumnType.STRING)
        addColumn("feedingDescription", CsvSchema.ColumnType.STRING)
        addColumn("controlsDescription", CsvSchema.ColumnType.STRING)
        setColumnSeparator(',')
        setQuoteChar('"')
        setSkipFirstDataRow(true)
    }.build()

    val csvMapper = CsvMapper()
    val pumpLines: MappingIterator<Pump> = csvMapper.readerFor(Pump::class.java)
        .with(csvSchema)
        .readValues(File("D:\\git\\leipzig_auf_pump\\Table2Geojson\\src\\main\\resources\\pumpen.csv"))
    val features = mutableListOf<String>()
    pumpLines.forEach {
        try {
            features.add(feature(it))
        } catch(e: Exception) {
            println(e.message)
        }
    }
    val content = featureCollection(features)
    val objectMapper = ObjectMapper()
    val root = objectMapper.readTree(content)
    val normalizedDistrictName = normalizeName("alle")
    val file = File("""$outputPath/$normalizedDistrictName.geojson""")
    objectMapper.writeValue(file, root)
}

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

fun getFeedings(pump: Pump): List<Check> {
    return if (pump.feedingDescription != null) {
        val segments = pump.feedingDescription.split(",").map { it.trim() }
        getChecks(segments)
    } else {
        mutableListOf()
    }
}

fun getControls(pump: Pump): List<Check> {
    return if (pump.controlsDescription != null) {
        val segments = pump.controlsDescription.split(",").map { it.trim() }
        getChecks(segments)
    } else {
        mutableListOf()
    }
}

private fun getChecks(segments: List<String>): MutableList<Check> {
    val checks = mutableListOf<Check>()
    for (segment in segments) {
        val dateSegments = segment.split(".")
        if (dateSegments.size == 3) {
            val index = dateSegments[2].indexOf(" (")
            val checkState = if (index > 0) {
                if (dateSegments[2].indexOf("erfolglos") >= 0) {
                    CheckState.failed
                } else {
                    CheckState.successful
                }
            } else {
                CheckState.successful
            }
            var yearSegment = if (index > 0) {
                dateSegments[2].substring(0, index)
            } else dateSegments[2]
            if (yearSegment.length == 2) {
                yearSegment = "20$yearSegment"
            }
            val date = LocalDateTime.of(yearSegment.toInt(), dateSegments[1].toInt(), dateSegments[0].toInt(), 0, 0)
            checks.add(Check(date, checkState))
        }
    }
    return checks
}

fun getState(pump: PumpToSerialize): State {
    val detailedPhysicalState = getDetailedPhysicalState(pump)
    val physicalState = getPhysicalState(detailedPhysicalState, pump)
    val operatingState = getOperatingState(physicalState, pump)
    val state = State(
        physicalState = physicalState,
        detailedPhysicalState = detailedPhysicalState,
        operatingState = operatingState
    )
    return state
}

fun getOperatingState(physicalState: PhysicalState, pump: Pump): OperatingState {
    if (physicalState == PhysicalState.nonExisting) return OperatingState.outOfOrder
    return if (pump.stateDescription != null) {
        if (pump.stateDescription.indexOf("nicht " + OperatingState.inOrder.translated) >= 0) {
            OperatingState.outOfOrder
        } else if (pump.stateDescription.indexOf(OperatingState.inOrder.translated) >= 0) {
            OperatingState.inOrder
        } else if (pump.stateDescription.indexOf(OperatingState.outOfOrder.translated) >= 0) {
            OperatingState.outOfOrder
        } else {
            OperatingState.unknown
        }
    } else {
        OperatingState.unknown
    }
}

private fun getPhysicalState(
    detailedPhysicalState: DetailedPhysicalState,
    pump: PumpToSerialize
): PhysicalState = when (detailedPhysicalState) {
    DetailedPhysicalState.notFound -> PhysicalState.nonExisting
    DetailedPhysicalState.reconstructed -> PhysicalState.existing
    DetailedPhysicalState.removed -> PhysicalState.nonExisting
    DetailedPhysicalState.stub -> PhysicalState.nonExisting
    DetailedPhysicalState.notSpecified -> {
        if (pump.stateDescription != null) {
            val detailed = DetailedPhysicalState.values().find {
                pump.stateDescription.indexOf(it.translated) >= 0
            } ?: DetailedPhysicalState.notSpecified
            if (detailed != DetailedPhysicalState.notSpecified) {
                pump.state?.detailedPhysicalState = detailed
                getPhysicalState(detailed, pump)
            } else {
                PhysicalState.unknown
            }
        } else {
            PhysicalState.unknown
        }
    }
    else -> PhysicalState.unknown
}

private fun getDetailedPhysicalState(
    pump: Pump
) = if (pump.name != null) {
    DetailedPhysicalState.values().find {
        pump.name.indexOf("[${it.translated}]") >= 0
    } ?: DetailedPhysicalState.notSpecified
} else {
    DetailedPhysicalState.notSpecified
}

fun getType(pump: Pump): Type {
    if (pump.description != null) {
        for (type in Type.values()) {
            if (pump.description.indexOf("Typ ${type.translated}") >= 0) {
                return type;
            }
        }
    }
    return Type.unknown
}

fun stringValueLine(name: String, value: String?): String = "\"$name\": ${if (value.isNullOrEmpty()) "null" else "\"$value\""}"

fun toCoord(value: String?): Float? = if (value.isNullOrEmpty()) null else (value.substring(0, 2) + "." + value.substring(2)).toFloat()

