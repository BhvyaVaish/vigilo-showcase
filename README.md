# Vigilo

### Autonomous Road-Incident Intelligence & Emergency Telematics Platform

<div align="center">
  <img src="assets/branding/vigilo_logo_hd.jpg" alt="Vigilo Sentinel Emblem" width="180" style="border-radius: 12px; margin-bottom: 16px;" />
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Android_7.0+_(API_24+)--36-3DDC84?style=flat-square&logo=android&logoColor=white" alt="Platform: Android" />
  <img src="https://img.shields.io/badge/Language-Kotlin_2.2.10-7F52FF?style=flat-square&logo=kotlin&logoColor=white" alt="Language: Kotlin" />
  <img src="https://img.shields.io/badge/UI-Jetpack_Compose_BOM_2024.09.00-4285F4?style=flat-square&logo=jetpackcompose&logoColor=white" alt="UI: Jetpack Compose" />
  <img src="https://img.shields.io/badge/Telemetry-50Hz_IMU_Sensor_Fusion-FFA000?style=flat-square" alt="Telemetry: 50Hz IMU" />
  <img src="https://img.shields.io/badge/Security-Android_Keystore_ECDSA_SHA--256-00BCD4?style=flat-square" alt="Security: Keystore ECDSA" />
  <img src="https://img.shields.io/badge/Project_Stage-Functional_Mobile_Prototype-orange?style=flat-square" alt="Status: Prototype" />
</p>

---

> [!IMPORTANT]
> **Prototype Status & Evaluation Notice**  
> Vigilo is currently an engineering prototype under active development and evaluation for the **Google DevFest Lucknow Product Showcase**. It serves as an exploratory telematics architecture. It is an algorithmic safety aid, not an industrial life-safety system, and does not claim to replace factory-installed vehicle telematics or official emergency dispatch infrastructure.

---

## Quick Navigation

