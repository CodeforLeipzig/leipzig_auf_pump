package de.l.oklab.pumps.utils

import de.l.oklab.pumps.data.GeojsonFeature
import de.l.oklab.pumps.data.OsmPump
import de.l.oklab.pumps.utils.GeojsonUtils.readGeojsonFile

object OsmUtils {

    fun readOsmPumps(): List<GeojsonFeature<OsmPump>> = readGeojsonFile("pumpen_osm.geojson", OsmPump::class.java).features
}