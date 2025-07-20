# WFH Indicator - Domain Model & Ubiquitous Language

This document serves as the single source of truth for the core domain concepts, entities, and language used across the entire WFH Indicator project.

## Core Entities

#### **WFH Indicator**
- **Definition**: Any device that visually displays the user's work status at the entrance of a room.
- **Subtypes**: `Mobile Indicator`, `LED Indicator`.

#### **Tray App**
- **Definition**: The central control application running on the user's computer. It acts as the "brain" of the system.
- **Responsibilities**: Manages status, communicates with indicators, handles notifications.

#### **Work Status**
- **Definition**: The user's current availability state.
- **Values**:
  - 🔴 `ON_CALL`
  - 🟠 `VIDEO_CALL`
  - 🟡 `FOCUSED`
  - 🟢 `AVAILABLE`
  - 🔵 `AWAY`
  - ⚫️ `OFFLINE`

## Value Objects

#### **Ask to Enter Request**
- **Definition**: A request initiated from an indicator to get the user's attention.
- **Properties**: `timestamp`, `urgency` ('normal' | 'urgent').

#### **Status Response**
- **Definition**: The user's response to an "Ask to Enter" request.
- **Values**: `YES`, `NO`, `IF_URGENT`.

## Key Processes

#### **Pairing Process**
- **Definition**: The process of connecting a new WFH Indicator to the Tray App.
- **Flow (LED Indicator)**: USB Connection → Serial Data Transfer (WiFi credentials) → WebSocket Connection Test.

## Communication API

#### **WebSocket API (Version 1.0)**
- **Endpoint**: `ws://<device_ip>:<port>`
- **Authentication**: A unique token, generated during pairing, must be sent by the indicator upon connection.
- **Messages**:
  - `status_update` (Tray App → Indicator)
  - `ask_to_enter` (Indicator → Tray App)
  - `ask_to_enter_response` (Tray App → Indicator)
  - `battery_report` (Indicator → Tray App)
  - `handshake` (Indicator → Tray App on connect, includes `apiVersion` and `token`)
