package de.l.oklab.pumps.utils

import com.fasterxml.jackson.databind.MappingIterator
import com.fasterxml.jackson.dataformat.csv.CsvMapper
import com.fasterxml.jackson.dataformat.csv.CsvSchema
import de.l.oklab.pumps.data.Pump
import java.io.File

object CsvUtils {

    fun getPumpLines(): MappingIterator<Pump> {
        val csvSchema = CsvSchema.builder().apply {
            addColumn("numberAnke", CsvSchema.ColumnType.STRING)
            addColumn("numberOfficial", CsvSchema.ColumnType.STRING)
            addColumn("name", CsvSchema.ColumnType.STRING)
            addColumn("district", CsvSchema.ColumnType.STRING)
            addColumn("address", CsvSchema.ColumnType.STRING)
            addColumn("lat", CsvSchema.ColumnType.NUMBER)
            addColumn("lon", CsvSchema.ColumnType.NUMBER)
            addColumn("date", CsvSchema.ColumnType.STRING)
            addColumn("description", CsvSchema.ColumnType.STRING)
            addColumn("stateDescription", CsvSchema.ColumnType.STRING)
            addColumn("feedingDescription", CsvSchema.ColumnType.STRING)
            addColumn("controlsDescription", CsvSchema.ColumnType.STRING)
            setColumnSeparator(',')
            setQuoteChar('"')
            setSkipFirstDataRow(true)
        }.build()

        val csvMapper = CsvMapper()
        return csvMapper.readerFor(Pump::class.java)
            .with(csvSchema)
            .readValues(File("D:\\git\\leipzig_auf_pump\\Table2Geojson\\src\\main\\resources\\pumpen.csv"))
    }
}