# Firewall Basics

## What is a Firewall?

A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on predetermined security rules. Think of it as a security guard at the entrance of a building, checking everyone who enters or leaves based on a set of rules.

## How Firewalls Work

### Packet Filtering

Firewalls examine each packet of data and compare it against a set of rules:

1. **Protocol**: TCP, UDP, ICMP, etc.
2. **Source IP**: Where the packet is coming from
3. **Destination IP**: Where the packet is going
4. **Port**: The service being accessed (80=HTTP, 443=HTTPS, 22=SSH)
5. **Direction**: Inbound (incoming) or outbound (outgoing)

### Rule Evaluation Process

Rules are evaluated in priority order:

1. **First Match Wins**: The first rule that matches determines the action
2. **Priority Order**: Lower numbers = higher priority (evaluated first)
3. **Default Deny**: If no rules match, the packet is typically denied
4. **Specificity Matters**: More specific rules should have higher priority

## Common Firewall Actions

### ALLOW (Accept)
- Permits the packet to pass through
- Used for legitimate traffic
- Example: Allow web traffic on port 80

### DENY (Drop)
- Silently discards the packet
- No response sent to sender
- Attacker receives no feedback
- **Recommended for security**

### REJECT (Refuse)
- Discards the packet but sends a response
- Sender knows the port is filtered
- Can aid in troubleshooting
- **Not typically used for security**

## IP Addressing

### Single IP Address
192.168.1.10
Matches only that specific IP address.

### CIDR Notation

CIDR (Classless Inter-Domain Routing) notation represents IP ranges:
192.168.1.0/24
Matches 192.168.1.0 through 192.168.1.255 (256 addresses)

**Common CIDR Ranges:**

| CIDR | Subnet Mask | Number of IPs | Range |
|------|-------------|---------------|-------|
| /32 | 255.255.255.255 | 1 | Single IP |
| /24 | 255.255.255.0 | 256 | Class C network |
| /16 | 255.255.0.0 | 65,536 | Class B network |
| /8 | 255.0.0.0 | 16,777,216 | Class C network |
| /0 | 0.0.0.0 | 4,294,967,296 | All IPs |

### Wildcard (Any IP)
0.0.0.0/0
Matches any IP address - use with caution!

## Network Protocols

### TCP (Transmission Control Protocol)
- **Connection-oriented**: Establishes connection before data transfer
- **Reliable**: Guarantees packet delivery and order
- **Use cases**: Web browsing, email, file transfer

**Common TCP Ports:**
- 20/21: FTP (File Transfer Protocol)
- 22: SSH (Secure Shell)
- 23: Telnet
- 25: SMTP (Email)
- 80: HTTP (Web)
- 443: HTTPS (Secure Web)
- 3306: MySQL Database
- 3389: RDP (Remote Desktop)
- 8080: Alternative HTTP

### UDP (User Datagram Protocol)
- **Connectionless**: No connection establishment
- **Fast but unreliable**: No delivery guarantee
- **Use cases**: DNS, streaming, VoIP, gaming

**Common UDP Ports:**
- 53: DNS (Domain Name System)
- 67/68: DHCP (IP Address Assignment)
- 123: NTP (Time Synchronization)
- 161/162: SNMP (Network Management)
- 500: IPSec/IKE
- 514: Syslog

### ICMP (Internet Control Message Protocol)
- **Diagnostic protocol**: Error messages and queries
- **No ports**: Uses type and code instead
- **Use cases**: Ping, traceroute, error reporting

**Common ICMP Types:**
- Type 0: Echo Reply (ping response)
- Type 3: Destination Unreachable
- Type 8: Echo Request (ping)
- Type 11: Time Exceeded (traceroute)

## Firewall Best Practices

### 1. Principle of Least Privilege
Only allow what's absolutely necessary. Start by denying everything, then allow specific traffic.
❌ Bad: Allow all, deny specific
✅ Good: Deny all, allow specific

### 2. Default Deny Policy
Always configure a default deny rule at the end:
Priority: 999
Action: DENY
Protocol: ANY
Source: 0.0.0.0/0
Destination: 0.0.0.0/0
Port: 0

### 3. Order Matters
Place more specific rules before general rules:
✅ Good Order:

ALLOW TCP 192.168.1.100 → 10.0.0.5:22 (specific)
DENY TCP 0.0.0.0/0 → 10.0.0.5:22 (general)

❌ Bad Order:

DENY TCP 0.0.0.0/0 → 10.0.0.5:22 (general blocks everything)
ALLOW TCP 192.168.1.100 → 10.0.0.5:22 (never reached)


### 4. Regular Review
- Review rules monthly
- Remove unused rules
- Update documentation
- Test configurations

### 5. Logging and Monitoring
- Enable logging for denied traffic
- Monitor for attack patterns
- Set up alerts for suspicious activity
- Keep logs for forensics

### 6. Layered Security
Firewalls are one part of defense-in-depth:
- Network firewall
- Host-based firewall
- Application firewall (WAF)
- Intrusion Detection System (IDS)
- Intrusion Prevention System (IPS)

## Security Zones

### Public Zone (Internet)
- **Trust Level**: Untrusted
- **Access**: Unrestricted
- **Filtering**: Strictest rules
- **Assumption**: Hostile intent

