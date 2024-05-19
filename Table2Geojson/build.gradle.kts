group = "de.l.oklab.pumps"
version = "0.1-SNAPSHOT"

plugins {
    application
    kotlin("jvm")
}

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:_")
    implementation("com.fasterxml.jackson.core:jackson-core:_")
    implementation("com.fasterxml.jackson.core:jackson-annotations:_")
    implementation("com.fasterxml.jackson.core:jackson-databind:_")
    implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-csv:_")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:_")
	testImplementation(Testing.junit.jupiter.api)
    testRuntimeOnly(Testing.junit.jupiter.engine)
    implementation(Kotlin.stdlib)
}

application {
    mainClass.set("de.l.oklab.pumps.Table2GeojsonMainKt")
}



