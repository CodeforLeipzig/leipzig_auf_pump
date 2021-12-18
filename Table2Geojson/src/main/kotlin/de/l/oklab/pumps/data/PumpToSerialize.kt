package de.l.oklab.pumps.data

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

data class PumpToSerialize(
    val numberAnke: String? = null,
    val numberOfficial: String? = null,
    val name: String? = null,
    val district: String? = null,
    val address: String? = null,
    val date: String? = null,
    val description: String? = null,
    val type: String? = null,
    val stateDescription: String? = null,
    val physicalState: String? = null,
    val detailedPhysicalState: String? = null,
    val operatingState: String? = null,
    val feedingDescription: String? = null,
    val lastFeeding: String? = null,
    val controlsDescription: String? = null,
    val lastControl: String? = null
) {
    companion object {

        fun from(
            pump: CsvPump,
            type: Type? = null,
            state: State? = null,
            controls: List<Check> = mutableListOf(),
            feedings: List<Check> = mutableListOf()
        ) = PumpToSerialize(
            numberAnke = pump.numberAnke,
            numberOfficial = pump.numberOfficial,
            name = pump.name,
            district = pump.district,
            address = pump.address,
            date = pump.date,
            description = pump.description,
            type = type?.translated,
            stateDescription = pump.stateDescription,
            physicalState = state?.physicalState?.translated,
            detailedPhysicalState = state?.detailedPhysicalState?.translated,
            operatingState = state?.operatingState?.translated,
            feedingDescription = pump.feedingDescription,
            lastFeeding = feedings.maxOfOrNull { it.date }?.format(dateTimeFormatter),
            controlsDescription = pump.controlsDescription,
            lastControl = controls.maxOfOrNull { it.date }?.format(dateTimeFormatter)
        )
    }
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