package de.l.oklab.pumps.users

import de.l.oklab.pumps.data.GeojsonFeature
import de.l.oklab.pumps.data.Geometry
import de.l.oklab.pumps.utils.GeojsonUtils.storeGeojsonFile

fun main(args: Array<String>) {
    writeUsers()
}

fun writeUsers() {
    val users = UserData.read()
    val userHomeAddresses = UserHomeAddress.read()
    val userAvgTreeAddresses = UserAvgTreeAddress.read()
    val treesWatered = TreeWatered.read()

    val userFeatures = users.mapNotNull {
        (userHomeAddresses.firstOrNull { ha -> ha.uuid == it.uuid } ?: userAvgTreeAddresses.firstOrNull { ha -> ha.uuid == it.uuid })?.let {address ->
            it.trees = treesWatered.filter { tree -> tree.uuid == it.uuid }.map { tree -> tree.uuid = null; tree.email = null; tree.lat = null; tree.lon = null; tree }
            GeojsonFeature(
                    id = it.uuid,
                    properties = it,
                    geometry = Geometry.from(address.lon.toString(), address.lat.toString())
            )
        }
    }
    storeGeojsonFile("users", userFeatures)
}

fun writeTrees() {
    val treesWatered = TreeWatered.read()
    val treesFeatures = treesWatered.map { GeojsonFeature(
            id = it.uuid,
            properties = it,
            geometry = Geometry.from(it.lon.toString(), it.lat.toString())
    ) }
    storeGeojsonFile("trees", treesFeatures)
}

fun writeAvgs() {
    val userAvgTreeAddresses = UserAvgTreeAddress.read()
    val avgFeatures = userAvgTreeAddresses.map { GeojsonFeature(
            id = it.uuid,
            properties = it,
            geometry = Geometry.from(it.lon.toString(), it.lat.toString())
    ) }
    storeGeojsonFile("avgs", avgFeatures)
}

fun writeHomes() {
    val userHomeAddresses = UserHomeAddress.read()
    val homeFeatures = userHomeAddresses.map { GeojsonFeature(
            id = it.uuid,
            properties = it,
            geometry = Geometry.from(it.lon.toString(), it.lat.toString())
    ) }
    storeGeojsonFile("homes", homeFeatures)
}