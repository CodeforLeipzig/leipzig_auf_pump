package de.l.oklab.pumps

import de.l.oklab.pumps.data.GeojsonFeature
import de.l.oklab.pumps.data.PumpToSerialize
import de.l.oklab.pumps.utils.CsvUtils.getPumpLines
import de.l.oklab.pumps.utils.GeojsonUtils.storeGeojsonFile
import de.l.oklab.pumps.utils.OsmUtils.readOsmPumps
import de.l.oklab.pumps.utils.PumpGeoJsonUtils.feature
import de.l.oklab.pumps.utils.WikipediaUtils.readWikipediaPumps

fun main() {
    val features = mutableListOf<GeojsonFeature<PumpToSerialize>>()
    val csvPumps = getPumpLines()
    val wikipediaPumps = readWikipediaPumps()
    val osmPumps = readOsmPumps()
    csvPumps.forEach { csvPump ->
        val wikipediaPump = wikipediaPumps.find { it.id?.contentEquals(csvPump.wikipediaId) ?: false }
        val osmPump = osmPumps.find { (it.properties.id?.contentEquals(csvPump.osmId) ?: false)
                || (wikipediaPump != null && it.properties.sequentialId?.contentEquals(wikipediaPump.id) ?: false) }
        try {
            features.add(feature(csvPump, wikipediaPump, osmPump))
        } catch (e: Exception) {
            println(e.message)
        }
    }
    storeGeojsonFile("alle", features)
}
