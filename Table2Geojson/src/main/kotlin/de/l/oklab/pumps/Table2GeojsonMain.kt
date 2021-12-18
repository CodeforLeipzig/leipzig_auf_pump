package de.l.oklab.pumps

import de.l.oklab.pumps.data.GeojsonFeature
import de.l.oklab.pumps.utils.CsvUtils.getPumpLines
import de.l.oklab.pumps.utils.GeojsonUtils.storeGeojsonFile
import de.l.oklab.pumps.utils.PumpGeoJsonUtils.feature

fun main() {
    val features = mutableListOf<GeojsonFeature>()
    val pumpLines = getPumpLines()
    pumpLines.forEach {
        try {
            features.add(feature(it))
        } catch (e: Exception) {
            println(e.message)
        }
    }
    storeGeojsonFile("alle", features)
}
