# Systems Architecture & Telematics Design

## 1. High-Level Architecture Overview

Vigilo is structured as a **local-first, reactive Android application** with clean separation between UI presentation, domain business rules, hardware telematics collection, and local persistence.

The architecture emphasizes:
1. **Zero-Latency Sensing:** Continuous 50Hz sensor collection isolated in a dedicated background foreground service.
2. **Determinism:** State machine-driven incident progression preventing race conditions or ambiguous states.
3. **Forensic Integrity:** Hardware-backed cryptographic signing of evidence at the point of capture.
4. **Advisory AI Isolation:** Cloud AI services exist strictly as non-authoritative narrative layers that can never mutate raw telemetry.

```mermaid
graph TD
    subgraph UI_Presentation ["UI Presentation Layer (Jetpack Compose)"]
        A[Active Cockpit & Dashboard]
        B[Impact Alert & Countdown UI]
        C[Bystander Alert Screen]
        D[Incident History & Report View]
    end

    subgraph Domain_Layer ["Domain & State Control"]
        E[Incident State Machine]
        F[Monitoring Repository]
        G[Settings & Contact Repository]
    end

    subgraph Telematics_Core ["Core Telematics & Sensing Engine"]
        H[Drive Monitoring Foreground Service]
        I[Circular Sensor Buffer 50Hz]
        J[Sensor Fusion & Physics Heuristics]
        K[TFLite Crash Classifier & False-Alarm Learner]
        L[Voice Emergency Recognizer]
        M[CameraX Video Evidence Collector]
        N[Evidence Authenticator - Hardware Keystore]
    end

    subgraph Data_Layer ["Data Persistence & External Services"]
        O[(Vigilo Room SQLite Database)]
        P[SharedPreferences - Calibrated Thresholds]
        Q[Android SmsManager - Cellular SOS]
        R[Gemini REST API - Advisory Narrative]
    end

    A --> F
    B --> E
    B --> L
    C --> N
    D --> O
    E --> F
    F --> H
    H --> I
    I --> J
    J --> K
    K --> E
    E --> M
    E --> N
    E --> Q
    N --> O
    D --> R
```

---

## 2. Multi-Stage Sensor Fusion Pipeline

Smartphone sensors experience high ambient noise from engine harmonics, road texture, chassis flexing, and sudden maneuvers. To prevent false triggers while catching genuine impacts, Vigilo implements a multi-stage fusion pipeline:

```mermaid
flowchart TD
    Raw[Raw Accelerometer & Gyroscope 50Hz] --> GravityLPF[Gravity Isolation Low-Pass Filter]
    GravityLPF --> LinearAcc[Linear Acceleration Extraction]
    LinearAcc --> JerkCalc[Jerk Rate Calculation da/dt]
    
    JerkCalc --> Buffer[Circular Buffer Ingestion 50Hz FIFO]
    
    Buffer --> Stage1{Stage 1: Shock Peak >= Profile Trigger Threshold?}
    Stage1 -- No --> Normal[ImpactEvaluationResult.Normal]
    Stage1 -- Yes --> Suspected[ImpactEvaluationResult.Suspected - Stage 1]
    
    Suspected --> Stage2{Stage 2: Gyro Anomaly or Jerk Threshold Exceeded?}
    Stage2 -- No --> Evaporate[Disregard Shock - Vibration Pothole]
    Stage2 -- Yes --> StandstillWindow[Stage 3: 1.5s to 3.0s Standstill Window]
    
    StandstillWindow --> Stage3{Post-Impact Stillness Observed?}
    Stage3 -- Yes --> TFLiteCheck{TFLite Gate & Adaptive Threshold}
    Stage3 -- No --> LowConfidence[Flagged as Ambiguous / Low Confidence]
    
    TFLiteCheck -- Confirmed --> ConfirmedImpact[ImpactEvaluationResult.ConfirmedImpact]
    ConfirmedImpact --> AlertTrigger[Dispatch Alert State to State Machine]
```

### Sensor Fusion Mathematics

1. **Gravity Low-Pass Filter:**
   $$\mathbf{g}_t = \alpha \mathbf{g}_{t-1} + (1 - \alpha) \mathbf{a}_{raw}, \quad \text{where } \alpha = 0.8$$
