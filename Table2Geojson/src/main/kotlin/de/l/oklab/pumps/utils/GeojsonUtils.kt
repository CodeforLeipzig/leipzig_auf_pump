package de.l.oklab.pumps.utils

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import de.l.oklab.pumps.data.GeojsonFeature
import de.l.oklab.pumps.data.GeojsonFeatureCollection
import de.l.oklab.pumps.outputPath
import java.io.File
import java.util.*

object GeojsonUtils {
    private val objectMapper = jacksonObjectMapper()

    fun <T> readJsonListFile(fileName: String, clazz: Class<T>): List<T> = objectMapper.readValue(
        javaClass.classLoader.getResourceAsStream(fileName), objectMapper.typeFactory.constructCollectionType(
            List::class.java, clazz
        )
    )

    fun <T> readGeojsonFile(fileName: String, clazz: Class<T>): GeojsonFeatureCollection<T> = objectMapper.readValue(
        javaClass.classLoader.getResourceAsStream(fileName), objectMapper.typeFactory.constructParametricType(
            GeojsonFeatureCollection::class.java, clazz
        )
    )

    fun readGenericGeojsonFile(fileName: String): GeojsonFeatureCollection<Map<String, Any?>> = objectMapper.readValue(
        File(fileName), objectMapper.typeFactory.constructParametricType(
            GeojsonFeatureCollection::class.java,
            objectMapper.typeFactory.constructMapType(Map::class.java, String::class.java, Any::class.java)
        )
    )

    fun <T> storeGeojsonFile(fileName: String, features: List<GeojsonFeature<T>>) {
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
        if (value.isNullOrEmpty()) null else if (value.indexOf(".") > 0) value.toFloat() else
                (value.substring(0, 2) + "." + value.substring(2)).toFloat()
}