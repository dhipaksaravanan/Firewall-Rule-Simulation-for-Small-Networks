# 🛡️ Firewall Rule Simulation for Small Networks

A web-based interactive firewall rule simulator that helps network administrators and students understand how firewall packet filtering works in small networks.

![Firewall Simulator](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/react-18.0+-61dafb.svg)

## 🌟 Features

- **Interactive Rule Management**: Add, edit, and delete firewall rules dynamically
- **Packet Simulation**: Test how packets traverse your firewall rules
- **Priority-based Evaluation**: Rules are processed based on priority order
- **CIDR Support**: Full support for CIDR notation (e.g., 192.168.1.0/24)
- **Protocol Support**: TCP, UDP, ICMP, and ANY protocols
- **Visual Feedback**: Clear visual indicators for ALLOW/DENY decisions
- **Educational Tool**: Perfect for learning network security concepts

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/firewall-rule-simulation.git
cd firewall-rule-simulation
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage

### Creating Firewall Rules

1. Click the **"Add Rule"** button
2. Configure the rule parameters:
   - **Priority**: Lower numbers are evaluated first
   - **Action**: ALLOW or DENY
   - **Protocol**: TCP, UDP, ICMP, or ANY
   - **Source IP**: Use CIDR notation (e.g., 192.168.1.0/24) or 0.0.0.0/0 for any
   - **Destination IP**: Target IP address or range
   - **Port**: Specific port number or 0 for any port

### Testing Packets

1. Fill in the **Test Packet** form:
   - Protocol
   - Source IP
   - Destination IP
   - Destination Port
2. Click **"Simulate Packet"**
3. View the result showing whether the packet is allowed or denied

## 🎯 Example Scenarios

### Web Server Configuration
