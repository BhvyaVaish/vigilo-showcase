# Limitations & Future Roadmap

This document outlines the known technical and operational limitations of the **Vigilo** prototype, followed by planned architectural enhancements and long-term research possibilities.

No delivery dates, commercial warranties, or deployment promises are made herein.

---

## 1. Current Technical Limitations

### A. Consumer Smartphone Hardware Boundaries
* **Mechanical Decoupling:** Smartphone accelerometers and gyroscopes sense motion within the phone chassis itself. If a device is loosely mounted in a flimsy cradle or rests on a soft seat, physical vehicle collision impulses are dampened, creating false-negative risks.
* **Device Ejection:** In severe rollovers or high-velocity collisions, an unsecured phone may be flung out of the vehicle cabin or destroyed upon impact, interrupting post-impact stillness evaluation and video capture.
* **Sensor Noise & Thermal Drift:** Inexpensive MEMS sensors found in budget smartphones exhibit significant bias drift, temperature sensitivity, and noise floors, requiring wider heuristic threshold bands than industrial automotive accelerometers.

### B. Mobile Operating System Execution Constraints
* **Aggressive OEM Battery Optimization:** Certain Android manufacturers (e.g., custom OEM skins) aggressively terminate background foreground services despite declared wake locks and foreground notifications.
* **Microphone Resource Contention:** Current Android audio subsystems prevent concurrent microphone access by both video recording and speech recognition, forcing the deliberate omission of audio in evidence video files to keep hands-free voice commands operational.

### C. Telecommunications & Cellular Dependability
* **Radio Coverage Gaps:** SMS alert dispatch requires active cellular tower connections. Crashes occurring in deep mountain passes, remote rural hollows, or underground parking structures cannot transmit off-device until signal is re-established.
* **No Direct PSAP Integration:** Prototype alerts are sent exclusively to personal emergency contacts. The system does not interface directly with computer-aided dispatch (CAD) consoles of municipal emergency responders.

---

## 2. Validation Requirements Prior to Production

Before any system derived from this prototype could be safely relied upon in real-world driving environments, the following validation milestones are required:

1. **Empirical Crash Pulse Testing:** Testing mounted phones in controlled sled tests and full-scale automotive crash facilities across multiple impact vectors (frontal, offset, side T-bone, rear, and rollover).
2. **Extensive Fleet Baseline Logging:** Collecting millions of kilometers of benign driving data across diverse vehicle types (hatchbacks, commercial trucks, motorcycles, auto-rickshaws) to statistically quantify false-alarm rates against road irregularities (potholes, rumble strips, railway crossings).
3. **Multi-OEM Hardware Calibration:** Establishing standardized sensor normalization curves across major chipset vendors (Qualcomm Snapdragon, MediaTek Dimensity, Google Tensor).
4. **Third-Party Security & Forensics Audit:** External evaluation of the Android Keystore ECDSA signing implementation and SHA-256 evidence chain of custody by accredited forensic engineers.

---

## 3. Future Roadmap & Possibilities

The following architectural improvements represent planned directions for future research and development:

```
┌────────────────────────────────────────────────────────┐
│                   FUTURE ARCHITECTURE                  │
│                                                        │
│  [OBD-II / BLE Telematics] ──► [On-Device Crash Engine]│
│  [Shared Audio Stream]     ──► [Video + Offline Vosk]  │
│  [EENA / NG911 API Data]   ──► [Public Safety Dispatch]│
│  [P2P Mesh Off-Grid SOS]   ──► [Nearby Motorist Alert] │
└────────────────────────────────────────────────────────┘
```

### 1. Bluetooth Low Energy (BLE) & OBD-II Telematics Integration
* Connect to standard vehicle OBD-II dongles via Bluetooth Low Energy to read speed, engine RPM, airbag status, and sudden brake pressure directly from the vehicle CAN bus.
* Eliminates dependence on phone mounting rigidity and provides definitive physical confirmation of collision events.

### 2. Low-Level Shared Audio Pipeline
* Replace the high-level `SpeechRecognizer` with a unified low-level `AudioRecord` streaming architecture.
* Forks raw PCM audio streams simultaneously to:
  * An embedded, lightweight on-device speech model (e.g., Vosk or whisper.tflite).
  * The CameraX / MediaCodec video evidence container.
* Restores high-fidelity audio evidence without sacrificing hands-free voice commands.

### 3. Standards-Based NG911 / ECall Integration
* Transition beyond generic SMS to standardized emergency telematics protocols (such as EENA / Next Generation 911 CAP XML format) through carrier partnerships.
* Transmits structured vehicle location, fuel type, passenger count, and G-force severity directly into first responder dispatch monitors.

### 4. Off-Grid Mesh Networking (WiFi-Direct / BLE Mesh)
* In zero-cellular zones, broadcast emergency beacons over peer-to-peer WiFi-Direct and BLE mesh to passing vehicles and roadside emergency repeaters.
