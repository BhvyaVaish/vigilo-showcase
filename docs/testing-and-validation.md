# Testing & Validation Evidence

This document reports the verified testing outcomes, observed results, automated test suite performance, and manual verification protocols for **Vigilo**.

To adhere to strict scientific and engineering honesty, **no passing tests, accuracy metrics, or test counts are fabricated**.

---

## 1. Verified Testing Matrix

| Test Area | Test Method | Observed Result | Validation Status |
| :--- | :--- | :--- | :--- |
| **Circular Sensor Buffer FIFO** | JVM Unit Test (`SensorFusionEngineTest.kt`) | Buffer capacity capped at 50; oldest samples evicted correctly; peak acceleration and gyro calculations accurate. | **Verified Passing** |
| **Normal Driving Baseline Filtering** | JVM Unit Test (`SensorFusionEngineTest.kt`) | Standard 1G gravity vectors and minor rotation return `ImpactEvaluationResult.Normal`. | **Verified Passing** |
| **Multi-Stage Impact Detection** | JVM Unit Test (`SensorFusionEngineTest.kt`) | 4.5G shock triggers Stage 1 (`Suspected`), followed by post-impact stillness (1.8s) triggering Stage 3 `ConfirmedImpact` with `HIGH` confidence tier. | **Verified Passing** |
| **Permission Management & Resolution** | JVM Unit Test (`PermissionManagerTest.kt`) | Correctly resolves missing vs granted permissions and generates sequential setup requests. | **Verified Passing** |
| **Location Telemetry Tracker** | JVM Unit Test (`LocationTrackerTest.kt`) | Handles GPS coordinate snapshots and degraded state tracking when fixes are lost. | **Verified Passing** |
| **Emergency Alert Flow Transitions** | Robolectric Framework Test (`ImpactAlertFlowTest.kt`) | State machine transitions from `POSSIBLE_IMPACT` through `USER_OK`, `FALSE_ALARM`, and `ASSISTANCE_REQUIRED`. | **Requires SDK Configuration** *(Robolectric 4.16 runner threw `UnsupportedOperationException` when targeting preview Android API 36)* |
| **Room Incident DAO CRUD Operations** | Robolectric Framework Test (`IncidentDaoTest.kt`) | Insertion, retrieval, and cryptographic signature column mapping in SQLite. | **Requires SDK Configuration** *(Runner failed on API 36 target environment)* |
| **Factual & JSON Report Generation** | Robolectric Framework Test (`ReportViewModelTest.kt`) | Deterministic formatting of sensor telemetry into formatted plain text and JSON. | **Requires SDK Configuration** *(Runner failed on API 36 target environment)* |
| **Hardware Keystore ECDSA Integrity** | Manual Hardware Execution | Generates EC key pair in `AndroidKeyStore`, signs canonical string, and verifies successfully. | **Verified Manually on Device** |
| **Hands-Free Speech Recognition** | Physical Device Microphone Test | Recognizes *"I'm okay"* and *"I need help"* via offline Android `SpeechRecognizer`. | **Verified Manually on Device** |
| **Background SMS Dispatch** | Physical Device SIM Testing | Sends multi-part SMS containing GPS coordinates and Google Maps link to real carrier numbers. | **Verified Manually on Device** |
| **Full-Scale Automotive Barrier Crash** | Physical Crash Facility | High-speed vehicle collision with mounted phone. | **Not Conducted (Simulated Telemetry Only)** |

---

## 2. Automated Gradle Unit Test Execution Report

A local execution of the project unit test suite was conducted via Gradle:

```powershell
.\gradlew.bat testDebugUnitTest
```

### Observed Outcomes
* **Total Executed Tests:** 18
* **Passed Tests:** 12 tests
  * Pure Kotlin / JVM tests (`SensorFusionEngineTest`, `PermissionManagerTest`, `LocationTrackerTest`, `ExampleUnitTest`) executed and passed cleanly.
* **Failed Tests:** 6 tests
  * Framework-dependent tests (`ImpactAlertFlowTest`, `IncidentDaoTest`, `HistoryViewModelTest`, `ReportViewModelTest`, `GreetingScreenshotTest`, `ExampleRobolectricTest`) failed with:
    `java.lang.UnsupportedOperationException at DefaultSdkProvider.java:170`
  * **Root Cause:** The project targets Android API 36 (`compileSdk = 36`, `targetSdk = 36`). Robolectric 4.16.1's default SDK provider does not provide pre-instrumented Android API 36 shadow jars without pinning test configuration to API 34 (`@Config(sdk = [34])`).
  * **Action Required:** Update test annotations in the private repository to specify `@Config(sdk = [34])` for Robolectric suites.

---

## 3. Practical Manual Demonstration Checklist

Evaluators can validate the application prototype manually on an Android device using the following checklist:

### Pre-Requisites
- Android smartphone running Android 7.0 (API 24) or higher (Android 12+ recommended).
- Location (High Accuracy) enabled.
- SMS-capable SIM card with SMS balance (if testing actual text dispatch).
- Microphone access granted.

### Test Procedure

- [ ] **1. Permissions Onboarding:** Launch app for first time. Verify step-by-step permission prompts (Location, Camera, Microphone, SMS, Overlay, Notifications).
- [ ] **2. Contact Setup:** Navigate to Settings -> Emergency Contacts. Add at least one valid test phone number. Set countdown duration to 10 seconds.
- [ ] **3. Start Drive Monitoring:** Tap "Start Drive Mode" -> Select `CAR_MOUNTED` profile -> Tap "Begin Drive Monitoring".
- [ ] **4. Verify Notification:** Check that the persistent foreground service notification appears in the Android notification drawer.
- [ ] **5. Inspect Live Cockpit:** Confirm live G-force reads approximately 1.0G (earth gravity) at rest, and GPS shows locked state.
- [ ] **6. Trigger Simulated Alert:** Tap **"Test Safety Alert Flow"** in the drive cockpit.
- [ ] **7. Observe Alert Screen:**
  - Verify full-screen pulsing red UI appears.
  - Verify audible warning tone and haptic vibration pulse every second.
  - Verify countdown decrements from 10 to 0.
- [ ] **8. Test Response Cancellation:**
  - *Option A (Touch):* Tap "I'm OK". Verify return to cockpit and incident logged as confirmed safe.
  - *Option B (Voice):* Speak *"I'm okay"*. Verify speech recognition status banner acknowledges command and dismisses alert.
- [ ] **9. Test Autonomous Escalation:**
  - Retrigger alert flow and allow timer to expire (0 seconds).
  - Verify automatic transition to Emergency Assistance / Bystander Alert screen.
  - Verify SMS dispatch is triggered.
  - Verify camera flashlight strobes in Bystander Mode.
- [ ] **10. Inspect Evidence Vault:**
  - Navigate to Incident History -> Select latest incident.
  - Tap **"Verify All Evidence"**. Confirm status displays **`VERIFIED`** in green.
  - Tap **"View Factual Report"**. Verify plain text and JSON report generation.
