# Key Engineering Decisions & Trade-Offs

This document explores five genuine architectural and systems engineering decisions made during the design and development of **Vigilo**, detailing the problem, chosen approach, technical rationale, trade-offs, and future improvements.

---

## Decision 1: Hybrid Sensor Fusion (Physics Heuristics + TFLite Gating) vs. Pure Black-Box ML

### 1. The Problem
Relying exclusively on a deep learning model to detect car crashes from raw sensor streams introduces severe risks:
* Neural networks can behave unpredictably on out-of-distribution inputs (e.g., dropping a phone on a hard floor inside a moving car).
* Running deep models continuously at 50Hz consumes excessive CPU and battery power on mobile hardware.
* Black-box models cannot explain *why* an alert fired, which undermines driver trust during high-stress alerts.

### 2. The Chosen Approach
Vigilo uses a **hybrid multi-stage pipeline**:
1. A deterministic 9-dimensional physics engine (`SensorFusionEngine`) continuously evaluates gravity-filtered linear acceleration, jerk ($da/dt$), rotational surge, and post-impact standstill at 50Hz.
2. An embedded 8-feature TensorFlow Lite model (`vigilo_crash_model.tflite`) acts as a secondary confirmation gate.
3. If the TFLite runtime encounters an exception or missing asset, the system silently falls back to standalone physics heuristics without interrupting drive monitoring.

### 3. Reason for Choosing It
* **Determinism & Explainability:** The system produces human-readable trigger reasons (e.g., *"Peak 4.5G shock with rotational surge and verified post-impact standstill"*).
* **Battery Efficiency:** Heuristic filtering requires trivial CPU cycles; the TFLite interpreter is evaluated only when candidate shock conditions are met.
* **Fail-Safe Reliability:** The mobile app remains fully functional even if ML dependencies fail.

### 4. Trade-Off or Limitation
* Threshold-based heuristics require manual calibration per mounting profile (`CAR_MOUNTED`, `TWO_WHEELER_MOUNTED`, `IN_POCKET_OR_BAG`).
* Unconventional multi-vehicle impacts with unusual deceleration profiles might fall outside hand-tuned heuristic envelopes unless calibrated extensively.

### 5. What Remains to Be Improved
* Incorporate larger empirical fleet datasets to refine multi-axis boundary weights across commercial vehicle classes.
* Implement dynamic auto-calibration that senses phone mount rigidity automatically without manual user profile selection.

---

## Decision 2: Microphone Hardware Contention — Prioritizing Voice Commands over Video Audio

### 1. The Problem
When a collision is detected, Vigilo simultaneously initiates two time-critical actions:
1. It records post-impact video footage of the vehicle surroundings via CameraX.
2. It starts a 10-second emergency alert countdown where the driver can speak hands-free commands (*"I'm okay"* or *"I need help"*).

Under the Android operating system, simultaneous capture of the primary audio input stream by both `CameraX VideoCapture` (with audio enabled) and `android.speech.SpeechRecognizer` creates a severe **hardware resource contention**. In testing, binding audio to the video recorder caused the speech recognizer to throw `ERROR_AUDIO` or crash due to exclusive microphone lock.

### 2. The Chosen Approach
Audio recording was deliberately **disabled in the video evidence pipeline** (`VideoEvidenceCollector.kt`):
```kotlin
// AUDIO DISABLED: We must not bind the microphone here because the VoiceEmergencyRecognizer 
// requires exclusive access to the microphone during the emergency countdown for hands-free commands.
```
Video evidence is recorded as a silent MP4 file, reserving 100% of the microphone hardware for real-time speech recognition during the emergency countdown.

### 3. Reason for Choosing It
* **Life Safety over Media Completeness:** Saving a human life through hands-free verbal false-alarm dismissal or distress escalation is drastically more important than capturing ambient crash audio in the video file.
* A driver pinned in a vehicle cannot tap a screen, making speech recognition life-critical.

### 4. Trade-Off or Limitation
* Evidence video clips lack audio tracks, preventing forensic analysis of horn sounds, verbal exchanges, or tire screeches.

### 5. What Remains to Be Improved
* Implement a shared low-level `AudioRecord` circular audio buffer that forks incoming PCM audio samples to both the video muxer and an on-device Vosk/Whisper speech model simultaneously.

---

## Decision 3: Hardware-Backed Keystore ECDSA Digital Signatures vs. Cloud Attestation

