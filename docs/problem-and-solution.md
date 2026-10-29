# Problem & Solution Overview

## 1. The Real-World Problem Space

Road incidents remain among the most dangerous events encountered in daily civilian life. When a vehicular collision occurs, the outcome for victims often depends not merely on the structural integrity of the vehicle, but on the speed and precision with which critical information reaches emergency contacts and first responders.

In current everyday driving environments, three acute operational failure points frequently recur:

### A. The Acute Agency Gap (Incapacitation)
Following severe deceleration, vehicle rollover, or physical trauma, drivers and passengers frequently experience shock, disorientation, concussions, or loss of consciousness. In this acute window, the individual is physically incapable of unlocking a mobile device, dialing emergency numbers, or articulating their precise coordinates. 

### B. The Ambiguity of Generic Emergency Features
While modern mobile operating systems include generic "SOS" shortcuts (such as pressing the power button five times), these mechanisms require manual user agency and are completely disconnected from driving dynamics. Conversely, high-end automotive crash telematics systems (e.g., European eCall or proprietary OnStar implementations) require dedicated factory-installed telematics boxes and CAN-bus integration—hardware that is absent in older vehicles, budget passenger cars, and the vast majority of two-wheelers (motorcycles, scooters, and mopeds).

### C. The Post-Incident Forensic Vacuum
Following an incident, disputes over factual dynamics (speed at impact, direction of force, sudden deceleration, and pre-impact trajectory) routinely delay insurance claims, dispute resolutions, and law enforcement inquiries. Eyewitness memory is notoriously inaccurate under trauma, and budget consumer dashcams either overwrite video loops, fail to seal footage against digital tampering, or are destroyed without transmitting off-device alerts.

---

## 2. Intended Users & Personas

Vigilo is designed for users who operate on roadways without expensive built-in telematics hardware:

1. **Daily Commuters & Solo Drivers:** Motorists who regularly drive alone on urban bypasses, ring roads, and rural corridors where immediate bystander discovery cannot be guaranteed.
2. **Two-Wheeler Riders (Motorcycles & Scooters):** Road users exposed to disproportionate physical vulnerability and sudden orientation changes. Two-wheeler riders benefit critically from autonomous fall and impact triggers that do not require finding a phone in a pocket or jacket.
3. **Logistics & Delivery Contractors:** Gig-economy drivers and courier couriers operating extended hours under fatigue, where rapid logging and emergency contact coordination are occupational hazards.
4. **Families & Caregivers:** Providing peace of mind through automated, deterministic SMS dispatch to predefined personal emergency contacts when an alert is unacknowledged.

---

## 3. The Proposed Solution: Connected Mobile Telematics

Vigilo turns an ordinary consumer Android smartphone into a self-contained, local-first safety telematics terminal.

```
┌─────────────────────────────────────────────────────────────┐
│                       VIGILO PIPELINE                       │
│                                                             │
│   DETECT  ───►  ALERT  ───►  PRESERVE  ───►  DOCUMENT       │
│  (50Hz IMU)   (10s Count)   (Keystore)     (Deterministic)  │
└─────────────────────────────────────────────────────────────┘
```

The system operates across four coordinated stages:

1. **Autonomous Detection (Detect):** A background service samples triaxial accelerometers and gyroscopes at 50Hz, applying gravity isolation and multi-stage physics heuristics to evaluate impact shocks, rotational surges, and subsequent vehicle standstill.
2. **Zero-Touch Escalation (Alert):** When suspected impact telemetry exceeds profile thresholds, Vigilo triggers a high-contrast 10-second countdown. The user can cancel false alarms verbally (*"I'm okay"*) or via touch. If unacknowledged, Vigilo autonomously escalates to emergency contact notification and bystander signaling.
3. **Cryptographic Preservation (Preserve):** Telemetry vectors, GPS snapshots, and post-impact camera footage are locked and digitally signed using the Android Hardware Keystore (ECDSA with SHA-256) to ensure tamper-proof forensic admissibility.
4. **Structured Accounting (Document):** Factual sensor records are compiled into deterministic plain text and JSON reports, supplemented by non-authoritative advisory AI narratives for insurance and roadside review.

---

## 4. Architectural Boundaries & Realistic Limitations

To prevent dangerous over-reliance, Vigilo's design explicitly rejects unrealistic marketing claims:

* **Best-Effort Safety Aid, Not Guaranteed Protection:** Smartphone-only sensing cannot monitor airbag deployment triggers, seatbelt tensioners, or structural vehicle deformation. It is an algorithmic safety net, not an industrial life-safety system.
* **No Direct Emergency Service Replacement:** Vigilo does not automatically dial 112, 911, or 999. Inadvertent automated calls to public emergency switchboards create severe operational burdens and legal liabilities. Vigilo transmits SMS notifications exclusively to pre-authorized private emergency contacts, while presenting a rapid one-touch dialing interface to human bystanders.
* **Separation of Factual Data and AI:** Artificial intelligence (Gemini) is strictly restricted to generating human-readable narrative explanations. It has zero authority over whether a crash occurred and never assigns legal liability.
