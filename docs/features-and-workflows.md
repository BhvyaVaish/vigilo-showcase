# Features & Workflows Specification

This document details every core capability implemented or prototyped within the **Vigilo** platform, outlining its operational purpose, interaction model, dependencies, implementation status, and known limitations.

---

## 1. Incident Alert Countdown & Multi-Modal Cancellation

* **Purpose:** Provides a critical verification window (default 10 seconds, configurable 5–30s) following suspected collision kinematics, preventing unconfirmed telemetry anomalies from triggering emergency notifications.
* **User Interaction:**
  * Screen transforms into a full-screen, pulsing red alert with audible alarm tones and haptic pulsing.
  * Driver can tap one of three buttons:
    1. **"I'm OK"** (Dismisses alert, records incident as user-confirmed safe).
    2. **"False Alarm"** (Dismisses alert, logs event as non-crash, feeds telemetry to online learning engine).
    3. **"I Need Help"** (Immediately terminates countdown and escalates to Emergency Assistance).
  * Alternatively, driver speaks hands-free commands.
* **Expected Behaviour:** If the timer reaches zero with no input (touch or speech), the system autonomously classifies the incident as `TIMEOUT_NO_RESPONSE` and escalates to Emergency Assistance.
* **Dependencies:** `VibrationEffect`, `ToneGenerator`, `NotificationManager` (Full-Screen Intent).
* **Implementation Status:** **Completed (Verified).**
* **Known Limitations:** If the phone is thrown from its mount and screen damaged during impact, physical touch is impossible (relying entirely on timeout escalation).

---

## 2. Hands-Free Voice Emergency Commands

* **Purpose:** Enables trapped, pinned, or physically incapacitated drivers to dismiss false alarms or request emergency dispatch without manual touch.
* **User Interaction:** Driver speaks clearly during the 10-second alert window.
* **Expected Behaviour:**
  * Utterances containing *"I'm okay"*, *"okay"*, or *"I am fine"* trigger `onImOkClicked()`.
  * Utterances containing *"help"*, *"I need help"*, *"emergency"*, or *"send help"* trigger `onNeedHelpClicked()`.
  * Real-time recognition status is shown on the UI banner.
* **Dependencies:** Android `SpeechRecognizer` (`android.speech.SpeechRecognizer`) configured with `EXTRA_PREFER_OFFLINE = true`.
* **Implementation Status:** **Completed (Verified).**
* **Known Limitations:** In-cabin acoustic interference (deploying airbags, shattering glass, loud music, engine noise) may degrade voice recognition accuracy.

---

## 3. Bystander Alert Mode

* **Purpose:** Alerts passers-by, other motorists, and first responders to the presence of an injured driver at night or in low-visibility environments.
* **User Interaction:** Launched automatically on countdown expiration or via manual selection from the Emergency Assistance screen.
* **Expected Behaviour:**
  * Screen pulses in high-visibility amber/yellow with high-contrast typography ("SOS — EMERGENCY").
  * Displays precise GPS coordinates and reverse-geocoded street address.
  * Camera flashlight strobes rapidly (200ms ON / 200ms OFF cycle).
  * Plays audible siren to attract nearby attention.
* **Dependencies:** `CameraManager` (Torch Mode), `AudioManager`, `LocationTracker`.
* **Implementation Status:** **Completed (Verified).**
* **Known Limitations:** Sustained flashlight strobing increases thermal load and accelerates battery depletion.

---

## 4. Emergency Contact SMS & Location Dispatch

* **Purpose:** Directly informs trusted family members, colleagues, or fleet operators with actionable location telemetry when an accident occurs.
* **User Interaction:** Triggered automatically upon alert timeout or immediate "I Need Help" selection.
* **Expected Behaviour:** Background multi-part SMS messages are sent to up to 5 configured contacts containing:
  * Emergency distress notice.
  * Incident GPS coordinates (Latitude, Longitude, Accuracy).
  * Reverse-geocoded street address (if network geocoder available).
  * Direct Google Maps hyperlink: `https://maps.google.com/?q={lat},{lng}`.
* **Dependencies:** Android `SmsManager` (`SEND_SMS` permission).
* **Implementation Status:** **Completed (Verified).**
* **Known Limitations:** Requires active cellular SMS coverage and credit; cannot transmit if the mobile radio is out of carrier coverage.

---

## 5. Emergency Helpline Calling Workflow (Simulated)

* **Purpose:** Provides a rapid interface to dial emergency authorities (Police, Ambulance, Highway Patrol).
* **User Interaction:** User taps one of the dispatch buttons in the emergency grid (112, 100, 108, 1033).
* **Expected Behaviour:** The application opens an in-app simulated call screen showing connection status and duration timer.
* **Dependencies:** In-app state management (`ImpactAlertViewModel`).
* **Implementation Status:** **Simulated (By Design).**
* **Design Rationale:** Real autonomous or automatic cellular dialing of public safety answering points (PSAPs) without strict national telecommunications certification violates telecommunications regulations in most jurisdictions and creates hazardous false-dispatch risks during testing.

