package de.l.oklab.pumps.utils

import de.l.oklab.pumps.Config
import de.l.oklab.pumps.data.GeojsonFeature

object DistrictUtils {

    fun getDistrictNames(config: Config, features: List<GeojsonFeature<Map<String, Any?>>>): List<String> {
        val names = mutableSetOf<String>()
        features.forEach { it.properties[config.idProp]?.let { name -> names.add(name.toString()) } }
        return names.toList().sorted()
    }

    fun filterByDistrictName(
        config: Config,
        districtName: String,
        features: List<GeojsonFeature<Map<String, Any?>>>
    ): List<GeojsonFeature<Map<String, Any?>>> =
        features.filter { node -> node.properties[config.idProp]?.toString() == districtName }
}