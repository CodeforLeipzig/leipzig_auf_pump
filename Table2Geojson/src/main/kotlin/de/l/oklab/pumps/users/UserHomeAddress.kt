package de.l.oklab.pumps.users

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.dataformat.csv.CsvMapper
import com.fasterxml.jackson.dataformat.csv.CsvSchema
import java.io.File

sealed class Identifiable(
        var uuid: String? = null,
        var email: String? = null,
)

sealed class Addressable(
        uuid: String? = null,
        email: String? = null,
        var lat: Float? = null,
        var lon: Float? = null,
): Identifiable(uuid=uuid, email=email)

open class UserHomeAddress(
        uuid: String? = null,
        email: String? = null,
        lat: Float? = null,
        lon: Float? = null,
        val address: String? = null,
): Addressable(uuid=uuid, email=email, lat=lat, lon=lon) {

    companion object {
        fun read(): List<UserHomeAddress> {
            val csvSchema = CsvSchema.builder().apply {
                addColumn("uuid", CsvSchema.ColumnType.STRING)
                addColumn("email", CsvSchema.ColumnType.STRING)
                addColumn("lat", CsvSchema.ColumnType.NUMBER)
                addColumn("lon", CsvSchema.ColumnType.NUMBER)
                addColumn("address", CsvSchema.ColumnType.STRING)
                setColumnSeparator(',')
                setQuoteChar('"')
                setSkipFirstDataRow(true)
            }.build()

            val csvMapper = CsvMapper()
            return csvMapper.readerFor(UserHomeAddress::class.java)
                    .with(csvSchema)
                    .readValues<UserHomeAddress>(File("/home/joerg/Schreibtisch/users_202303112103.csv")).readAll()
        }
    }
}

open class UserAvgTreeAddress(
        uuid: String? = null,
        email: String? = null,
        lat: Float? = null,
        lon: Float? = null,
): Addressable(uuid=uuid, email=email, lat=lat, lon=lon) {

    companion object {
        fun read(): List<UserAvgTreeAddress> {
            val csvSchema = CsvSchema.builder().apply {
                addColumn("uuid", CsvSchema.ColumnType.STRING)
                addColumn("email", CsvSchema.ColumnType.STRING)
                addColumn("lat", CsvSchema.ColumnType.NUMBER)
                addColumn("lon", CsvSchema.ColumnType.NUMBER)
                setColumnSeparator(';')
                setQuoteChar('"')
                setSkipFirstDataRow(true)
            }.build()

            val csvMapper = CsvMapper()
            return csvMapper.readerFor(UserAvgTreeAddress::class.java)
                    .with(csvSchema)
                    .readValues<UserAvgTreeAddress>(File("/home/joerg/Schreibtisch/user_avg_watered_tree_pos.csv")).readAll()
        }
    }
}

@JsonInclude(JsonInclude.Include.NON_EMPTY)
open class TreeWatered(
        @JsonProperty("uuid")
        uuid: String? = null,
        @JsonProperty("email")
        email: String? = null,
        @JsonProperty("id")
        val treeId: String? = null,
        @JsonProperty("lat")
        lat: Float? = null,
        @JsonProperty("lng")
        lon: Float? = null,
        @JsonProperty("last_watered")
        val lastWatered: String? = null,
        @JsonProperty("watered_count")
        val wateredCount: Int? = null,
): Addressable(uuid=uuid, email=email, lat=lat, lon=lon) {

    companion object {
        fun read(): List<TreeWatered> {
            val csvSchema = CsvSchema.builder().apply {
                addColumn("uuid", CsvSchema.ColumnType.STRING)
                addColumn("email", CsvSchema.ColumnType.STRING)
                addColumn("id", CsvSchema.ColumnType.STRING)
                addColumn("lat", CsvSchema.ColumnType.NUMBER)
                addColumn("lng", CsvSchema.ColumnType.NUMBER)
                addColumn("last_watered", CsvSchema.ColumnType.STRING)
                addColumn("watered_count", CsvSchema.ColumnType.NUMBER)
                setColumnSeparator(';')
                setQuoteChar('"')
                setSkipFirstDataRow(true)
            }.build()

            val csvMapper = CsvMapper()
            return csvMapper.readerFor(TreeWatered::class.java)
                    .with(csvSchema)
                    .readValues<TreeWatered>(File("/home/joerg/Schreibtisch/trees_watered_by_users.csv")).readAll()
        }
    }
}

@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
open class UserData(
        @JsonProperty("uuid")
        uuid: String? = null,
        @JsonProperty("email")
        email: String? = null,
        @JsonProperty("username")
        val username: String? = null,
        @JsonProperty("family_name")
        val familyName: String? = null,
        @JsonProperty("given_name")
        val givenName: String? = null,
        @JsonProperty("prefered_username")
        val preferedUsername: String? = null,
        @JsonProperty("salutation")
        val salutation: String? = null,
        @JsonProperty("street_with_number")
        val streetWithNumber: String? = null,
        @JsonProperty("zipcode")
        val zipcode: String? = null,
        @JsonProperty("phone_number")
        val phoneNumber: String? = null,
        @JsonProperty("created")
        val created: String? = null,
        @JsonProperty("updated")
        val updated: String? = null,
        @JsonProperty("last_seen")
        val lastSeen: String? = null,
        @JsonProperty("trees")
        var trees: List<TreeWatered>? = null
): Identifiable(uuid=uuid, email=email) {

    companion object {
        fun read(): List<UserData> {
            val csvSchema = CsvSchema.builder().apply {

                addColumn("email", CsvSchema.ColumnType.STRING)
                addColumn("uuid", CsvSchema.ColumnType.STRING)
                addColumn("username", CsvSchema.ColumnType.STRING)
                addColumn("family_name", CsvSchema.ColumnType.STRING)
                addColumn("given_name", CsvSchema.ColumnType.STRING)
                addColumn("prefered_username", CsvSchema.ColumnType.STRING)
                addColumn("salutation", CsvSchema.ColumnType.STRING)
                addColumn("street_with_number", CsvSchema.ColumnType.STRING)
                addColumn("zipcode", CsvSchema.ColumnType.STRING)
                addColumn("phone_number", CsvSchema.ColumnType.STRING)
                addColumn("created", CsvSchema.ColumnType.STRING)
                addColumn("updated", CsvSchema.ColumnType.STRING)
                addColumn("last_seen", CsvSchema.ColumnType.STRING)
                setColumnSeparator(';')
                setQuoteChar('"')
                setSkipFirstDataRow(true)
            }.build()

            val csvMapper = CsvMapper()
            return csvMapper.readerFor(UserData::class.java)
                    .with(csvSchema)
                    .readValues<UserData>(File("/home/joerg/Schreibtisch/user_data.csv")).readAll()
        }
    }
}