### DMZ (Demilitarized Zone)
- **Trust Level**: Semi-trusted
- **Purpose**: Public-facing services
- **Isolation**: Separated from internal network
- **Examples**: Web servers, mail servers, DNS servers

### Internal/Private Zone
- **Trust Level**: Trusted
- **Access**: Company resources
- **Protection**: Protected from external access
- **Examples**: Databases, file servers, workstations

## Stateful vs Stateless Firewalls

### Stateless Firewall
- **Operation**: Examines each packet independently
- **Memory**: No memory of previous packets
- **Performance**: Faster processing
- **Rules**: Must define rules for both directions
- **Example**: Basic packet filter

**Pros:**
- Simple and fast
- Low resource usage
- Predictable behavior

**Cons:**
- Less secure
- More rules needed
- Can't track connections

### Stateful Firewall
- **Operation**: Tracks connection state
- **Memory**: Remembers established connections
- **Performance**: Slightly slower
- **Rules**: Automatically allows return traffic
- **Example**: Modern firewalls

**Pros:**
- More secure
- Fewer rules needed
- Blocks spoofed packets

**Cons:**
- More complex
- Higher resource usage
- State table can be exhausted

## Common Firewall Scenarios

### Scenario 1: Protecting a Web Server

**Requirement**: Allow web traffic, deny everything else

**Rules:**

ALLOW TCP 0.0.0.0/0 → 10.0.0.5:80    (HTTP)
ALLOW TCP 0.0.0.0/0 → 10.0.0.5:443   (HTTPS)
ALLOW TCP 192.168.1.100 → 10.0.0.5:22 (Admin SSH)
DENY TCP 0.0.0.0/0 → 10.0.0.5:0      (Block all other)


### Scenario 2: Internal Network Protection

**Requirement**: Allow internal traffic, block external

**Rules:**

ALLOW TCP 192.168.1.0/24 → 192.168.1.0/24:0 (Internal)
ALLOW TCP 192.168.1.0/24 → 0.0.0.0/0:80     (HTTP out)
ALLOW TCP 192.168.1.0/24 → 0.0.0.0/0:443    (HTTPS out)
ALLOW UDP 192.168.1.0/24 → 8.8.8.8:53       (DNS)
DENY TCP 0.0.0.0/0 → 192.168.1.0/24:0       (Block inbound)


### Scenario 3: DMZ Configuration

**Requirement**: Three-zone network

**Rules:**
Internet → DMZ

ALLOW TCP 0.0.0.0/0 → 172.16.1.5:80
ALLOW TCP 0.0.0.0/0 → 172.16.1.5:443

DMZ → Internal (Database only)

ALLOW TCP 172.16.1.5 → 10.0.0.10:3306

Block Internet → Internal

DENY TCP 0.0.0.0/0 → 10.0.0.0/24:0

Allow Internal → DMZ

ALLOW TCP 10.0.0.0/24 → 172.16.1.0/24:0

Allow Internal → Internet

ALLOW TCP 10.0.0.0/24 → 0.0.0.0/0:0


## Troubleshooting Tips

### Traffic Blocked Unexpectedly

1. **Check rule order**: Higher priority rules may be blocking
2. **Verify IP ranges**: Ensure CIDR notation is correct
3. **Check protocol**: TCP vs UDP matters
4. **Verify ports**: Ensure port numbers match
5. **Review logs**: Look for which rule is matching

### Traffic Allowed Unexpectedly

1. **Check for wildcards**: 0.0.0.0/0 allows everything
2. **Review priority**: Lower priority allow may override deny
3. **Check CIDR ranges**: Ranges may be too broad
4. **Look for ANY protocol**: May match unintended traffic

### Performance Issues

1. **Reduce rule count**: Combine similar rules
2. **Optimize order**: Put most-matched rules first
3. **Use stateful inspection**: Reduces rule complexity
4. **Monitor resource usage**: Check CPU and memory

## Advanced Concepts

### Port Forwarding (NAT)
Redirecting external traffic to internal servers:
External:203.0.113.10:80 → Internal:192.168.1.5:80

### Network Address Translation (NAT)
Translating private IPs to public IPs for internet access.

### Application Layer Filtering
Inspecting application-level protocols (HTTP, FTP, etc.) for threats.

### Geo-blocking
Blocking traffic from specific countries or regions.

### Rate Limiting
Preventing DDoS attacks by limiting connection rates.

### VPN Integration
Creating secure tunnels through the firewall for remote access.

## Learning Resources

- **RFC 791**: Internet Protocol specification
- **RFC 793**: TCP specification
- **RFC 768**: UDP specification
- **CIDR Calculator**: subnet-calculator.com
- **Port Database**: iana.org/assignments/service-names-port-numbers

## Glossary

**ACL (Access Control List)**: Set of rules defining allowed/denied traffic

**Egress**: Outgoing traffic from a network

**Ingress**: Incoming traffic to a network

**Packet**: Unit of data transmitted over a network

**Port**: Virtual endpoint for network connections (0-65535)

**Protocol**: Set of rules for data communication

**Stateful Inspection**: Tracking connection states and context

**Subnet**: Logical subdivision of an IP network

**Whitelist**: List of explicitly allowed items

**Blacklist**: List of explicitly denied items

---

**Next Steps:**
- Try the simulator with different configurations
- Review the [Configuration Examples](EXAMPLES.md)
- Practice with real-world scenarios
- Learn about specific firewall implementations (iptables, pfSense, etc.)
