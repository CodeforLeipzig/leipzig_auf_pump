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

/**
 * select u.uuid, u.email, null lat, null as lon, u.street_with_number as address
 * from users u
 */
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
                setColumnSeparator(';')
                setQuoteChar('"')
                setSkipFirstDataRow(true)
            }.build()

            val csvMapper = CsvMapper()
            return csvMapper.readerFor(UserHomeAddress::class.java)
                    .with(csvSchema)
                    .readValues<UserHomeAddress>(File("/Users/joerg_p/Desktop/users_20251109.csv")).readAll()
        }
    }
}

/**
 * select u.uuid, u.email, t.lat, t.lng
 * from trees_adopted ta
 * join users u on u.uuid = ta.uuid
 * join trees t on t.id = ta.tree_id
 */
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
                setColumnSeparator(',')
                setQuoteChar('"')
                setSkipFirstDataRow(true)
            }.build()

            val csvMapper = CsvMapper()
            return csvMapper.readerFor(UserAvgTreeAddress::class.java)
                    .with(csvSchema)
                    .readValues<UserAvgTreeAddress>(File("/Users/joerg_p/Desktop/user_avg_watered_tree_pos.csv")).readAll()
        }
    }
}

/**
 * select u.uuid, u.email, t.id, t.lat, t.lng, max(tw.timestamp) as last_watered, sum(tw.amount::float) as watered_amount, count(*) as watered_count
 * from trees_watered tw
 * join users u on u.uuid = tw.uuid
 * join trees t on t.id = tw.tree_id
 * group by u.uuid, u.email, t.id, t.lat, t.lng
 */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
open class TreeWatered(
        @get:JsonProperty("uuid")
        uuid: String? = null,
        @get:JsonProperty("email")
        email: String? = null,
        @get:JsonProperty("id")
        val treeId: String? = null,
        @get:JsonProperty("lat")
        lat: Float? = null,
        @get:JsonProperty("lon")
        lon: Float? = null,
        @get:JsonProperty("last_watered")
        val lastWatered: String? = null,
        @get:JsonProperty("watered_amount")
        val wateredAmount: Int? = null,
        @get:JsonProperty("watered_count")
        val wateredCount: Int? = null,
): Addressable(uuid=uuid, email=email, lat=lat, lon=lon) {

    companion object {
        fun read(): List<TreeWatered> {
            val csvSchema = CsvSchema.builder().apply {
                addColumn("uuid", CsvSchema.ColumnType.STRING)
                addColumn("email", CsvSchema.ColumnType.STRING)
                addColumn("id", CsvSchema.ColumnType.STRING)
                addColumn("lat", CsvSchema.ColumnType.NUMBER)
                addColumn("lon", CsvSchema.ColumnType.NUMBER)
                addColumn("last_watered", CsvSchema.ColumnType.STRING)
                addColumn("watered_amount", CsvSchema.ColumnType.NUMBER)
                addColumn("watered_count", CsvSchema.ColumnType.NUMBER)
                setColumnSeparator(',')
                setQuoteChar('"')
                setSkipFirstDataRow(true)
            }.build()

            val csvMapper = CsvMapper()
            return csvMapper.readerFor(TreeWatered::class.java)
                    .with(csvSchema)
                    .readValues<TreeWatered>(File("/Users/joerg_p/Desktop/trees_watered_by_users.csv")).readAll()
        }
    }
}

/**
 * select
 *         u.uuid,
 *         u.email,
 *         u.username,
 *         u.family_name,
 *         u.given_name,
 *         u.prefered_username,
 *         u.salutation,
 *         u.street_with_number,
 *         u.zipcode,
 *         u.phone_number,
 *         u.created,
 *         u.updated,
 *         us.last_seen
 * from users u
 * join users_stats us on u.uuid = us.user_id
 */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
open class UserData(
        @get:JsonProperty("uuid")
        uuid: String? = null,
        @get:JsonProperty("email")
        email: String? = null,
        @get:JsonProperty("username")
        val username: String? = null,
        @get:JsonProperty("family_name")
        val familyName: String? = null,
        @get:JsonProperty("given_name")
        val givenName: String? = null,
        @get:JsonProperty("prefered_username")
        val preferedUsername: String? = null,
        @get:JsonProperty("salutation")
        val salutation: String? = null,
        @get:JsonProperty("street_with_number")
        val streetWithNumber: String? = null,
        @get:JsonProperty("zipcode")
        val zipcode: String? = null,
        @get:JsonProperty("phone_number")
        val phoneNumber: String? = null,
        @get:JsonProperty("created")
        val created: String? = null,
        @get:JsonProperty("updated")
        val updated: String? = null,
        @get:JsonProperty("last_seen")
        val lastSeen: String? = null,
        @get:JsonProperty("trees")
        var trees: List<TreeWatered>? = null
): Identifiable(uuid=uuid, email=email) {

    companion object {
        fun read(): List<UserData> {
            val csvSchema = CsvSchema.builder().apply {

                addColumn("uuid", CsvSchema.ColumnType.STRING)
                addColumn("email", CsvSchema.ColumnType.STRING)
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
                    .readValues<UserData>(File("/Users/joerg_p/Desktop/user_data.csv")).readAll()
        }
    }
}