2. **Linear Acceleration:**
   $$\mathbf{a}_{linear} = \mathbf{a}_{raw} - \mathbf{g}_t$$
3. **Jerk ($da/dt$):**
   $$J_t = \frac{|\mathbf{a}_{linear, t}| - |\mathbf{a}_{linear, t-1}|}{\Delta t}$$
4. **Post-Impact Stillness Verification:**
   Evaluates linear acceleration variance ($\sigma^2$) across a 1.5s–3.0s rolling post-impact window to differentiate catastrophic stops from brief pothole impacts where driving immediately continues.

---

## 3. Incident Lifecycle State Machine

Incident progression is managed by a deterministic finite state machine (`IncidentStateMachine.kt`), strictly enforcing valid transitions to prevent state corruption:

```mermaid
stateDiagram-v2
    [*] --> IDLE
    IDLE --> MONITORING : Start Drive Mode
    MONITORING --> IDLE : Stop Monitoring
    MONITORING --> POSSIBLE_IMPACT : Sensor Fusion Trigger
    
    POSSIBLE_IMPACT --> AWAITING_USER : Alert Countdown Active
    
    AWAITING_USER --> USER_CONFIRMED_OK : Tap "I'm OK" / Voice "I'm OK"
    AWAITING_USER --> FALSE_ALARM : Tap "False Alarm"
    AWAITING_USER --> ASSISTANCE_REQUIRED : Tap "I Need Help" / Voice "Help" / Timeout
    
    FALSE_ALARM --> MONITORING : Feedback Stored -> Resume Monitoring
    
    USER_CONFIRMED_OK --> EVIDENCE_PRESERVATION : Seal Sensor Telemetry
    ASSISTANCE_REQUIRED --> EVIDENCE_PRESERVATION : Seal Telemetry & Trigger Video
    
    EVIDENCE_PRESERVATION --> REPORT_READY : Cryptographic Digest Generated
    REPORT_READY --> COMPLETED : Document Exported / Saved
    COMPLETED --> MONITORING : Return to Cockpit
```

---

## 4. Cryptographic Evidence Integrity Flow

Vigilo preserves forensic integrity by creating a tamper-evident cryptographic seal around post-impact telemetry:

```mermaid
sequenceDiagram
    autonumber
    participant App as Vigilo Background Service
    participant Keystore as Android Keystore (TEE/StrongBox)
    participant Storage as Local Storage / Room DB
    participant Verifier as Interactive Verifier (UI)

    App->>App: Calculate canonical data string (ID, Timestamp, Coordinates, Peak G, Jerk)
    App->>App: Stream video file in 8KB chunks -> Calculate SHA-256 hash
    App->>Keystore: Request ECDSA signature over canonical data + SHA-256 video hash
    Keystore-->>App: Return Base64-encoded digital signature
    App->>Storage: Store Incident record + Signature + Hash
    
    Note over Verifier, Storage: Post-Incident Forensics / Court Verification
    Verifier->>Storage: Load Incident record, video file, and signature
    Verifier->>Verifier: Re-hash video file & rebuild canonical string
    Verifier->>Keystore: Verify signature using public key
    Keystore-->>Verifier: Signature Match Confirmed (VERIFIED)
```

---

## 5. Background Execution & Resource Management

Operating continuous 50Hz sensor collection in modern Android environments requires compliance with aggressive platform power-management rules:

* **Foreground Service Architecture:** `DriveMonitoringService` runs as an Android `LifecycleService`, declaring foreground service types `location` and `camera` (`FOREGROUND_SERVICE_LOCATION | FOREGROUND_SERVICE_CAMERA`) to comply with Android 14+ requirements.
* **Persistent Notification:** Surfaces ongoing monitoring status, mounting profile, and immediate emergency controls in the notification drawer.
* **Partial WakeLock Management:** Utilizes a power wake lock during active drives to prevent the CPU from entering deep sleep states (Doze mode) while vehicle telemetry is being monitored.
* **Graceful Degradation:** If camera permissions or GPS fixes are lost during driving, the system raises internal degraded-state flags (`degradedStateFlags`) rather than crashing, continuing core IMU collision monitoring uninhibited.
