# Technology Stack Inventory

This document details the exact programming languages, libraries, SDKs, and tooling discovered and verified in the **Vigilo** codebase.

---

## 1. Core Application Technologies

| Technology | Category | Exact Version | One-Sentence Architectural Role |
| :--- | :--- | :--- | :--- |
| **Kotlin** | Language | `2.2.10` | The primary programming language utilized across the entire project for type-safe, expressive Android development. |
| **Jetpack Compose** | UI Framework | BOM `2024.09.00` | Declarative UI toolkit used to build the cockpit, pulsing emergency alert cards, diagnostics, and reports. |
| **Android SDK** | Platform Target | Min `24`, Target `36` | Targets modern Android systems with backward compatibility down to Android 7.0 (Nougat). |
| **AndroidX Lifecycle & ViewModel** | Architecture | `2.8.7` | Provides reactive `StateFlow` state-holders and lifecycle-aware coroutine scopes for all screens. |
| **AndroidX Lifecycle Service** | Service Architecture | `2.8.7` | Provides the underlying lifecycle container for the continuous background `DriveMonitoringService`. |
| **AndroidX Navigation Compose** | Navigation | `2.8.9` | Manages single-activity navigation graph transitions between screens and alert dialog overlays. |
| **AndroidX CameraX Video** | Media Capture | `1.5.0` | Orchestrates hardware-accelerated post-impact video evidence capture using the device's back camera. |
| **AndroidX Room** | Persistence | `2.7.0` | Provides local SQLite persistence for storing telemetry logs, cryptographic signatures, and incident records. |
| **TensorFlow Lite (TFLite)** | On-Device ML | `2.16.1` | Executes embedded inference over 8-dimensional normalized telemetry feature vectors for crash classification. |
| **Android Hardware Keystore** | Security / Cryptography | Native (`AndroidKeyStore`) | Generates EC key pairs in the hardware Trusted Execution Environment to sign incident facts with ECDSA. |
| **Android SmsManager** | Telephony | Platform API | Dispatches background multi-part SMS distress alerts with location coordinates to emergency contacts. |
| **Android SpeechRecognizer** | Speech Recognition | Platform API | Provides hands-free voice command interpretation (*"I'm okay"* / *"I need help"*) during alert countdowns. |
| **Kotlin Coroutines** | Concurrency | `1.10.2` | Manages non-blocking asynchronous execution, sensor processing pipelines, and timer jobs. |
| **Moshi Kotlin** | Serialization | `1.15.2` (with KSP) | Serializes deterministic structured JSON incident reports and converts API network models. |
| **Retrofit & OkHttp** | Networking | `2.12.0` / `4.10.0` | Connects to the external Google Gemini API endpoint for optional advisory collision narrative generation. |
| **Google Gemini API** | Advisory Intelligence | `gemini-3.6-flash` | Generates non-authoritative collision summaries and timeline narratives from verified telemetry facts. |

---

## 2. Development, Build, & Testing Tooling

| Tool / Plugin | Version | One-Sentence Role |
| :--- | :--- | :--- |
| **Android Gradle Plugin (AGP)** | `9.1.1` | Orchestrates compilation of Kotlin sources, manifest merging, and packaging. |
| **Gradle** | `9.5.0` | Build automation system executing builds, dependency resolution, and test runners. |
| **Kotlin Symbol Processing (KSP)** | `2.3.5` | High-performance compiler plugin generating Room DAOs and Moshi JSON adapters at build time. |
| **Robolectric** | `4.16.1` | Executes Android-dependent unit tests on local desktop JVM environments. |
| **JUnit 4** | `4.13.2` | Core test runner executing unit tests and asserting sensor fusion physics correctness. |
| **Roborazzi** | `1.59.0` | Automated screenshot test infrastructure for validating Jetpack Compose UI rendering states. |
| **Secrets Gradle Plugin** | `2.0.1` | Reads `.env` configuration properties at compile time, preventing hardcoded keys in version control. |
