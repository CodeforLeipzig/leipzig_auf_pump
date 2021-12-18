package de.l.oklab.pumps.data

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class PumpToSerialize(
    pump: CsvPump,
    var type: Type? = null,
    var state: State? = null,
    var controls: List<Check> = mutableListOf(),
    var feedings: List<Check> = mutableListOf()
) : CsvPump(
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
) {

    fun toMap(): Map<String, Any?> = mapOf(
        "numberAnke" to numberAnke,
        "numberOfficial" to numberOfficial,
        "name" to name,
        "district" to district,
        "address" to address,
        "date" to date,
        "description" to description,
        "type" to type?.translated,
        "stateDescription" to stateDescription,
        "physicalState" to state?.physicalState?.translated,
        "detailedPhysicalState" to state?.detailedPhysicalState?.translated,
        "operatingState" to state?.operatingState?.translated,
        "feedingDescription" to feedingDescription,
        "lastFeeding" to feedings.maxOfOrNull { it.date }?.format(dateTimeFormatter),
        "controlsDescription" to controlsDescription,
        "lastControl" to controls.maxOfOrNull { it.date }?.format(dateTimeFormatter)
    )
}

private val dateTimeFormatter = DateTimeFormatter.ofPattern("dd.MM.yyyy")

enum class Type(val translated: String) {
    gotique("Gotik"),
    bigLion("Großer Löwe"),
    smallLion("Kleiner Löwe"),
    dolphin("Delphin"),
    birdCage("Vogelkäfig"),
    unknown("unbekannt")
}

data class State(
    val physicalState: PhysicalState,
    var detailedPhysicalState: DetailedPhysicalState,
    val operatingState: OperatingState?
)

enum class PhysicalState(val translated: String) {
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

enum class CheckState(val translated: String) {
    successful("erfolgreich"), failed("erfolglos")
}