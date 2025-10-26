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
Priority 1: ALLOW TCP 0.0.0.0/0 → 10.0.0.5:80    (HTTP)
Priority 2: ALLOW TCP 0.0.0.0/0 → 10.0.0.5:443   (HTTPS)
Priority 3: ALLOW TCP 192.168.1.0/24 → 10.0.0.5:22 (SSH from internal)
Priority 4: DENY TCP 0.0.0.0/0 → 10.0.0.5:22     (Block external SSH)

### DNS Server Protection
Priority 1: ALLOW UDP 192.168.1.0/24 → 10.0.0.53:53 (Internal DNS)
Priority 2: DENY UDP 0.0.0.0/0 → 10.0.0.53:53      (Block external DNS)

### DMZ Setup
Priority 1: ALLOW TCP 0.0.0.0/0 → 172.16.0.0/24:80  (Public web access)
Priority 2: ALLOW TCP 192.168.1.0/24 → 172.16.0.0/24:0 (Internal full access)
Priority 3: DENY TCP 172.16.0.0/24 → 192.168.1.0/24:0 (DMZ cannot access internal)

## 🔧 Technical Details

### Rule Evaluation Algorithm

1. Rules are sorted by priority (ascending order)
2. Each rule is evaluated sequentially
3. Packet fields are matched against rule conditions:
   - Protocol matching (exact or ANY)
   - Source IP matching (with CIDR support)
   - Destination IP matching (with CIDR support)
   - Port matching (exact or wildcard 0)
4. First matching rule determines the action
5. If no rules match, default DENY policy applies

### CIDR Notation Support

The simulator supports standard CIDR notation:
- `/24` = 255.255.255.0 (Class C network)
- `/16` = 255.255.0.0 (Class B network)
- `/8` = 255.0.0.0 (Class A network)
- `/32` = Single host

## 🎓 Educational Value

This simulator is perfect for:
- **Network Security Students**: Understanding firewall concepts
- **System Administrators**: Testing firewall configurations
- **DevOps Engineers**: Planning security policies
- **Cybersecurity Training**: Hands-on practice with packet filtering

## 🛠️ Built With

- **React** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **JavaScript** - Core logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/firewall-rule-simulation](https://github.com/yourusername/firewall-rule-simulation)

## 🙏 Acknowledgments

- Inspired by real-world firewall systems (iptables, pf, Windows Firewall)
- Educational resources from network security courses
- Community feedback and contributions
