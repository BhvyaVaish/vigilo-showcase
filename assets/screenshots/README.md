# Application Screenshot Acquisition Guide

This repository documents the verified user interfaces of **Vigilo**. To maintain strict authenticity, **no synthetic mockups, stock photography, or fabricated UI graphics are permitted** in this repository.

This document provides a comprehensive checklist of real application screens to capture on a physical Android device or emulator, along with exact capture commands and privacy guidelines.

---

## 1. Screenshot Capture Instructions

### Option A: Via Android Debug Bridge (ADB) — Recommended for Clean Output

Connect your device via USB with USB Debugging enabled, and execute the following command from PowerShell or terminal:

```powershell
# Example: Capturing the Active Drive Cockpit
adb exec-out screencap -p > assets/screenshots/02_active_drive_cockpit.png
```

### Option B: On-Device Hardware Keys

1. Press **Power + Volume Down** simultaneously.
2. Transfer screenshots to your development machine:
   ```powershell
   adb pull /sdcard/Pictures/Screenshots/ assets/screenshots/
   ```

---

## 2. Screenshot Checklist & Specifications

| # | Screen Name | Suggested Filename | Desired Application State | Required Visible Elements | Mandatory Exclusions (Must Be Hidden) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **Main Dashboard / Launch** | `01_home_dashboard.png` | Idle state before drive start. | "Start Drive Mode" button, mounting profile selector (`CAR_MOUNTED`, `TWO_WHEELER_MOUNTED`, `IN_POCKET_OR_BAG`), recent activity status. | Hide any personal account identifiers or private build metadata. |
| **02** | **Active Drive Cockpit** | `02_active_drive_cockpit.png` | Drive monitoring active. | Real-time G-force gauge, vehicle GPS speed indicator, peak G metric, session timer, "Test Safety Alert Flow" button. | Ensure realistic demo speeds; do not display sensitive route locations. |
| **03** | **Sensor Diagnostics** | `03_sensor_diagnostics.png` | Live sensor diagnostics screen open. | 3-axis Accelerometer & Gyroscope real-time readouts, sampling frequency (50Hz), buffer capacity gauge. | None. |
| **04** | **Impact Alert Countdown** | `04_impact_countdown_alert.png` | Active emergency alert triggered (via test button or shock). | Pulsing high-contrast alert card, 10-second countdown timer, Confidence Tier badge (HIGH), plain-language trigger reason, *"I'm OK"*, *"False Alarm"*, and *"I Need Help"* action buttons, voice command prompt. | None. |
| **05** | **Emergency Assistance** | `05_emergency_assistance.png` | Alert escalated (countdown timeout or "I Need Help"). | Incident GPS coordinates, reverse-geocoded mock street address, measured impact telemetry (Peak G, Jerk), "Send Real SOS SMS" action, simulated emergency dispatch calling grid. | Mask or use simulated phone numbers for emergency contacts; do not expose real personal phone numbers. |
| **06** | **Bystander Alert Mode** | `06_bystander_alert_mode.png` | Bystander SOS screen active. | High-visibility amber screen, bold "SOS — EMERGENCY" headline, incident location coordinates, strobe torch active indicator, "Call Emergency Services" button. | Mask private home addresses if testing locally. |
| **07** | **Incident History** | `07_incident_history.png` | History screen with recorded incidents. | Incident summary statistics (Total Logs, High-Confidence Impacts, Confirmations), filter chips (`All`, `High`, `Medium`, `Low`), search bar, incident card items. | None. |
| **08** | **Incident Details & Vault** | `08_incident_details_vault.png` | Detailed incident inspection. | Chronological timeline, telemetry values (peak G, gyro, jerk), post-impact stillness flag, cryptographic evidence status banner showing **`VERIFIED`**. | None. |
| **09** | **Deterministic Report** | `09_deterministic_report.png` | Report viewing & export screen. | Format toggle (Factual Text vs Structured JSON), structured document header, telemetry breakdown, advisory AI narrative block, copy/share buttons. | None. |
| **10** | **Settings & Contacts** | `10_emergency_settings.png` | Settings configuration screen. | Countdown duration slider (5–30s), bystander alert toggle, DND override switch, emergency contacts list view. | Ensure contact phone numbers shown are test/placeholder numbers (e.g., +91 98765 00000). |

---

## 3. Privacy & Sanitization Checklist

Before saving screenshots to `assets/screenshots/`:
- [ ] Confirm no real personal home addresses or sensitive coordinates are visible in location fields.
- [ ] Confirm no real personal phone numbers of friends or family are visible in contact lists.
- [ ] Confirm no personal notifications (WhatsApp, email, messaging) appear in the Android status bar. Use Android System UI Demo Mode if necessary:
  ```powershell
  adb shell settings put global sysui_demo_allowed 1
  adb shell am broadcast -a com.android.systemui.demo -e command enter
  adb shell am broadcast -a com.android.systemui.demo -e command clock -e hhmm 1200
  adb shell am broadcast -a com.android.systemui.demo -e command battery -e level 100 -e plugged false
  adb shell am broadcast -a com.android.systemui.demo -e command network -e wifi show -e level 4 -e mobile show -e datatype lte -e level 4
  adb shell am broadcast -a com.android.systemui.demo -e command notifications -e visible false
  ```
- [ ] Exit demo mode when finished:
  ```powershell
  adb shell am broadcast -a com.android.systemui.demo -e command exit
  ```
