package de.l.oklab.pumps.data

import java.time.LocalDateTime

class PumpToSerialize(
    pump: Pump,
    var type: Type? = null,
    var state: State? = null,
    var controls: List<Check> = mutableListOf(),
    var feedings: List<Check> = mutableListOf()
): Pump(
    numberAnke = pump.numberAnke,
    numberOfficial = pump.numberOfficial,
    name = pump.name,
    district = pump.district,
    address = pump.address,
    lat = pump.lat,
    lon = pump.lon,
    date = pump.date,
    description = pump.description,
    stateDescription = pump.stateDescription,
    feedingDescription = pump.feedingDescription,
    controlsDescription = pump.controlsDescription,
)

enum class Type(val translated: String) {
    gotique("Gotik"),
    bigLion("Großer Löwe"),
    smallLion("Kleiner Löwe"),
    dolphin("Delphin"),
    birdCage("Vogelkäfig"),
    unknown("unbekannt")
}

data class State (
    val physicalState: PhysicalState,
    var detailedPhysicalState: DetailedPhysicalState,
    val operatingState: OperatingState?
)

enum class PhysicalState (val translated: String) {
    existing("vorhanden"), nonExisting("nicht vorhanden"),
    unknown("unbekannt")
}

enum class DetailedPhysicalState(val translated: String) {
    removed("abgebaut"), stub("Torso"),
    reconstructed("rekonstruiert"), notFound("nicht gefunden"),
    notSpecified("nicht weiter spezifiert")
}

enum class OperatingState(val translated: String) {
    outOfOrder("außer Betrieb"), inOrder("betriebsbereit"),
    unknown("unbekannt")
}

data class Check(
    val date: LocalDateTime,
    val result: CheckState
)

enum class CheckState (val translated: String) {
    successful("erfolgreich"), failed("erfolglos")
}