---

## 6. Hybrid False-Alarm Reduction: Heuristics & TFLite Model

* **Purpose:** Distinguishes genuine high-energy collisions from benign driving events (potholes, speed bumps, hard braking, curb bumps, and phone drops).
* **Algorithm & Pipeline:**
  1. **Heuristic Pre-Filter:** 9-dimensional kinematic analysis requires a multi-axis acceleration spike, sustained angular rate surge, and post-impact standstill.
  2. **TFLite Model Gating:** Embedded 8-feature neural network (`vigilo_crash_model.tflite`) evaluates:
     * `peak_g`, `gyro_magnitude`, `jerk`, `rolling_max_g`, `rolling_std_acc`, `speed_norm`, `motion_intensity_norm`, and `gyro_acc_cross`.
  3. **On-Device Online Learner (`FalseAlarmLearner`):** Adjusts decision threshold based on user feedback (+0.015 per false alarm, -0.010 per confirmed crash), persisted across app restarts.
* **Dependencies:** `org.tensorflow:tensorflow-lite:2.16.1`.
* **Implementation Status:** **Completed (Verified).**
* **Known Limitations:** The TFLite model is trained on simulated and proxy telemetry; full automotive validation across extensive real-world fleet mileage is required for production certification.

---

## 7. Offline-First Incident Persistence

* **Purpose:** Guarantees that all telemetry snapshots, location fixes, and timeline events are preserved even in remote areas with zero network connectivity.
* **User Interaction:** Automatic background persistence; accessible via the Incident History screen.
* **Expected Behaviour:** Stores complete incident data in a local SQLite database using Room:
  * Peak acceleration, gyro, jerk, timestamps, mounting profile.
  * Hardware Keystore signature and SHA-256 video hash.
  * Degraded state flags and geocoded coordinates.
* **Dependencies:** AndroidX Room (`androidx.room:room-ktx:2.7.0`), SQLite.
* **Implementation Status:** **Completed (Verified).**
* **Known Limitations:** Local storage is bound to the physical device; device destruction during catastrophic fire or total hardware crush would prevent recovery unless off-device sync is implemented.

---

## 8. Cryptographic Evidence Sealing & SHA-256 Verification

* **Purpose:** Protects post-incident telemetry from retrospective alteration, ensuring integrity for insurance adjudication, police reports, and legal claims.
* **Architecture:**
  1. **Hardware Keystore:** Generates an asymmetric elliptic curve key pair (`KeyProperties.KEY_ALGORITHM_EC`) in the Android Hardware Keystore (TEE / StrongBox).
  2. **Canonical String Construction:** Formats key facts into an immutable string: `ID|TIME|STATE|LAT|LNG|PEAK_G|JERK|VIDEO_HASH`.
  3. **ECDSA Digital Signature:** Signs the canonical string using `SHA256withECDSA`.
  4. **Video Hashing:** Computes chunked SHA-256 digest (8KB buffers) of the recorded video file.
  5. **Interactive Verification:** Within Incident Details, user taps "Verify All Evidence"; system recalculates the digest and verifies the digital signature with the public key.
* **Dependencies:** `java.security.KeyStore`, `java.security.Signature`, `MessageDigest`.
* **Implementation Status:** **Completed (Verified).**
* **Known Limitations:** A valid digital signature confirms data integrity against post-event modification; it does not independently verify external environmental facts or sensor hardware accuracy.

---

## 9. Post-Impact Video Evidence Capture

* **Purpose:** Records short visual evidence following impact to capture vehicle positions, road conditions, and third-party participants.
* **User Interaction:** Automatically initiated by the background service upon transition to `POSSIBLE_IMPACT`.
* **Expected Behaviour:** CameraX `VideoCapture` binds to the back camera and writes an MP4 file to `DIRECTORY_MOVIES/Vigilo`.
* **Dependencies:** AndroidX CameraX (`androidx.camera:camera-video:1.5.0`).
* **Implementation Status:** **Partially Implemented (Video Only; Audio Deliberately Disabled).**
* **Architectural Constraint:** Android hardware limits concurrent audio recording access. Camera audio is disabled to reserve the microphone exclusively for `VoiceEmergencyRecognizer` during the 10-second alert window.

---

## 10. Deterministic Incident Reporting & AI Advisory Narrative

* **Purpose:** Generates exportable, factual summaries of the incident for legal, insurance, or personal records.
* **Format Options:**
  1. **Deterministic Text Report:** Formatted ASCII summary documenting telemetry, timestamps, mounting profiles, and disclaimers.
  2. **Structured JSON Report:** Normalized machine-readable schema for insurance claim integration.
* **AI Advisory Layer:** Google Gemini API (`gemini-3.6-flash`) generates an advisory collision overview and timeline.
* **Strict Principle:** Raw telemetry is immutable. The AI narrative is strictly advisory and marked non-authoritative.
* **Dependencies:** Retrofit 2.12.0, Moshi 1.15.2, Google Gemini API.
* **Implementation Status:** **Completed (Verified) with graceful offline fallback.**
