package de.l.oklab.pumps.utils

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ArrayNode
import de.l.oklab.pumps.Config

object DistrictUtils {

    fun getDistrictNames(config: Config, featuresNode: ArrayNode): List<String> {
        val names = mutableSetOf<String>()
        featuresNode.forEach { it.get("properties").get(config.idProp)?.asText()?.let { name -> names.add(name) } }
        return names.toList().sorted()
    }

    fun filterByDistrictName(config: Config, districtName: String, featuresNode: ArrayNode): List<JsonNode> =
        featuresNode.filter { node -> node.get("properties").get(config.idProp).asText() == districtName }
}