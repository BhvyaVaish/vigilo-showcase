# Project Status & Capability Verification

**Repository:** `vigilo-showcase`  
**Application Prototype Version:** `1.0` (Build Code: 1)  
**Status Verification Date:** October 2026  
**Evaluation Scope:** Codebase inspection, unit test suites, and architecture validation of the private Vigilo project workspace.

---

## 1. Prototype Overview

Vigilo is an autonomous road incident intelligence and emergency response platform built as a native Android application. It functions as an on-device, local-first safety companion that monitors driving dynamics using built-in smartphone sensors, evaluates potential collision events via multi-stage sensor fusion and machine learning, manages a zero-touch alert and escalation workflow, cryptographically seals forensic evidence, and generates structured incident reports.

---

## 2. Verified Capability Matrix

To maintain rigorous technical integrity, capabilities in this document are strictly classified into:
* **Completed (Verified in Implementation):** Fully implemented in native code and covered by tests or functional services.
* **Partially Implemented (Architectural Constraint / Dependent):** Core implementation exists, but specific sub-features are constrained by hardware access or deliberate trade-offs.
* **Simulated (Safety Precaution):** Implemented as a user interface simulation to prevent hazardous real-world side effects during evaluation.
* **Requires Physical Validation:** Code and logic exist, but empirical validation on full-scale crash hardware or diverse OEM fleets is pending.

