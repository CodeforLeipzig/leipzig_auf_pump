package de.l.oklab.pumps

import de.l.oklab.pumps.data.GeojsonFeature
import de.l.oklab.pumps.utils.DistrictUtils.filterByDistrictName
import de.l.oklab.pumps.utils.DistrictUtils.getDistrictNames
import de.l.oklab.pumps.utils.GeojsonUtils.readGenericGeojsonFile
import de.l.oklab.pumps.utils.GeojsonUtils.readGeojsonFile
import de.l.oklab.pumps.utils.GeojsonUtils.storeGeojsonFile

val outputPath = "${System.getProperty("user.dir")}/../docs/geojsons/pumps"

sealed class Config(
    val path: String,
    val idProp: String
)

data class PumpConfig(val id: String = "pump") : Config(path = "${System.getProperty("user.dir")}/../docs/geojsons/pumps/alle.geojson", idProp = "district")
data class DistrictConfig(val id: String = "district") :
    Config(path = "${System.getProperty("user.dir")}/../docs/ortsteile.json", idProp = id)

fun main() {
    execute(PumpConfig())
}

fun execute(config: Config) {
    val rootNode = readGenericGeojsonFile(config.path)
    val districtNames = getDistrictNames(DistrictConfig(), rootNode.features)
    for (districtName in districtNames) {
        try {
            storeDistrictGeojsonFile(config, districtName, rootNode.features)
        } catch (e: Exception) {
            println("""$districtName: $e""")
        }
    }
}

fun storeDistrictGeojsonFile(config: Config, districtName: String, features: List<GeojsonFeature<Map<String, Any?>>>) {
    val content = filterByDistrictName(config, districtName, features)
    storeGeojsonFile(districtName, content)
}