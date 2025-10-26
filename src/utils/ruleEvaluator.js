import { ipMatch } from './ipMatcher';

/**
 * Rule Evaluation Engine for Firewall Simulator
 * Evaluates network packets against firewall rules
 */

/**
 * Evaluates a packet against firewall rules
 * @param {object} packet - The packet to evaluate
 * @param {string} packet.protocol - Protocol (TCP, UDP, ICMP)
 * @param {string} packet.srcIp - Source IP address
 * @param {string} packet.dstIp - Destination IP address
 * @param {string} packet.port - Destination port
 * @param {array} rules - Array of firewall rules
 * @returns {object} Result with action, matchedRule, and reason
 */
export function evaluatePacket(packet, rules) {
  // Sort rules by priority (ascending)
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
  
  // Evaluate each rule in priority order
  for (const rule of sortedRules) {
    if (ruleMatches(packet, rule)) {
      return {
        action: rule.action,
        matchedRule: rule,
        reason: buildMatchReason(rule)
      };
    }
  }
  
  // Default deny if no rules match
  return {
    action: 'DENY',
    matchedRule: null,
    reason: 'No matching rule found - Default DENY policy'
  };
}

/**
 * Checks if a packet matches a firewall rule
 * @param {object} packet - The packet to check
 * @param {object} rule - The firewall rule
 * @returns {boolean} True if packet matches rule
 */
function ruleMatches(packet, rule) {
  // Protocol matching
  const protocolMatch = rule.protocol === 'ANY' || rule.protocol === packet.protocol;
  
  // Source IP matching
  const srcMatch = ipMatch(packet.srcIp, rule.srcIp);
  
  // Destination IP matching
  const dstMatch = ipMatch(packet.dstIp, rule.dstIp);
  
  // Port matching (0 means any port)
  const portMatch = rule.port === '0' || rule.port === packet.port;
  
  return protocolMatch && srcMatch && dstMatch && portMatch;
}

/**
 * Builds a human-readable reason for rule match
 * @param {object} rule - The matched rule
 * @returns {string} Formatted reason string
 */
function buildMatchReason(rule) {
  return `Matched Rule #${rule.priority}: ${rule.action} ${rule.protocol} ${rule.srcIp} → ${rule.dstIp}:${rule.port}`;
}

/**
 * Validates a firewall rule
 * @param {object} rule - The rule to validate
 * @returns {object} Validation result with isValid and errors
 */
export function validateRule(rule) {
  const errors = [];
  
  if (!rule.action || !['ALLOW', 'DENY'].includes(rule.action)) {
    errors.push('Invalid action: must be ALLOW or DENY');
  }
  
  if (!rule.protocol || !['TCP', 'UDP', 'ICMP', 'ANY'].includes(rule.protocol)) {
    errors.push('Invalid protocol: must be TCP, UDP, ICMP, or ANY');
  }
  
  if (!rule.priority || rule.priority < 1) {
    errors.push('Invalid priority: must be >= 1');
  }
  
  if (!rule.srcIp) {
    errors.push('Source IP is required');
  }
  
  if (!rule.dstIp) {
    errors.push('Destination IP is required');
  }
  
  if (!rule.port) {
    errors.push('Port is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Detects conflicts between firewall rules
 * @param {array} rules - Array of firewall rules
 * @returns {array} Array of conflict descriptions
 */
export function detectRuleConflicts(rules) {
  const conflicts = [];
  
  for (let i = 0; i < rules.length; i++) {
    for (let j = i + 1; j < rules.length; j++) {
      const rule1 = rules[i];
      const rule2 = rules[j];
      
      // Check if rules have same priority
      if (rule1.priority === rule2.priority) {
        conflicts.push({
          type: 'DUPLICATE_PRIORITY',
          rule1: rule1.id,
          rule2: rule2.id,
          message: `Rules ${rule1.id} and ${rule2.id} have the same priority ${rule1.priority}`
        });
      }
      
      // Check for shadowing (higher priority rule makes lower priority unreachable)
      if (rule1.priority < rule2.priority && rulesOverlap(rule1, rule2)) {
        conflicts.push({
          type: 'SHADOWING',
          rule1: rule1.id,
          rule2: rule2.id,
          message: `Rule ${rule1.id} (priority ${rule1.priority}) shadows rule ${rule2.id} (priority ${rule2.priority})`
        });
      }
    }
  }
  
  return conflicts;
}

/**
 * Checks if two rules overlap in their matching criteria
 * @param {object} rule1 - First rule
 * @param {object} rule2 - Second rule
 * @returns {boolean} True if rules overlap
 */
function rulesOverlap(rule1, rule2) {
  // Simplified overlap detection
  // In a real implementation, this would need more sophisticated logic
  return (
    (rule1.protocol === rule2.protocol || rule1.protocol === 'ANY' || rule2.protocol === 'ANY') &&
    (rule1.srcIp === rule2.srcIp || rule1.srcIp === '0.0.0.0/0' || rule2.srcIp === '0.0.0.0/0') &&
    (rule1.dstIp === rule2.dstIp || rule1.dstIp === '0.0.0.0/0' || rule2.dstIp === '0.0.0.0/0') &&
    (rule1.port === rule2.port || rule1.port === '0' || rule2.port === '0')
  );
}
