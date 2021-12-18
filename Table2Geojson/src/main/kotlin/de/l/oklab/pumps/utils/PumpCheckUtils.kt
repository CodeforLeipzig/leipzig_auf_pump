package de.l.oklab.pumps.utils

import de.l.oklab.pumps.data.Check
import de.l.oklab.pumps.data.CheckState
import de.l.oklab.pumps.data.Pump
import java.time.LocalDateTime

object PumpCheckUtils {

    fun getFeedings(pump: Pump): List<Check> {
        return if (pump.feedingDescription != null) {
            val segments = pump.feedingDescription.split(",").map { it.trim() }
            getChecks(segments)
        } else {
            mutableListOf()
        }
    }

    fun getControls(pump: Pump): List<Check> {
        return if (pump.controlsDescription != null) {
            val segments = pump.controlsDescription.split(",").map { it.trim() }
            getChecks(segments)
        } else {
            mutableListOf()
        }
    }

    private fun getChecks(segments: List<String>): MutableList<Check> {
        val checks = mutableListOf<Check>()
        for (segment in segments) {
            val dateSegments = segment.split(".")
            if (dateSegments.size == 3) {
                val index = dateSegments[2].indexOf(" (")
                val checkState = if (index > 0) {
                    if (dateSegments[2].indexOf("erfolglos") >= 0) {
                        CheckState.failed
                    } else {
                        CheckState.successful
                    }
                } else {
                    CheckState.successful
                }
                var yearSegment = if (index > 0) {
                    dateSegments[2].substring(0, index)
                } else dateSegments[2]
                if (yearSegment.length == 2) {
                    yearSegment = "20$yearSegment"
                }
                val date = LocalDateTime.of(yearSegment.toInt(), dateSegments[1].toInt(), dateSegments[0].toInt(), 0, 0)
                checks.add(Check(date, checkState))
            }
        }
        return checks
    }
}