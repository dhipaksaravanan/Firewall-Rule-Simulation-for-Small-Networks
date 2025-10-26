# Firewall Rule Simulator for Small Networks

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourusername/firewall-rule-simulator)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)

A web-based interactive firewall rule simulator designed for educational purposes. Perfect for network administrators, students, and anyone learning about network security and firewall configurations.

![Firewall Simulator Demo](https://via.placeholder.com/800x400?text=Firewall+Simulator+Screenshot)

## ✨ Features

- 🛡️ **Interactive Rule Management** - Add, edit, and delete firewall rules in real-time
- 🎯 **Packet Simulation** - Test network packets against your firewall rules
- 📊 **Priority-based Evaluation** - Rules are evaluated based on priority order
- 🌐 **CIDR Support** - Full support for CIDR notation (e.g., 192.168.1.0/24)
- 💾 **Import/Export** - Save and load firewall configurations as JSON
- ✅ **Visual Feedback** - Clear indication of allowed/denied packets
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/firewall-rule-simulator.git

# Navigate to project directory
cd firewall-rule-simulator

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 📖 Usage

### Creating Firewall Rules

1. Click the **"Add Rule"** button
2. Configure the rule parameters:
   - **Priority**: Lower numbers = higher priority (evaluated first)
   - **Action**: ALLOW or DENY
   - **Protocol**: TCP, UDP, ICMP, or ANY
   - **Source IP**: IP address or CIDR range
   - **Destination IP**: IP address or CIDR range
   - **Port**: Destination port (0 = any port)

### Testing Packets

1. Enter packet details in the **"Test Packet"** section
2. Click **"Simulate Packet"**
3. View the result showing whether the packet was allowed or denied

### Exporting/Importing Rules

- **Export**: Click "Export" to download rules as JSON
- **Import**: Click "Import" and select a JSON file

## 📚 Documentation

- [Firewall Basics](docs/FIREWALL_BASICS.md) - Learn fundamental firewall concepts
- [Configuration Examples](docs/EXAMPLES.md) - Real-world firewall configurations
- [Contributing Guide](CONTRIBUTING.md) - How to contribute to this project

## 🎓 Educational Use Cases

### For Students
- Learn how firewall rules work
- Understand packet filtering
- Practice network security concepts

### For Educators
- Interactive classroom demonstrations
- Hands-on lab exercises
- Visual learning tool

### For Network Administrators
- Test rule configurations before deployment
- Troubleshoot firewall issues
- Document network security policies

## 🔧 Technology Stack

- **Frontend**: React 18.2.0
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Testing**: Jest & React Testing Library

## 📊 Project Structure
