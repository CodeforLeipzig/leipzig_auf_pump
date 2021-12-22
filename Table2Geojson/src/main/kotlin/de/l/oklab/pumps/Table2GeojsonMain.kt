package de.l.oklab.pumps

import de.l.oklab.pumps.data.GeojsonFeature
import de.l.oklab.pumps.data.OsmPump
import de.l.oklab.pumps.data.PumpToSerialize
import de.l.oklab.pumps.utils.CsvUtils.getPumpLines
import de.l.oklab.pumps.utils.GeojsonUtils.storeGeojsonFile
import de.l.oklab.pumps.utils.OsmUtils.readOsmPumps
import de.l.oklab.pumps.utils.PumpGeoJsonUtils.feature
import de.l.oklab.pumps.utils.WikipediaUtils.readWikipediaPumps

fun main() {
    val features = mutableListOf<GeojsonFeature<PumpToSerialize>>()
    val basicOsmFeatures = mutableListOf<GeojsonFeature<OsmPump>>()
    val csvPumps = getPumpLines()
    val wikipediaPumps = readWikipediaPumps()
    val osmPumps = readOsmPumps()
    csvPumps.forEach { csvPump ->
        val wikipediaPump = wikipediaPumps.find { it.id?.contentEquals(csvPump.wikipediaId) ?: false }
        val osmPump = osmPumps.find { (wikipediaPump != null && it.properties.sequentialId?.contentEquals(wikipediaPump.id) ?: false)
                || (it.properties.id?.contentEquals(csvPump.osmId) ?: false)}
        try {
            features.add(feature(csvPump, wikipediaPump, osmPump))
        } catch (e: Exception) {
            println(e.message)
        }
    }
    osmPumps.forEach { osmPump ->
        val alreadyExisting = features.find { feature -> feature.geometry?.coordinates.toString() == osmPump.geometry?.coordinates.toString() }
        if (alreadyExisting == null) {
            basicOsmFeatures.add(osmPump)
        }
    }
    storeGeojsonFile("alle", features)
    storeGeojsonFile("osmpumps", basicOsmFeatures)
}