* 📖 [The Problem & Proposed Solution](#the-problem)
* ⚡ [Core Features Matrix](#core-features)
* 🔄 [How Vigilo Works (User Journey)](#how-vigilo-works)
* 📸 [Application Screenshots & Interface](#application-screenshots)
* 🏛️ [Systems Architecture](#technical-architecture)
* 🛠️ [Technology Stack](#technology-stack)
* 🧠 [Key Engineering Decisions](#engineering-challenges-and-decisions)
* 🧪 [Testing & Validation Evidence](#testing-and-validation)
* 🔒 [Privacy & Evidence Integrity](#privacy-and-evidence-integrity)
* 🗺️ [Limitations & Future Improvements](#limitations-and-future-improvements)
* 🎬 [Demonstration Guide](#demonstration)
* ⚖️ [Intellectual Property & Policy](#intellectual-property-and-source-code-notice)
* 👨‍💻 [About the Developer](#about-the-developer)

---

## Project Identity

**Vigilo** (from the Latin verb *vigilō*, meaning *"I watch"* or *"I remain alert"*) is an autonomous Android smartphone telematics platform that acts as an intelligent first responder when motorists cannot help themselves.

Operating entirely on-device with an offline-first architecture, Vigilo continuously evaluates triaxial inertial measurements and GPS kinematics at 50Hz. Upon detecting potential collision shockwaves, it initiates an emergency countdown with hands-free voice command cancellation, autonomously transmits location-precise distress SMS messages to personal emergency contacts if unacknowledged, signals nearby bystanders with an optical flashlight strobe, and cryptographically signs forensic telemetry and video evidence using the hardware-backed Android Keystore.

* 🌐 **Live Website:** [https://bhvyavaish.github.io/vigilo-showcase/](https://bhvyavaish.github.io/vigilo-showcase/)
* 💼 **Enterprise & Partners:** [https://bhvyavaish.github.io/vigilo-showcase/business.html](https://bhvyavaish.github.io/vigilo-showcase/business.html)
* 📱 **Interactive Demonstration:** Available for in-person interactive walkthrough and guided inspection at Google DevFest Lucknow (see [`docs/demonstration-guide.md`](docs/demonstration-guide.md))
* 📐 **Deep Architecture Documentation:** [`docs/architecture.md`](docs/architecture.md)
* 📋 **Current Project Verification Matrix:** [`PROJECT_STATUS.md`](PROJECT_STATUS.md)

---

## The Problem

Every year, millions of road traffic collisions occur globally. In a critical portion of fatal or debilitating incidents, casualties occur not because survival was physically impossible, but because **emergency response and discovery arrived too late**.

In everyday civilian motoring, three compounding challenges recur:
1. **The Acute Agency Gap:** When a high-speed impact or rollover occurs, drivers frequently suffer concussions, physical trauma, or entrapment. In shock or unconsciousness, victims cannot locate, unlock, or operate a mobile device to dial for assistance.
2. **The Telematics Hardware Divide:** While premium connected vehicles feature integrated eCall boxes or proprietary telematics (e.g., OnStar), older economy passenger cars, budget commercial vans, and virtually all two-wheelers (motorcycles and scooters) lack automated crash detection hardware entirely.
3. **Post-Crash Forensic Vacuum:** Following an accident, victims and insurance investigators face evidentiary disputes regarding speed, pre-impact braking, points of impact, and exact chronological timelines. Budget dashcams often fail to record post-impact aftermath or lack cryptographic mechanisms to prove footage was untampered.

---

## The Proposed Solution

Vigilo transforms an ordinary consumer Android smartphone into a self-contained, intelligent emergency telematics terminal without requiring aftermarket vehicle wiring, CAN-bus dongles, or subscriptions.

```
┌─────────────────────────────────────────────────────────────┐
│                       VIGILO WORKFLOW                       │
│                                                             │
│   DETECT  ───►  ALERT  ───►  PRESERVE  ───►  DOCUMENT       │
│  (50Hz IMU)   (10s Count)   (Keystore)     (Deterministic)  │
└─────────────────────────────────────────────────────────────┘
```

1. **Passive High-Frequency Sentry:** Continuously processes triaxial accelerometer, gyroscope, and GPS velocity drops in a lightweight background foreground service.
2. **Fail-Safe Alert Verification:** Provides a high-contrast 10-second countdown with both touch and hands-free voice command cancellation (*"I'm okay"*) to filter out potholes or dropped phones before any alert leaves the device.
3. **Autonomous Escalation:** If the driver is incapacitated (timer expires with no response), the platform automatically sends SMS alerts with exact coordinates and Google Maps links to designated family contacts and activates an optical bystander strobe.
4. **Cryptographic Forensic Vault:** Digitally signs all telemetry vectors and video files using the device's hardware secure enclave (ECDSA with SHA-256), creating verifiable incident evidence.
5. **Deterministic Factual Documentation:** Compiles machine-readable JSON and plain-text incident reports for insurance claims, accompanied by an optional, strictly non-authoritative advisory AI narrative.

*Notice: Vigilo is designed as an emergency intelligence aid. It complements, rather than replaces, official municipal emergency services, and avoids making unauthorized autonomous calls to public emergency switchboards.*

---

## Core Features

| Feature | Operational Purpose | Current Implementation Status | Demonstration Availability |
| :--- | :--- | :--- | :--- |
| **Alert Countdown & Cancellation** | 10s configurable (5–30s) verification window with audible alarms, haptics, and response buttons (*"I'm OK"*, *"False Alarm"*, *"I Need Help"*). | **Completed (Verified in Implementation)** | Available via in-app "Test Safety Alert Flow". |
| **Hands-Free Voice Commands** | Allows trapped or injured drivers to dismiss alerts or request assistance verbally (*"I'm okay"* / *"I need help"*) without touching the phone. | **Completed (Verified in Implementation)** | Available via offline Android `SpeechRecognizer`. |
| **Bystander Alert Mode** | High-contrast amber visual screen with GPS coordinates and a 200ms camera torch optical strobe to attract roadside passers-by at night. | **Completed (Verified in Implementation)** | Available via countdown expiration or manual toggle. |
| **Emergency Contact SMS & Location** | Autonomous background multi-part SMS dispatch with exact GPS coordinates and Google Maps links to up to 5 personal contacts. | **Completed (Verified in Implementation)** | Available on physical devices with active SIM. |
| **Emergency Helpline Calling Grid** | Rapid-access calling grid for official services (Police 100, Ambulance 108, Highway 1033). | **Simulated (By Safety Design)** | In-app simulated call screen with timer; no real dial. |
| **False-Alarm ML Component** | Hybrid 9-dimensional physics engine + on-device TensorFlow Lite model (`vigilo_crash_model.tflite`, 8 features) with adaptive online threshold learner. | **Completed (Verified in Implementation)** | Evaluated continuously during drive monitoring. |
| **Offline-First Telematics Core** | Fully autonomous local operation without cloud dependence; persists incidents, settings, and state to local Room SQLite database. | **Completed (Verified in Implementation)** | Fully functional in zero-connectivity environments. |
| **Post-Impact Video Evidence** | CameraX `VideoCapture` records post-impact MP4 video clips to public media storage. | **Partially Implemented (Video Only)** | Functional video capture; audio disabled due to mic lock. |
| **SHA-256 & Keystore Evidence Vault** | Signs canonical telemetry facts and 8KB-chunked video SHA-256 digests via Android Hardware Keystore (`AndroidKeyStore`, ECDSA key pair). | **Completed (Verified in Implementation)** | Interactive "Verify All Evidence" UI in Incident Details. |
| **Deterministic Incident Reporting** | Generates exportable plain text and structured JSON incident reports with clipboard copy and Android share sheet. | **Completed (Verified in Implementation)** | Available in Report screen with format toggle. |
| **AI-Assisted Advisory Reporting** | Generates non-authoritative collision advisory summaries and timeline analyses using the Google Gemini API (`gemini-3.6-flash`). | **Completed (Verified in Implementation)** | Functional with API key; graceful offline fallback. |

*Detailed capability specifications are documented in [`docs/features-and-workflows.md`](docs/features-and-workflows.md).*

---

## How Vigilo Works

The complete end-to-end user journey within the Vigilo application:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│ 1. Onboard  │ ──► │ 2. Drive     │ ──► │ 3. Detect   │ ──► │ 4. Alert     │
│ Permissions │     │ Monitoring   │     │ Impact Peak │     │ Countdown    │
└─────────────┘     └──────────────┘     └─────────────┘     └──────┬───────┘
                                                                    │
                    ┌──────────────┐     ┌─────────────┐            │
                    │ 7. Report &  │ ◄── │ 6. Evidence │ ◄──────────┘
                    │ Verification │     │ Preserved   │     (User Response / Timeout)
                    └──────────────┘     └─────────────┘
```

1. **Step 1: First-Time Permissions & Emergency Contact Setup:** The user grants necessary Android runtime permissions (Location, Notifications, Camera, Microphone, SMS, Overlay) sequentially and configures up to 5 emergency contacts with phone numbers in Settings.
2. **Step 2: Starting Drive Monitoring:** The user opens the cockpit, confirms their phone mounting placement (`Car Mount`, `Two-Wheeler Mount`, or `In-Pocket/Bag`), and taps **"Begin Drive Monitoring"**. A persistent foreground service activates.
3. **Step 3: Active Monitoring & Kinematic Analysis:** The phone continuously buffers 50Hz sensor data into a circular ring buffer (`CircularSensorBuffer`). The user drives normally; no screen interaction is required.
4. **Step 4: Impact Shock Detection (The Incident Moment):** If a sudden, severe deceleration spike occurs (e.g., $\ge 4.5\text{G}$ for car mounts) accompanied by rotational torque and followed by vehicle standstill, the fusion engine identifies an `ImpactEvaluationResult.ConfirmedImpact`.
5. **Step 5: The 10-Second Safety Countdown:** The screen transitions to a pulsing red alert. Audible alarms and haptics pulse every second:
   * **Path A (User Safe):** Driver taps *"I'm OK"* or speaks *"I'm okay"*. The alert dismisses, the incident is recorded as safe, and the online learner notes the feedback.
   * **Path B (False Positive):** Driver taps *"False Alarm"*. Monitoring immediately resumes, and the learner nudges the sensitivity threshold upward (+0.015).
   * **Path C (Distress Confirmed):** Driver taps *"I Need Help"* or speaks *"Help"*. The countdown terminates and escalates immediately.
   * **Path D (Incapacitation / Timeout):** If 10 seconds elapse with zero response, Vigilo assumes the worst and automatically escalates.
6. **Step 6: Autonomous Escalation & Bystander Alert:** Background SMS alerts containing GPS coordinates and Google Maps links are dispatched to emergency contacts. The screen activates high-contrast Bystander Mode with a strobing camera flashlight to signal passers-by.
7. **Step 7: Forensic Preservation & Sealing:** Post-impact video recording flushes to disk. A canonical string of telemetry facts is signed by the Android Hardware Keystore ECDSA key pair, binding the video SHA-256 digest to the physical device.
8. **Step 8: Deterministic Report Export:** The driver or investigator opens the Incident Details screen, reviews the verified timeline, verifies the cryptographic signature, and exports structured plain text or JSON reports.

---

## Application Screenshots

> [!NOTE]
> **Verified Mobile Interface:** Below are actual application screenshots captured from a physical device running the Vigilo Android build, demonstrating the end-to-end incident intelligence, alerting, and evidence verification workflow.

<table width="100%">
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/01_home_dashboard.jpg" alt="Home Dashboard & Profile Selector" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>01. Home Dashboard & Profile Selector</b>
      <p><i>Telematics launcher with profile calibration (Car Mount, Two-Wheeler, In-Pocket/Bag) and recent incident metrics.</i></p>
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/02_active_drive_cockpit.jpg" alt="Active Drive Cockpit" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>02. Active Drive Cockpit</b>
      <p><i>Live 50Hz sensor fusion HUD displaying instantaneous G-force, vehicle GPS speed, and safety alert trigger.</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/03_sensor_diagnostics.jpg" alt="Live Sensor Diagnostics" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>03. Live Sensor Diagnostics</b>
      <p><i>High-frequency diagnostics showing real-time triaxial accelerometer and gyroscope streams and buffer capacity.</i></p>
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/04_impact_countdown_alert.jpg" alt="Impact Alert Countdown" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>04. Impact Alert Countdown</b>
      <p><i>10-second high-contrast alert countdown with Confidence Tier badge, audible sirens, and voice recognition.</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/05_emergency_assistance.jpg" alt="Emergency Assistance Screen" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>05. Emergency Assistance Screen</b>
      <p><i>Accident coordinates, reverse-geocoded location, measured impact dynamics, and simulated emergency calling grid.</i></p>
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/06_bystander_alert_mode.jpg" alt="Bystander SOS Mode" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>06. Bystander SOS Screen</b>
      <p><i>High-visibility amber strobe screen with camera flashlight pulses (200ms) for night-time roadside responders.</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/07_incident_history.jpg" alt="Incident History Journal" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>07. Incident History Journal</b>
      <p><i>Persistent local SQLite log with confidence tier filter chips (All, High, Medium, Low) and incident summary cards.</i></p>
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/08_incident_details_vault.jpg" alt="Evidence Vault Verification" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>08. Evidence Vault & Verification</b>
      <p><i>Hardware Keystore ECDSA signature and SHA-256 video hash showing green <b>VERIFIED</b> forensic status.</i></p>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/09_deterministic_report.jpg" alt="Deterministic Factual Report" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>09. Deterministic Factual Report</b>
      <p><i>Structured incident report with Factual Text vs JSON toggle and non-authoritative advisory Gemini AI narrative.</i></p>
    </td>
    <td width="50%" align="center" valign="top">
      <img src="assets/screenshots/10_emergency_settings.jpg" alt="Emergency Settings & Contacts" width="100%" style="max-width:320px; border-radius:8px;" />
      <br />
      <b>10. Emergency Settings & Contacts</b>
      <p><i>Configurable countdown duration (5–30s), bystander alert preferences, DND override, and up to 5 SOS contacts.</i></p>
    </td>
  </tr>
</table>

---

## Technical Architecture

Vigilo is architected with a strict separation of concerns, decoupling UI presentation from telematics collection, background execution, and local persistence.

```mermaid
graph TD
    subgraph UI_Layer ["Presentation Layer (Jetpack Compose)"]
        UI_Dash[Home Cockpit & Diagnostics]
        UI_Alert[Impact Alert & Countdown]
        UI_Bystander[Bystander Alert Screen]
        UI_Report[Incident History & Report View]
    end

    subgraph State_Layer ["Domain & State Control"]
        SM[Incident State Machine]
        Repo_Mon[Monitoring Repository]
        Repo_Inc[Incident Repository]
    end

    subgraph Core_Telematics ["Core Telematics & Sensing Engine"]
        FGS[Drive Monitoring Foreground Service]
        Buffer[Circular Sensor Buffer 50Hz]
        Physics[Sensor Fusion & Heuristics]
        TFLite[TFLite Model & False-Alarm Learner]
        Voice[Voice Emergency Recognizer]
        Camera[CameraX Video Evidence Collector]
        Security[Evidence Authenticator - Hardware Keystore]
    end

    subgraph Persistence_Layer ["Local Persistence & External Services"]
        DB[(Vigilo Room SQLite DB)]
        SMS[Android SmsManager - Cellular SOS]
        Gemini[Google Gemini API - Advisory AI]
    end

    UI_Dash --> Repo_Mon
    UI_Alert --> SM
    UI_Alert --> Voice
    UI_Bystander --> Security
    UI_Report --> Repo_Inc
    SM --> Repo_Mon
    Repo_Mon --> FGS
    FGS --> Buffer
    Buffer --> Physics
    Physics --> TFLite
    TFLite --> SM
    SM --> Camera
    SM --> Security
    SM --> SMS
    Security --> DB
    Repo_Inc --> DB
    UI_Report --> Gemini
```

For complete diagrams, state machine transitions, and mathematical formulas, see [`docs/architecture.md`](docs/architecture.md).

---

## Technology Stack

Every technology listed below was verified by direct inspection of the codebase configuration (`app/build.gradle.kts` and `gradle/libs.versions.toml`):

### Application Technologies
* **Kotlin (`2.2.10`):** Core language providing expressive, type-safe implementation across all application modules.
* **Jetpack Compose (BOM `2024.09.00`):** Declarative Android UI toolkit used to build the cockpit, pulsing alert cards, diagnostics, and reports.
* **Android SDK (Min SDK `24`, Target SDK `36`):** Modern Android runtime target compatible with devices running Android 7.0 (Nougat) through Android 16.
* **AndroidX Lifecycle & ViewModel (`2.8.7`):** Provides lifecycle-aware reactive `StateFlow` state-holders and coroutine scopes.
* **AndroidX Lifecycle Service (`2.8.7`):** Hosts the continuous background `DriveMonitoringService`.
* **AndroidX Navigation Compose (`2.8.9`):** Manages single-activity declarative navigation graphs and alert overlays.
* **AndroidX CameraX (`1.5.0`):** Orchestrates hardware-accelerated video evidence recording via `VideoCapture`.
* **AndroidX Room (`2.7.0`):** Object-relational mapping for local SQLite database persistence.
* **TensorFlow Lite (`2.16.1`):** Embedded neural network runtime evaluating 8-dimensional telemetry vectors for crash classification.
* **Android Hardware Keystore (`AndroidKeyStore`):** Generates EC key pairs in the hardware Trusted Execution Environment to sign evidence via ECDSA (`SHA256withECDSA`).
* **Android SmsManager:** Telephony platform API dispatching multi-part background emergency SMS messages.
* **Android SpeechRecognizer:** Platform speech service executing hands-free voice commands with `EXTRA_PREFER_OFFLINE = true`.
* **Kotlin Coroutines (`1.10.2`):** Asynchronous concurrency primitives managing timers and sensor pipelines.
* **Moshi Kotlin (`1.15.2`):** JSON serialization library generating structured incident report exports and API models.
* **Retrofit (`2.12.0`) & OkHttp (`4.10.0`):** HTTP networking client connecting to the Google Gemini API.
* **Google Gemini API (`gemini-3.6-flash`):** Advisory collision intelligence service generating non-authoritative incident narratives.

### Development & Build Tools
* **Android Gradle Plugin (`9.1.1`) & Gradle (`9.5.0`):** Build automation and packaging system.
* **Kotlin Symbol Processing - KSP (`2.3.5`):** High-performance compiler plugin generating Room DAOs and Moshi adapters.
* **Robolectric (`4.16.1`) & JUnit 4 (`4.13.2`):** Testing frameworks for local JVM unit and Android framework tests.
* **Secrets Gradle Plugin (`2.0.1`):** Secure build-time configuration injector preventing API key exposure.

*For full technology rationales, see [`docs/technology-stack.md`](docs/technology-stack.md).*

---

## Engineering Challenges and Decisions

Vigilo's development involved resolving genuine technical constraints encountered when converting a consumer smartphone into a telematics device:

### 1. Hybrid Sensor Fusion vs. Black-Box Deep Learning
* **The Problem:** Deep learning models evaluated continuously on 50Hz sensor streams cause severe battery drain and behave unpredictably on novel physical vibrations (e.g., dropping a phone inside a car).
* **Approach Used:** Implemented a deterministic 9-dimensional physics engine (`SensorFusionEngine`) calculating gravity-isolated linear acceleration, jerk ($da/dt$), rotational surge, and post-impact standstill, with an embedded 8-feature TensorFlow Lite model acting as an optional confirmation gate.
* **Rationale:** Maximizes battery efficiency, delivers instant deterministic explainability, and guarantees uninterrupted operation if ML runtimes encounter exceptions.
* **Trade-Off:** Requires profile-specific threshold calibration (`CAR_MOUNTED`, `TWO_WHEELER_MOUNTED`, `IN_POCKET_OR_BAG`).
* **Future Work:** Integrate automated dynamic mount rigidity auto-calibration.

### 2. Audio Hardware Contention: Voice Commands vs. Video Audio
* **The Problem:** When an impact occurs, Vigilo records post-impact video evidence while simultaneously listening for driver voice commands (*"I'm okay"*). In the Android audio subsystem, binding microphone audio to CameraX VideoCapture causes `SpeechRecognizer` to fail with `ERROR_AUDIO` due to exclusive microphone hardware locking.
* **Approach Used:** Audio capture was deliberately disabled in `VideoEvidenceCollector.kt`, producing silent MP4 video clips and dedicating 100% of the microphone input to real-time speech recognition during the 10-second alert window.
* **Rationale:** Life safety takes absolute precedence over media completeness: a trapped driver's verbal false-alarm dismissal or distress call is drastically more important than recording ambient engine audio.
* **Trade-Off:** Video clips lack an audio track.
* **Future Work:** Implement a custom low-level `AudioRecord` shared buffer forking raw PCM samples simultaneously to both the video muxer and an on-device Vosk speech model.

### 3. Hardware Keystore Digital Signatures vs. Cloud Attestation
* **The Problem:** Vehicular telemetry is frequently contested in legal liability and insurance proceedings. Storing telemetry in plain SQLite files allows post-event tampering. Conversely, transmitting data to a cloud attestation server is impossible if the crash occurs in a cellular dead zone.
* **Approach Used:** Vigilo generates an asymmetric EC key pair in the **Android Hardware-Backed Keystore** (TEE / StrongBox). It compiles key incident telemetry into a canonical string, digests the video file using chunked SHA-256 (8KB buffers), and signs both with `SHA256withECDSA`.
* **Rationale:** Provides 100% offline, tamper-evident cryptographic preservation at the point of impact.
* **Trade-Off:** Cryptography proves data integrity since signing; it cannot prove whether the phone was mounted to a car or shaken by hand.
* **Future Work:** Support exportable X.509 certificate chains for external judicial verification.

*For further analysis of these decisions and our three-tier data model, see [`docs/technical-decisions.md`](docs/technical-decisions.md).*

---

## Testing and Validation

Vigilo has been evaluated using automated unit testing suites, local test runners, and physical hardware validation:

| Test Area | Test Method | Observed Result | Validation Status |
| :--- | :--- | :--- | :--- |
| **Circular Sensor Buffer FIFO** | JVM Unit Test (`SensorFusionEngineTest.kt`) | Buffer capped at 50; oldest samples evicted properly; peak acceleration and gyro calculations verified. | **Verified Passing** |
| **Normal Driving Baseline Filtering** | JVM Unit Test (`SensorFusionEngineTest.kt`) | 1G gravity vectors and minor steering angular rates return `ImpactEvaluationResult.Normal`. | **Verified Passing** |
| **Multi-Stage Impact Detection** | JVM Unit Test (`SensorFusionEngineTest.kt`) | 4.5G shock triggers Stage 1 (`Suspected`), followed by post-impact stillness (1.8s) triggering Stage 3 `ConfirmedImpact` with `HIGH` confidence tier. | **Verified Passing** |
| **Permission Management & Resolution** | JVM Unit Test (`PermissionManagerTest.kt`) | Resolves missing runtime permissions and builds sequential request flows. | **Verified Passing** |
| **Location Telemetry Tracker** | JVM Unit Test (`LocationTrackerTest.kt`) | Tracks GPS coordinate updates and flags degraded states when fix is lost. | **Verified Passing** |
| **Emergency Alert Flow Transitions** | Robolectric Test (`ImpactAlertFlowTest.kt`) | State machine transitions from `POSSIBLE_IMPACT` through `USER_OK`, `FALSE_ALARM`, and `ASSISTANCE_REQUIRED`. | **Requires API 34 SDK Pin** *(Threw `UnsupportedOperationException` on target SDK 36 preview)* |
| **Hardware Keystore ECDSA Integrity** | Physical Device Manual Execution | Generates EC key pair in `AndroidKeyStore`, signs canonical telemetry, and verifies successfully. | **Verified on Hardware** |
| **Automated SOS SMS Dispatch** | Physical Device SIM Execution | Dispatches multi-part background SMS with GPS coordinates and Google Maps links to real mobile numbers. | **Verified on Hardware** |
| **Automotive Barrier Crash Testing** | Physical Crash Facility | High-speed vehicle collision with physical impact barriers. | **Not Conducted (Simulated Telemetry Only)** |

*For complete test execution logs and manual verification protocols, see [`docs/testing-and-validation.md`](docs/testing-and-validation.md).*

---

## Privacy and Evidence Integrity

Vigilo is designed as an **offline-first, privacy-respecting telematics terminal**:

1. **Zero Passive Surveillance:** Sensor data is evaluated in a volatile circular RAM buffer (last 50 samples, ~1–2.5s). Routine driving telemetry is never saved to disk, and background video is never recorded during normal drives.
2. **Local-First Processing:** Core detection, alert countdowns, speech recognition, and cryptographic signing execute 100% on the local phone without sending data to external servers.
3. **No Centralized Contact Tracking:** Emergency contact phone numbers remain strictly local in the device's secure app storage and are accessed exclusively to populate outgoing SMS recipients.
4. **Cryptographic Scope & Integrity Boundaries:**
   * **What SHA-256 and ECDSA Prove:** Mathematically guarantees that the stored telemetry numbers, coordinates, and video bytes have not been edited or corrupted since being signed by the device's hardware enclave.
   * **What Cryptography Does Not Prove:** A digital hash does not independently prove external physical truth, whether the vehicle was at fault, or sensor calibration accuracy.
5. **Generative AI Disclosure:** The Google Gemini API is accessed only if configured by the user to produce advisory incident narratives. Raw video files and voice recordings are **never** transmitted to the AI endpoint.

*For complete data handling disclosures, see [`docs/privacy-and-data-handling.md`](docs/privacy-and-data-handling.md).*

---

## Limitations and Future Improvements

### Current Prototype Limitations
* **Mounting Rigidity Dependency:** Smartphone sensing cannot access vehicle chassis accelerometers or CAN-bus data. Unsecured phones resting on soft seats introduce false-negative damping risks.
* **Audio Concurrency:** Evidence video recordings are silent due to platform-level audio hardware contention during concurrent voice recognition.
* **No Direct Emergency Services Integration:** Real cellular dialling of municipal 112/911 call centers is simulated to avoid accidental false dispatches during testing.
* **Radio Coverage Gaps:** SMS alert dispatch requires active cellular reception and fails in zero-connectivity dead zones until signal is recovered.

### Planned Future Work
* **OBD-II & BLE Telematics Integration:** Interface with vehicle OBD-II ports to ingest vehicle speed, brake application, and airbag deployment flags directly from the vehicle bus.
* **Unified Low-Level Audio Pipeline:** Implement a custom `AudioRecord` streaming multiplexer to record audio evidence while executing on-device Vosk speech recognition simultaneously.
* **Next-Generation 911 (NG911) Integration:** Partner with telematics carriers and certified emergency call centers to support EENA-compliant data messaging.

*For detailed architectural roadmaps, see [`docs/limitations-and-roadmap.md`](docs/limitations-and-roadmap.md).*

---

## Demonstration

Vigilo includes a structured, self-contained **3-Minute Demonstration Flow** for evaluators and DevFest attendees:

```
[0:00 - 0:30] Problem & Context (Incapacitation & telematics gap)
[0:30 - 1:00] Launching Cockpit (50Hz IMU monitoring & mounting profile)
[1:00 - 1:45] Simulated Impact Alert (10s countdown, voice command, bystander strobe)
[1:45 - 2:30] Evidence Vault & Report (ECDSA verification & deterministic JSON export)
[2:30 - 3:00] Architecture & Technical Depth Summary
```

* **Demonstration Mode:** Evaluators can tap **"Test Safety Alert Flow"** in the cockpit to trigger the full alert sequence, voice command recognition, and evidence sealing without operating a vehicle.
* **Live Sensor Diagnostics:** The diagnostics screen provides real-time visibility into raw 3-axis accelerometer and gyroscope waveforms.
* **APK Distribution Notice:** In compliance with security and intellectual property boundaries, **compiled APKs are not distributed in this repository**. Guided demonstrations are conducted on verified evaluation hardware.

*The full presenter script and fallback contingencies are documented in [`docs/demonstration-guide.md`](docs/demonstration-guide.md).*

---

## Intellectual Property and Source-Code Notice

> **The original Vigilo source-code repository is maintained privately to protect the project's implementation and intellectual property during ongoing development and evaluation. This public repository is intended to document the project's goals, architecture, verified capabilities and demonstration resources. It does not distribute the application source code or compiled APK.**

*For detailed rights reservations, collaboration guidelines, and licensing inquiries, see [`IP_AND_SOURCE_CODE_POLICY.md`](IP_AND_SOURCE_CODE_POLICY.md).*

---

## About the Developer

Vigilo was designed, engineered, and prototyped by **Bhvya Vaish**, an Android telematics and mobile systems developer.

* 🌐 **Portfolio:** [https://bhvyavaish.vercel.app/](https://bhvyavaish.vercel.app/)
* 💼 **LinkedIn:** [https://www.linkedin.com/in/bhvya-vaish/](https://www.linkedin.com/in/bhvya-vaish/)
* 🐙 **GitHub:** [https://github.com/bhvyavaish/](https://github.com/bhvyavaish/)

*For technical inquiries, academic evaluation, or DevFest collaboration, please connect via LinkedIn or the portfolio portal.*