### 1. The Problem
Vehicle crash telemetry (speed, G-force, timestamps, location) is frequently contested in legal liability disputes and insurance claim investigations. If telemetry is stored in plain SQLite or JSON files, an interested party could alter records to falsify speeds or timestamps. Conversely, sending evidence to a central cloud server requires immediate cellular connectivity, which is frequently unavailable at remote crash scenes.

### 2. The Chosen Approach
Vigilo generates an asymmetric Elliptic Curve key pair (`KeyProperties.KEY_ALGORITHM_EC`) inside the **Android Hardware-Backed Keystore** (TEE / StrongBox). Upon incident recording:
1. Key facts are compiled into an immutable canonical string.
2. The video file is digested into a SHA-256 hash.
3. The hardware keystore signs the canonical string and video hash using `SHA256withECDSA`.
4. Verification is performed on-device by checking the digital signature against the hardware public key.

### 3. Reason for Choosing It
* **100% Offline Integrity:** Cryptographic sealing occurs instantly on-device without needing internet connectivity.
* **Tamper Evidence:** Any subsequent modification to latitude, timestamp, peak G, or video bytes invalidates the ECDSA signature.
* **Hardware Isolation:** Private keys never leave the device's secure enclave and cannot be extracted even on rooted devices.

### 4. Trade-Off or Limitation
* The digital signature proves that the stored data matches what the phone recorded at that exact timestamp; it does **not** prove that the phone's accelerometer was calibrated properly or that the device wasn't physically shaken by hand.

### 5. What Remains to Be Improved
* Support exportable X.509 certificate chains allowing independent third-party verification tools (insurance adjusters, judicial authorities) to verify signatures off-device.

---

## Decision 4: Three-Tier Data Model — Strict Isolation of Facts, Derived Dynamics, and AI

### 1. The Problem
Integrating generative AI into emergency systems risks hallucination, legal liability, and false claims of authority. If an AI model summarizes an incident as *"The vehicle was traveling at dangerous speed and caused a collision,"* this could unfairly prejudice legal claims or distort raw telemetry.

### 2. The Chosen Approach
Vigilo strictly enforces a **Three-Tier Data Architecture** across its database models, UI screens, and exportable reports:
1. **Tier 1 — Immutable Facts:** Raw triaxial accelerometer/gyroscope readings, GPS coordinates, hardware timestamps, and SHA-256 hashes. These are never modified.
2. **Tier 2 — Deterministic Calculated Values:** Mathematical derivations produced by fixed formulas (Peak G, Jerk, Speed Drop, Confidence Tier, Post-Impact Stillness).
3. **Tier 3 — Advisory AI Narrative:** Natural-language summaries generated by the Google Gemini API. This narrative is explicitly labeled as **non-authoritative and advisory only** in every report and screen.

### 3. Reason for Choosing It
* Prevents legal jeopardy: An advisory narrative can never override or obscure raw physical facts.
* Maintains user and investigator trust through radical transparency.

### 4. Trade-Off or Limitation
* Exported reports contain structured multi-section text rather than a single simple paragraph.

### 5. What Remains to Be Improved
* Include cryptographic cross-hashing of the AI prompt and response to prove exactly what telemetry was submitted to the AI service.

---

## Decision 5: Simulated Emergency Calling Grid vs. Autonomous Cellular 112/911 Dialing

### 1. The Problem
An autonomous road safety app could theoretically trigger direct phone calls to emergency hotlines (e.g., 112 in India/Europe, 911 in North America) when an alert times out. However:
* Accidental false triggers during development, testing, or benign driving would dispatch real police or ambulances, wasting scarce public emergency resources and committing potential legal offenses.
* Modern mobile OS sandboxes intentionally prohibit silent, non-interactive phone calling to emergency numbers for security reasons.

### 2. The Chosen Approach
Vigilo draws a sharp operational boundary:
1. **Emergency SMS:** Transmitted automatically in the background to pre-authorized **personal emergency contacts** (family, friends), who understand they are receiving alerts from a prototype app.
2. **Emergency Hotlines (112, 100, 108, 1033):** The in-app calling buttons trigger a **simulated calling screen** with a timer. Real cellular calls to emergency authorities are intentionally not placed autonomously.

### 3. Reason for Choosing It
* Eliminates the risk of unlawful or harmful false emergency service dispatches.
* Allows realistic demonstration and testing of the end-to-end incident UI without risking civil penalties.

### 4. Trade-Off or Limitation
* If an incapacitated solo driver has no personal contacts in their phone, public authorities are not notified automatically.

### 5. What Remains to Be Improved
* Integrate with official certified PSAP APIs (such as EENA / Next Generation 911 data messaging) under formal governmental certification and carrier partnerships.
