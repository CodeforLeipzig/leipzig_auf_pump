package de.l.oklab.pumps

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.MappingIterator
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.csv.CsvMapper
import com.fasterxml.jackson.dataformat.csv.CsvSchema
import java.io.File

data class Pump(

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
    val state: String? = null,

    @JsonProperty("Fütterung")
    val feeding: String? = null,

    @JsonProperty("Kontrollen")
    val controls: String? = null,
)


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
        addColumn("state", CsvSchema.ColumnType.STRING)
        addColumn("feeding", CsvSchema.ColumnType.STRING)
        addColumn("controls", CsvSchema.ColumnType.STRING)
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

fun feature(pump: Pump): String {
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
                ${stringValueLine("state", pump.state)},
                ${stringValueLine("feeding", pump.feeding)},
                ${stringValueLine("controls", pump.controls)}
            },
            "geometry": {
                "type": "Point",
                "coordinates": [${toCoord(pump.lon)}, ${toCoord(pump.lat)}]
            },
            "id": "${pump.numberAnke}"    
           
        }
    """.trimIndent()
}

fun stringValueLine(name: String, value: String?): String = "\"$name\": ${if (value.isNullOrEmpty()) "null" else "\"$value\""}"

fun toCoord(value: String?): Float? = if (value.isNullOrEmpty()) null else (value.substring(0, 2) + "." + value.substring(2)).toFloat()

