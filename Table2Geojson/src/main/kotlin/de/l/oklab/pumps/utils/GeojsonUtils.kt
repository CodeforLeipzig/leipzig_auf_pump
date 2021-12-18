package de.l.oklab.pumps.utils

import com.fasterxml.jackson.databind.ObjectMapper
import de.l.oklab.pumps.outputPath
import java.io.File
import java.util.*

object GeojsonUtils {

    fun storeGeojsonFile(fileName: String, features: List<String>) {
        val objectMapper = ObjectMapper()
        val root = objectMapper.readTree(featureCollection(features))
        val normalizedFileName = normalizeName(fileName)
        val file = File("""$outputPath/$normalizedFileName.geojson""")
        objectMapper.writeValue(file, root)
        println(""""${file.absolutePath} written""")
    }

    fun featureCollection(features: List<String>): String {
        return """{
          "type": "FeatureCollection",
          "features": [
             ${features.joinToString(",")}
          ]
        }"""
    }

    private fun normalizeName(name: String): String = name.lowercase(Locale.getDefault())
        .replace("ä", "ae")
        .replace("ö", "oe")
        .replace("ü", "ue")
        .replace("ß", "ss")

    fun stringValueLine(name: String, value: String?): String =
        "\"$name\": ${if (value.isNullOrEmpty()) "null" else "\"$value\""}"

    fun toCoord(value: String?): Float? =
        if (value.isNullOrEmpty()) null else (value.substring(0, 2) + "." + value.substring(2)).toFloat()
}