package de.l.oklab.pumps.utils

import de.l.oklab.pumps.data.WikipediaPump

object WikipediaUtils {

    fun readWikipediaPumps(): List<WikipediaPump> = GeojsonUtils.readJsonListFile("pumpen_wikipedia.json", WikipediaPump::class.java)
}