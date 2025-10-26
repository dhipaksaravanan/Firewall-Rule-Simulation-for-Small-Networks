# Firewall Configuration Examples

This document provides real-world firewall configuration examples for various network scenarios.

## Table of Contents

1. [Home Network](#home-network)
2. [Small Office Network](#small-office-network)
3. [DMZ Configuration](#dmz-configuration)
4. [Web Server Protection](#web-server-protection)
5. [Database Server Security](#database-server-security)
6. [VPN Gateway](#vpn-gateway)
7. [Guest Network Isolation](#guest-network-isolation)

---

## Home Network

### Scenario
Protect a home network (192.168.1.0/24) with basic internet services.

### Network Layout
Internet (0.0.0.0/0)
↓
Firewall/Router
↓
Home Network (192.168.1.0/24)

### Rules

| Priority | Action | Protocol | Source IP | Dest IP | Port | Description |
|----------|--------|----------|-----------|---------|------|-------------|
| 1 | ALLOW | UDP | 192.168.1.0/24 | 8.8.8.8 | 53 | Allow DNS queries |
| 2 | ALLOW | TCP | 192.168.1.0/24 | 0.0.0.0/0 | 80 | Allow HTTP browsing |
| 3 | ALLOW | TCP | 192.168.1.0/24 | 0.0.0.0/0 | 443 | Allow HTTPS browsing |
| 4 | DENY | TCP | 0.0.0.0/0 | 192.168.1.0/24 | 0 | Block all incoming TCP |
| 5 | DENY | UDP | 0.0.0.0/0 | 192.168.1.0/24 | 0 | Block all incoming UDP |

### Test Cases

**Test 1: Web Browsing**
Protocol: TCP
Source: 192.168.1.10
Destination: 142.250.185.46
Port: 443
Expected: ALLOW (Rule #3)

**Test 2: External SSH Attempt**
Protocol: TCP
Source: 203.0.113.50
Destination: 192.168.1.10
Port: 22
Expected: DENY (Rule #4)

---

## Small Office Network

### Scenario
Office with web server (10.0.0.5), file server (10.0.0.10), workstations (10.0.1.0/24).

### Network Layout
Internet
↓
Firewall
├─ Web Server (10.0.0.5)
├─ File Server (10.0.0.10)
└─ Workstations (10.0.1.0/24)

### Rules

| Priority | Action | Protocol | Source IP | Dest IP | Port | Description |
|----------|--------|----------|-----------|---------|------|-------------|
| 1 | ALLOW | TCP | 0.0.0.0/0 | 10.0.0.5 | 80 | Public web access |
| 2 | ALLOW | TCP | 0.0.0.0/0 | 10.0.0.5 | 443 | Public HTTPS access |
| 3 | ALLOW | TCP | 10.0.1.0/24 | 10.0.0.10 | 445 | Internal file sharing |
| 4 | ALLOW | TCP | 10.0.1.50 | 10.0.0.5 | 22 | Admin SSH access |
| 5 | DENY | TCP | 0.0.0.0/0 | 10.0.0.0/16 | 22 | Block external SSH |
| 6 | ALLOW | UDP | 10.0.1.0/24 | 8.8.8.8 | 53 | DNS for workstations |
| 7 | ALLOW | TCP | 10.0.1.0/24 | 0.0.0.0/0 | 80 | Internet browsing |
| 8 | ALLOW | TCP | 10.0.1.0/24 | 0.0.0.0/0 | 443 | Secure browsing |

### JSON Configuration
```json
[
  {
    "id": 1,
    "action": "ALLOW",
    "protocol": "TCP",
    "srcIp": "0.0.0.0/0",
    "dstIp": "10.0.0.5",
    "port": "80",
    "priority": 1
  },
  {
    "id": 2,
    "action": "ALLOW",
    "protocol": "TCP",
    "srcIp": "0.0.0.0/0",
    "dstIp": "10.0.0.5",
    "port": "443",
    "priority": 2
  },
  {
    "id": 3,
    "action": "ALLOW",
    "protocol": "TCP",
    "srcIp": "10.0.1.0/24",
    "dstIp": "10.0.0.10",
    "port": "445",
    "priority": 3
  }
]
```

---

## DMZ Configuration

### Scenario
Three-zone network: Internet, DMZ (172.16.1.0/24), Internal (10.0.0.0/24).

### Network Layout
Internet (Untrusted)
↓
Firewall
├─ DMZ (172.16.1.0/24)
│   ├─ Web Server (172.16.1.5)
│   └─ Mail Server (172.16.1.6)
└─ Internal (10.0.0.0/24)
├─ Database (10.0.0.10)
└─ Workstations (10.0.0.0/24)

### Rules

| Priority | Action | Protocol | Source IP | Dest IP | Port | Description |
|----------|--------|----------|-----------|---------|------|-------------|
| 1 | ALLOW | TCP | 0.0.0.0/0 | 172.16.1.5 | 80 | Public to DMZ web (HTTP) |
| 2 | ALLOW | TCP | 0.0.0.0/0 | 172.16.1.5 | 443 | Public to DMZ web (HTTPS) |
| 3 | ALLOW | TCP | 0.0.0.0/0 | 172.16.1.6 | 25 | Public to DMZ mail (SMTP) |
| 4 | ALLOW | TCP | 172.16.1.5 | 10.0.0.10 | 3306 | DMZ web to internal DB |
| 5 | DENY | TCP | 172.16.1.0/24 | 10.0.0.0/24 | 0 | Block other DMZ to internal |
| 6 | DENY | TCP | 0.0.0.0/0 | 10.0.0.0/24 | 0 | Block public to internal |
| 7 | ALLOW | TCP | 10.0.0.0/24 | 172.16.1.0/24 | 0 | Internal to DMZ (admin) |
| 8 | ALLOW | TCP | 10.0.0.0/24 | 0.0.0.0/0 | 0 | Internal to internet |

### Security Considerations

- DMZ servers cannot initiate connections to internal network (except specific DB access)
- Internet cannot reach internal network directly
- Internal network can manage DMZ servers
- Each zone has different trust levels

---

## Web Server Protection

### Scenario
Hardened web server accessible only on HTTP/HTTPS with admin access from specific IP.

### Network Layout
Internet
↓
Firewall
↓
Web Server (10.0.0.5)

### Rules

| Priority | Action | Protocol | Source IP | Dest IP | Port | Description |
|----------|--------|----------|-----------|---------|------|-------------|
| 1 | ALLOW | TCP | 0.0.0.0/0 | 10.0.0.5 | 80 | HTTP traffic |
| 2 | ALLOW | TCP | 0.0.0.0/0 | 10.0.0.5 | 443 | HTTPS traffic |
| 3 | ALLOW | TCP | 203.0.113.100 | 10.0.0.5 | 22 | Admin SSH (specific IP) |
| 4 | ALLOW | ICMP | 0.0.0.0/0 | 10.0.0.5 | 0 | Allow ping (monitoring) |
| 5 | DENY | TCP | 0.0.0.0/0 | 10.0.0.5 | 0 | Block all other TCP |
| 6 | DENY | UDP | 0.0.0.0/0 | 10.0.0.5 | 0 | Block all UDP |

### Additional Security

- Implement rate limiting on HTTP/HTTPS
- Use fail2ban for SSH protection
- Enable HTTPS only (redirect HTTP to HTTPS)
- Keep firewall logs for audit

---

## Database Server Security

### Scenario
Database server accessible only from application servers.

### Network Layout
Application Servers (10.0.1.0/24)
↓
Firewall
↓
Database Server (10.0.0.10)

### Rules

| Priority | Action | Protocol | Source IP | Dest IP | Port | Description |
|----------|--------|----------|-----------|---------|------|-------------|
| 1 | ALLOW | TCP | 10.0.1.0/24 | 10.0.0.10 | 3306 | MySQL from app servers |
| 2 | ALLOW | TCP | 10.0.1.0/24 | 10.0.0.10 | 5432 | PostgreSQL from app servers |
| 3 | ALLOW | TCP | 10.0.2.5 | 10.0.0.10 | 22 | Admin SSH from jump box |
| 4 | DENY | TCP | 0.0.0.0/0 | 10.0.0.10 | 0 | Block all other access |

### Best Practices

- Never expose database ports to internet
- Use jump box for administrative access
- Implement database-level authentication
- Regular backup and disaster recovery plan

---

## VPN Gateway

### Scenario
VPN server allowing remote access to internal network.

### Network Layout
Remote Users
↓
VPN Server (203.0.113.10)
↓
Internal Network (192.168.1.0/24)

### Rules

| Priority | Action | Protocol | Source IP | Dest IP | Port | Description |
|----------|--------|----------|-----------|---------|------|-------------|
| 1 | ALLOW | UDP | 0.0.0.0/0 | 203.0.113.10 | 1194 | OpenVPN |
| 2 | ALLOW | UDP | 0.0.0.0/0 | 203.0.113.10 | 500 | IPSec/IKE |
| 3 | ALLOW | UDP | 0.0.0.0/0 | 203.0.113.10 | 4500 | IPSec NAT-T |
| 4 | ALLOW | TCP | 10.8.0.0/24 | 192.168.1.0/24 | 0 | VPN to internal |
| 5 | DENY | TCP | 0.0.0.0/0 | 192.168.1.0/24 | 0 | Block direct access |

### VPN Client Rules

Once connected, VPN clients (10.8.0.0/24) can access internal resources with appropriate rules.

---

## Guest Network Isolation

### Scenario
Isolated guest WiFi network with internet-only access.

### Network Layout
Guest Network (172.16.99.0/24)
Internal Network (192.168.1.0/24)
Both connected to firewall

### Rules

| Priority | Action | Protocol | Source IP | Dest IP | Port | Description |
|----------|--------|----------|-----------|---------|------|-------------|
| 1 | ALLOW | UDP | 172.16.99.0/24 | 8.8.8.8 | 53 | DNS for guests |
| 2 | ALLOW | TCP | 172.16.99.0/24 | 0.0.0.0/0 | 80 | HTTP internet access |
| 3 | ALLOW | TCP | 172.16.99.0/24 | 0.0.0.0/0 | 443 | HTTPS internet access |
| 4 | DENY | TCP | 172.16.99.0/24 | 192.168.1.0/24 | 0 | Block guest to internal |
| 5 | DENY | TCP | 172.16.99.0/24 | 10.0.0.0/8 | 0 | Block private networks |
| 6 | DENY | TCP | 172.16.99.0/24 | 172.16.0.0/12 | 0 | Block private networks |

### Security Goals

- Guests get internet access only
- No access to internal resources
- No access to other guests (client isolation)
- Limited bandwidth (implement separately)

---

## Testing Your Configurations

### Testing Methodology

1. **Positive Testing**: Verify allowed traffic passes
2. **Negative Testing**: Verify blocked traffic is denied
3. **Edge Cases**: Test boundary conditions
4. **Priority Testing**: Verify rule order is correct

### Example Test Plan
Test 1: Web Server HTTP Access

Packet: TCP 0.0.0.0/0 → 10.0.0.5:80
Expected: ALLOW
Actual: ___
Pass/Fail: ___

Test 2: Unauthorized SSH

Packet: TCP 203.0.113.1 → 10.0.0.5:22
Expected: DENY
Actual: ___
Pass/Fail: ___

Test 3: Internal File Sharing

Packet: TCP 10.0.1.5 → 10.0.0.10:445
Expected: ALLOW
Actual: ___
Pass/Fail: ___


---

## Common Mistakes to Avoid

### 1. Rule Order Issues
❌ Wrong:
Priority 1: DENY TCP 0.0.0.0/0 → 10.0.0.5:0
Priority 2: ALLOW TCP 0.0.0.0/0 → 10.0.0.5:80
✅ Correct:
Priority 1: ALLOW TCP 0.0.0.0/0 → 10.0.0.5:80
Priority 2: DENY TCP 0.0.0.0/0 → 10.0.0.5:0

### 2. Overly Broad Rules
❌ Too permissive:
ALLOW TCP 0.0.0.0/0 → 0.0.0.0/0:0
✅ Specific:
ALLOW TCP 192.168.1.0/24 → 10.0.0.5:80

### 3. Missing Return Traffic
For stateless firewalls, remember to allow return traffic.

### 4. Forgetting ICMP
✅ Allow necessary ICMP:
ALLOW ICMP 0.0.0.0/0 → 10.0.0.5:0 (for ping/monitoring)

---

## Importing Configurations

To use these examples in the simulator:

1. Copy the JSON configuration
2. Save as `.json` file
3. Click "Import" in the simulator
4. Select your file

**Example import file (web-server-config.json):**
```json
[
  {
    "id": 1,
    "action": "ALLOW",
    "protocol": "TCP",
    "srcIp": "0.0.0.0/0",
    "dstIp": "10.0.0.5",
    "port": "80",
    "priority": 1
  }
]
```

---

## Further Reading

- [Firewall Basics](FIREWALL_BASICS.md) - Learn fundamental concepts
- [RFC 2979](https://tools.ietf.org/html/rfc2979) - Firewall requirements
- [NIST Guide](https://csrc.nist.gov/publications) - Firewall security guidelines

---

**Happy configuring! 🛡️**
