package de.l.oklab.pumps

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import de.l.oklab.pumps.utils.DistrictUtils.filterByDistrictName
import de.l.oklab.pumps.utils.DistrictUtils.getDistrictNames
import de.l.oklab.pumps.utils.GeojsonUtils.storeGeojsonFile
import java.io.File

const val outputPath = "D:/"

sealed class Config(
    val path: String,
    val idProp: String
)

data class PumpConfig(val id: String = "pump") : Config(path = "D:/alle.geojson", idProp = "district")
data class DistrictConfig(val id: String = "district") :
    Config(path = "D:\\git\\opendata-leipzig-playground\\docs\\ortsteile.json", idProp = id)

fun main() {
    execute(PumpConfig())
}

fun execute(config: Config) {
    val objectMapper = ObjectMapper()
    val rootNode = objectMapper.readValue(File(config.path), JsonNode::class.java)
    val featuresNode = rootNode.get("features") as ArrayNode
    val districtNames = getDistrictNames(DistrictConfig(), featuresNode)
    for (districtName in districtNames) {
        try {
            storeDistrictGeojsonFile(config, districtName, featuresNode)
        } catch (e: Exception) {
            println("""$districtName: $e""")
        }
    }
}

fun storeDistrictGeojsonFile(config: Config, districtName: String, featuresNode: ArrayNode) {
    val content = filterByDistrictName(config, districtName, featuresNode).map { it.toString() }
    storeGeojsonFile(districtName, content)
}