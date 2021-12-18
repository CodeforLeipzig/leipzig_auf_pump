package de.l.oklab.pumps.utils

import de.l.oklab.pumps.data.*

object PumpStateUtils {

    fun getState(pump: PumpToSerialize): State {
        val detailedPhysicalState = getDetailedPhysicalState(pump)
        val physicalState = getPhysicalState(detailedPhysicalState, pump)
        val operatingState = getOperatingState(physicalState, pump)
        val state = State(
            physicalState = physicalState,
            detailedPhysicalState = detailedPhysicalState,
            operatingState = operatingState
        )
        return state
    }

    fun getOperatingState(physicalState: PhysicalState, pump: Pump): OperatingState {
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
        pump: PumpToSerialize
    ): PhysicalState = when (detailedPhysicalState) {
        DetailedPhysicalState.notFound -> PhysicalState.nonExisting
        DetailedPhysicalState.reconstructed -> PhysicalState.existing
        DetailedPhysicalState.removed -> PhysicalState.nonExisting
        DetailedPhysicalState.stub -> PhysicalState.nonExisting
        DetailedPhysicalState.notSpecified -> {
            if (pump.stateDescription != null) {
                val detailed = DetailedPhysicalState.values().find {
                    pump.stateDescription.indexOf(it.translated) >= 0
                } ?: DetailedPhysicalState.notSpecified
                if (detailed != DetailedPhysicalState.notSpecified) {
                    pump.state?.detailedPhysicalState = detailed
                    getPhysicalState(detailed, pump)
                } else {
                    PhysicalState.unknown
                }
            } else {
                PhysicalState.unknown
            }
        }
        else -> PhysicalState.unknown
    }

    private fun getDetailedPhysicalState(
        pump: Pump
    ) = if (pump.name != null) {
        DetailedPhysicalState.values().find {
            pump.name.indexOf("[${it.translated}]") >= 0
        } ?: DetailedPhysicalState.notSpecified
    } else {
        DetailedPhysicalState.notSpecified
    }
}