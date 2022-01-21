package de.l.oklab.pumps.utils

import de.l.oklab.pumps.data.*

object PumpStateUtils {

    fun getState(csvPump: CsvPump): State {
        val detailedPhysicalState = getDetailedPhysicalState(csvPump)
        val detailedPhysicalStateToUse = if (detailedPhysicalState == DetailedPhysicalState.notSpecified) {
            csvPump.stateDescription?.let {
                DetailedPhysicalState.values().find {
                    csvPump.stateDescription.indexOf(it.translated) >= 0
                }
            } ?: detailedPhysicalState
        } else detailedPhysicalState
        val physicalState = getPhysicalState(detailedPhysicalStateToUse)
        val operatingState = getOperatingState(physicalState, csvPump)
        return State(
            physicalState = physicalState,
            detailedPhysicalState = detailedPhysicalState,
            operatingState = operatingState
        )
    }

    private fun getOperatingState(physicalState: PhysicalState, pump: CsvPump): OperatingState {
        if (physicalState == PhysicalState.nonExisting) return OperatingState.outOfOrder
        return if (pump.stateDescription != null) {
            if (pump.stateDescription.indexOf("nicht " + OperatingState.inOrder.translated) >= 0) {
                OperatingState.outOfOrder
            } else if (pump.stateDescription.indexOf(OperatingState.inOrder.translated) >= 0) {
                OperatingState.inOrder
            } else if (pump.stateDescription.indexOf(OperatingState.outOfOrder.translated) >= 0) {
                OperatingState.outOfOrder
            } else {
                OperatingState.unknown
            }
        } else {
            OperatingState.unknown
        }
    }

    private fun getPhysicalState(
        detailedPhysicalState: DetailedPhysicalState,
    ): PhysicalState = when (detailedPhysicalState) {
        DetailedPhysicalState.notFound -> PhysicalState.nonExisting
        DetailedPhysicalState.reconstructed -> PhysicalState.existing
        DetailedPhysicalState.removed -> PhysicalState.nonExisting
        DetailedPhysicalState.stub -> PhysicalState.nonExisting
        DetailedPhysicalState.notSpecified -> PhysicalState.unknown
    }

    private fun getDetailedPhysicalState(
        pump: CsvPump
    ) = if (pump.name != null) {
        DetailedPhysicalState.values().find {
            pump.name.indexOf("[${it.translated}]") >= 0
        } ?: DetailedPhysicalState.notSpecified
    } else {
        DetailedPhysicalState.notSpecified
    }
}