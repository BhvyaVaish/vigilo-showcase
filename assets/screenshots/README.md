# Vigilo Verified Application Interface Screenshots

This directory contains the verified mobile interface screenshots for the **Vigilo** Android application, captured from a physical device running the application prototype.

---

## Screenshot Catalog

| # | Screen Name | Filename | Format | Key Telematics & Workflow Demonstrated |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Home Dashboard** | `01_home_dashboard.jpg` | JPEG | Telematics launcher, mounting profile selector (`CAR_MOUNTED`, `TWO_WHEELER_MOUNTED`, `IN_POCKET_OR_BAG`), and drive statistics. |
| **02** | **Active Drive Cockpit** | `02_active_drive_cockpit.jpg` | JPEG | Real-time 50Hz sensor fusion HUD, instantaneous G-force gauge, vehicle GPS speed, and safety alert trigger button. |
| **03** | **Live Sensor Diagnostics** | `03_sensor_diagnostics.jpg` | JPEG | Real-time 3-axis accelerometer and gyroscope waveforms, sampling frequency (50Hz), and circular buffer capacity. |
| **04** | **Impact Alert Countdown** | `04_impact_countdown_alert.jpg` | JPEG | 10-second pulsing emergency alert screen, Confidence Tier (`HIGH`), trigger explanation, and *"I'm OK"* / *"False Alarm"* / *"I Need Help"* actions. |
| **05** | **Emergency Assistance** | `05_emergency_assistance.jpg` | JPEG | Incident GPS coordinates, reverse-geocoded location, measured impact dynamics (Peak G, Jerk), and emergency dispatch grid. |
| **06** | **Bystander Alert Mode** | `06_bystander_alert_mode.jpg` | JPEG | High-visibility amber visual emergency screen with camera torch optical strobe (200ms) for night-time roadside first responders. |
| **07** | **Incident History Log** | `07_incident_history.jpg` | JPEG | Local SQLite incident journal with confidence tier filter chips (`All`, `High`, `Medium`, `Low`), search bar, and incident cards. |
| **08** | **Evidence Vault & Details** | `08_incident_details_vault.jpg` | JPEG | Chronological incident timeline and cryptographic evidence status banner displaying **`VERIFIED`** (Hardware Keystore ECDSA signature). |
| **09** | **Deterministic Report** | `09_deterministic_report.jpg` | JPEG | Format toggle (Factual Text vs Structured JSON), structured header, telemetry breakdown, and advisory Gemini AI narrative block. |
| **10** | **Emergency Settings** | `10_emergency_settings.jpg` | JPEG | Countdown duration slider (5–30s), bystander strobe toggle, DND override switch, and emergency contacts list. |

---

## Technical Audit & Compliance Notes

* **Authenticity:** All images represent actual Android runtime rendering from the native Kotlin/Compose codebase. No mockups, stock templates, or synthetic UI elements are used.
* **Resolution:** High-definition portrait captures (~720 × 1530+ px) preserving typography and UI readability.
* **Sanitization:** Emergency contact and location fields reflect test environments, with no sensitive personal credentials or private keys exposed.
