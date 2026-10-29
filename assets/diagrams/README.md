# Vigilo System Architecture Diagrams

This directory documents the structural, data-flow, and lifecycle diagrams for the **Vigilo** platform.

To ensure long-term maintainability, full text-searchability, and zero asset-breakage across GitHub and standard Markdown readers, all diagrams in the Vigilo showcase repository are authored using **standard Mermaid markup** directly within markdown documents.

---

## Catalog of System Diagrams

The following primary diagrams are maintained in `docs/architecture.md`:

1. **High-Level System Topology:** Illustrates the interactions between the Android Hardware Layer (Sensors, GPS, Camera, Keystore), the Vigilo Core Services (Sensor Fusion, TFLite Model, State Machine, Security), the Data Persistence Layer (Room Database), and External Interfaces (SMS Gateway, Gemini AI).
2. **Incident State Machine Lifecycle:** Complete state transition graph illustrating valid paths from `IDLE` through `MONITORING`, `POSSIBLE_IMPACT`, `AWAITING_USER`, user resolution paths (`USER_CONFIRMED_OK`, `FALSE_ALARM`, `ASSISTANCE_REQUIRED`), `EVIDENCE_PRESERVATION`, `REPORT_READY`, and back to `MONITORING`.
3. **Multi-Stage Sensor Fusion Pipeline:** Detailed sequence flow diagram showing how raw 50Hz triaxial IMU streams are passed through low-pass gravity filtering, high-pass linear acceleration, jerk calculation, circular buffer baseline analysis, threshold evaluation, and post-impact stillness confirmation.
4. **Hardware Keystore Evidence Integrity Flow:** Flowchart showing the creation of canonical telemetry strings, 8KB chunked SHA-256 video file digests, hardware-backed ECDSA signing via `AndroidKeyStore`, and post-incident verification.

---

## Viewing Diagrams

Diagrams can be viewed and interacted with directly in:
* **Repository Architecture Document:** [`docs/architecture.md`](../../docs/architecture.md)
* **Main Showcase Readme:** [`README.md`](../../README.md)
