package de.l.oklab.pumps.data

import com.fasterxml.jackson.annotation.JsonProperty

data class WikipediaPump(
    @JsonProperty("ID")
    val id: String? = null,

    @JsonProperty("Name")
    val name: String? = null,

    @JsonProperty("Ortsteil")
    val district: String? = null,

    @JsonProperty("Adresse")
    val address: String? = null,

    @JsonProperty("Adresse-sort")
    val addressSort: String? = null,

    @JsonProperty("NS")
    val lat: String? = null,

    @JsonProperty("EW")
    val lon: String? = null,

    @JsonProperty("Datierung")
    val dating: String? = null,

    @JsonProperty("Datierung-sort")
    val datingSort: String? = null,

    @JsonProperty("Beschreibung")
    val description: String? = null,

    @JsonProperty("Bild")
    val image: String? = null,

    @JsonProperty("Commonscat")
    val commonsCat: String? = null
)