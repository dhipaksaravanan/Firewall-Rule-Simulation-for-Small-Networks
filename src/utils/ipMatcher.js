/**
 * IP Matching Utility for Firewall Rules
 * Supports exact IP matching and CIDR notation
 */

/**
 * Checks if a packet IP matches a rule IP pattern
 * @param {string} packetIp - The IP address from the packet (e.g., "192.168.1.10")
 * @param {string} ruleIp - The IP pattern from the rule (supports CIDR, e.g., "192.168.1.0/24")
 * @returns {boolean} True if the IP matches the pattern
 */
export function ipMatch(packetIp, ruleIp) {
  // Match any IP address
  if (ruleIp === '0.0.0.0/0') {
    return true;
  }
  
  // CIDR notation matching
  if (ruleIp.includes('/')) {
    return cidrMatch(packetIp, ruleIp);
  }
  
  // Exact IP match
  return packetIp === ruleIp;
}

/**
 * Matches an IP address against a CIDR range
 * @param {string} ip - The IP address to check
 * @param {string} cidr - The CIDR notation (e.g., "192.168.1.0/24")
 * @returns {boolean} True if IP is within the CIDR range
 */
function cidrMatch(ip, cidr) {
  const [network, bits] = cidr.split('/');
  const maskBits = parseInt(bits);
  
  // Validate mask bits
  if (isNaN(maskBits) || maskBits < 0 || maskBits > 32) {
    return false;
  }
  
  const packetParts = ip.split('.').map(Number);
  const networkParts = network.split('.').map(Number);
  
  // Validate IP addresses
  if (packetParts.length !== 4 || networkParts.length !== 4) {
    return false;
  }
  
  if (packetParts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  
  if (networkParts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }
  
  // Compare bits
  let matchingBits = 0;
  for (let i = 0; i < 4; i++) {
    for (let j = 7; j >= 0; j--) {
      if (matchingBits >= maskBits) {
        return true;
      }
      
      const packetBit = (packetParts[i] >> j) & 1;
      const networkBit = (networkParts[i] >> j) & 1;
      
      if (packetBit !== networkBit) {
        return false;
      }
      
      matchingBits++;
    }
  }
  
  return true;
}

/**
 * Validates an IP address format
 * @param {string} ip - The IP address to validate
 * @returns {boolean} True if valid IP format
 */
export function isValidIp(ip) {
  const parts = ip.split('.');
  
  if (parts.length !== 4) {
    return false;
  }
  
  return parts.every(part => {
    const num = parseInt(part);
    return !isNaN(num) && num >= 0 && num <= 255;
  });
}

/**
 * Validates a CIDR notation
 * @param {string} cidr - The CIDR notation to validate
 * @returns {boolean} True if valid CIDR format
 */
export function isValidCidr(cidr) {
  if (!cidr.includes('/')) {
    return false;
  }
  
  const [ip, bits] = cidr.split('/');
  const maskBits = parseInt(bits);
  
  return isValidIp(ip) && !isNaN(maskBits) && maskBits >= 0 && maskBits <= 32;
}
