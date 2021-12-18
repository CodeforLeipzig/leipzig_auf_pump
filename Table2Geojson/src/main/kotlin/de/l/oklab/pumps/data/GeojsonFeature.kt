package de.l.oklab.pumps.data

import de.l.oklab.pumps.utils.GeojsonUtils.toCoord

data class GeojsonFeatureCollection(
    val type: String = "FeatureCollection",
    val features: List<GeojsonFeature>
)

data class GeojsonFeature(
    val type: String = "Feature",
    val properties: Map<String, Any?>,
    val geometry: Geometry? = null,
    val id: String? = null
)

data class Geometry(
    val type: String = "Point",
    val coordinates: List<Float>? = null
) {
    companion object {

        fun from(lon: String?, lat: String?) = Geometry(
            coordinates = listOfNotNull(toCoord(lon), toCoord(lat))
        )
    }
}