| Capability | Category | Implementation Verification | Verification Evidence |
| :--- | :--- | :--- | :--- |
| **High-Frequency IMU Sampling** | Completed | 50Hz continuous triaxial accelerometer and gyroscope sampling via `SensorManager`. | `SensorCollector.kt`, `CircularSensorBuffer.kt` |
| **Multi-Stage Sensor Fusion Engine** | Completed | 9-dimensional physics engine: gravity low-pass filtering, linear acceleration, jerk ($da/dt$), peak baseline delta, rotational anomaly, and post-impact standstill evaluation. | `SensorFusionEngine.kt`, `SensorFusionEngineTest.kt` |
| **Mounting Profile Calibration** | Completed | Calibrated threshold presets for `CAR_MOUNTED` (4.5G), `TWO_WHEELER_MOUNTED` (5.5G), and `IN_POCKET_OR_BAG` (3.5G). | `SensorFusionEngine.kt`, `MountingProfile.kt` |
| **Foreground Drive Monitoring Service** | Completed | Persistent Android `LifecycleService` with `FOREGROUND_SERVICE_LOCATION` and `FOREGROUND_SERVICE_CAMERA`, high-priority notifications, and wake lock. | `DriveMonitoringService.kt`, `AndroidManifest.xml` |
| **Emergency Alert Countdown & Dismissal** | Completed | Full-screen pulsing alert with 10-second countdown (configurable 5–30s), audible warning beeps, haptics, and response options: *"I'm OK"*, *"False Alarm"*, and *"I Need Help"*. | `ImpactAlertScreen.kt`, `ImpactAlertViewModel.kt`, `ImpactAlertFlowTest.kt` |
| **Hands-Free Voice Commands** | Completed | Speech recognition using Android `SpeechRecognizer` (`EXTRA_PREFER_OFFLINE = true`) listening for *"I'm okay"* or *"I need help"* without manual touch. | `VoiceEmergencyRecognizer.kt` |
| **Bystander Alert Mode** | Completed | High-visibility emergency UI for first responders/passers-by with strobe camera flashlight (200ms pulse), audible alert tone, GPS coordinates, and street address. | `BystanderAlertScreen.kt`, `VideoEvidenceCollector.kt` |
| **Automated SOS SMS Dispatch** | Completed | Background multi-part SMS dispatch via Android `SmsManager` transmitting incident coordinates, reverse-geocoded address, and Google Maps link to up to 5 emergency contacts. | `ImpactAlertViewModel.sendEmergencySms` |
| **Cryptographic Evidence Sealing** | Completed | Hardware-backed digital signature via Android Keystore (`AndroidKeyStore`, ECDSA key pair with `SHA256withECDSA`) signing canonical telemetry string and video digest. | `EvidenceAuthenticator.kt` |
| **SHA-256 Video Evidence Hashing** | Completed | Chunked 8KB buffer SHA-256 digest computation of recorded evidence video files to prevent memory exhaustion. | `EvidenceAuthenticator.hashFile` |
| **Interactive Evidence Verification** | Completed | On-device cryptographic signature and digest verification within the Incident Details view, reporting `VERIFIED`, `TAMPERED`, `UNVERIFIED`, or `ERROR`. | `IncidentDetailScreen.kt`, `EvidenceAuthenticator.kt` |
| **Offline-First Incident Persistence** | Completed | Embedded Room SQLite database storing full incident entities, sensor snapshots, location snapshots, and state machine transition histories. | `VigiloDatabase.kt`, `IncidentDao.kt`, `IncidentDaoTest.kt` |
| **Deterministic Factual Incident Reporting** | Completed | Multi-format generator creating deterministic plain text and structured JSON incident reports with clipboard export and Android share sheet. | `ReportViewModel.kt`, `ReportViewModelTest.kt` |
| **On-Device TFLite Crash Inference** | Completed | Embedded TensorFlow Lite model (`vigilo_crash_model.tflite`, 8 normalized inputs) acting as secondary confirmation gate with automatic heuristic fallback. | `CrashDetectionModel.kt`, `VigiloFeatureExtractor.kt` |
| **On-Device False-Alarm Adaptation** | Completed | Adaptive threshold learner nudging decision sensitivity based on user confirmation feedback (+0.015 per false alarm, -0.010 per confirmed crash), persisted across sessions. | `FalseAlarmLearner.kt` |
| **Trip-End Standstill Detection** | Completed | Detects prolonged vehicle stop, displaying an interactive prompt to stop background monitoring and preserve battery life. | `ActiveMonitoringScreen.kt`, `MonitoringRepositoryImpl.kt` |
| **Post-Impact Video Recording (No Audio)** | Partially Implemented | CameraX `VideoCapture` records post-impact MP4 clips. Audio recording is deliberately disabled because `VoiceEmergencyRecognizer` requires exclusive microphone access during the alert countdown. | `VideoEvidenceCollector.kt` |
| **AI-Assisted Incident Advisory Narrative** | Partially Implemented | Google Gemini API (`gemini-3.6-flash`) generates structured collision advisory narrative. Strictly non-authoritative; operates with deterministic offline fallback when disconnected. | `AiRepositoryImpl.kt`, `GeminiApiService.kt` |
| **Emergency Helpline Calling Workflow** | Simulated | 4-button emergency dispatch grid (Police 100, Ambulance 108, Highway 1033, Traffic Helpline 1073) launches a simulated in-app call screen with timer. Real cellular calls are not placed. | `ImpactAlertViewModel.startMockEmergencyCall`, `AssistanceRequiredScreen.kt` |
| **Physical Automotive Crash Validation** | Requires Validation | Validated in Robolectric test suites, mathematical shock simulations, and physical device drop scenarios. Physical vehicle barrier crash testing has not been conducted. | `SensorFusionEngineTest.kt` |

---

## 3. Known Limitations

1. **Smartphone Hardware Boundaries:** Smartphone accelerometers and gyroscopes are not hardwired to vehicle chassis or CAN bus systems. Detection accuracy depends on phone mounting rigidity.
2. **Audio Concurrency Restriction:** Android audio subsystem limitations prevent concurrent microphone capture by CameraX video recording and `SpeechRecognizer`. Vigilo prioritizes driver voice commands over video audio.
3. **No Automatic Emergency Services Calling:** Automatic cellular dialling of government emergency numbers (e.g., 112/911) is intentionally avoided due to strict legal liabilities, regulatory compliance, and false-alarm prevention. Emergency SMS is sent only to pre-registered personal contacts.
4. **Advisory AI Boundaries:** Gemini AI summaries are advisory only and clearly isolated from the deterministic, immutable sensor data to preserve forensic integrity.

---

## 4. Demonstration Readiness

* **Demonstration Mode:** Vigilo includes an explicit "Test Safety Alert Flow" within the drive cockpit to exercise the full end-to-end incident lifecycle without requiring real vehicle motion.
* **Live Sensor Diagnostics:** A real-time sensor diagnostics screen enables visual inspection of raw 3-axis accelerometer and gyroscope streams, G-force calculations, and buffer saturation.
