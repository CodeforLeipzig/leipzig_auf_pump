package de.l.oklab.pumps.utils

import com.fasterxml.jackson.databind.ObjectMapper
import de.l.oklab.pumps.data.GeojsonFeature
import de.l.oklab.pumps.data.GeojsonFeatureCollection
import de.l.oklab.pumps.outputPath
import java.io.File
import java.util.*

object GeojsonUtils {

    fun readGeojsonFile(fileName: String) : GeojsonFeatureCollection =
        ObjectMapper().readValue(File(fileName), GeojsonFeatureCollection::class.java)

    fun storeGeojsonFile(fileName: String, features: List<GeojsonFeature>) {
        val objectMapper = ObjectMapper()
        val root = GeojsonFeatureCollection(features = features)
        val normalizedFileName = normalizeName(fileName)
        val file = File("""$outputPath/$normalizedFileName.geojson""")
        objectMapper.writeValue(file, root)
        println(""""${file.absolutePath} written""")
    }

    private fun normalizeName(name: String): String = name.lowercase(Locale.getDefault())
        .replace("ä", "ae")
        .replace("ö", "oe")
        .replace("ü", "ue")
        .replace("ß", "ss")

    fun toCoord(value: String?): Float? =
        if (value.isNullOrEmpty()) null else (value.substring(0, 2) + "." + value.substring(2)).toFloat()
}