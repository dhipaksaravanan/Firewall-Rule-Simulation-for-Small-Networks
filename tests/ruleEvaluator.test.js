import { evaluatePacket, validateRule, detectRuleConflicts } from '../src/utils/ruleEvaluator';

describe('evaluatePacket', () => {
  const rules = [
    { id: 1, action: 'ALLOW', protocol: 'TCP', srcIp: '192.168.1.0/24', dstIp: '10.0.0.5', port: '80', priority: 1 },
    { id: 2, action: 'DENY', protocol: 'TCP', srcIp: '0.0.0.0/0', dstIp: '10.0.0.5', port: '22', priority: 2 },
    { id: 3, action: 'ALLOW', protocol: 'UDP', srcIp: '192.168.1.0/24', dstIp: '8.8.8.8', port: '53', priority: 3 }
  ];

  test('allows matching HTTP traffic', () => {
    const packet = { protocol: 'TCP', srcIp: '192.168.1.10', dstIp: '10.0.0.5', port: '80' };
    const result = evaluatePacket(packet, rules);
    
    expect(result.action).toBe('ALLOW');
    expect(result.matchedRule.id).toBe(1);
  });

  test('denies SSH traffic', () => {
    const packet = { protocol: 'TCP', srcIp: '192.168.1.10', dstIp: '10.0.0.5', port: '22' };
    const result = evaluatePacket(packet, rules);
    
    expect(result.action).toBe('DENY');
    expect(result.matchedRule.id).toBe(2);
  });

  test('allows DNS traffic', () => {
    const packet = { protocol: 'UDP', srcIp: '192.168.1.10', dstIp: '8.8.8.8', port: '53' };
    const result = evaluatePacket(packet, rules);
    
    expect(result.action).toBe('ALLOW');
    expect(result.matchedRule.id).toBe(3);
  });

  test('denies traffic with no matching rules', () => {
    const packet = { protocol: 'TCP', srcIp: '10.0.0.1', dstIp: '1.1.1.1', port: '443' };
    const result = evaluatePacket(packet, rules);
    
    expect(result.action).toBe('DENY');
    expect(result.matchedRule).toBe(null);
    expect(result.reason).toContain('Default DENY');
  });

  test('respects priority order', () => {
    const customRules = [
      { id: 1, action: 'DENY', protocol: 'TCP', srcIp: '0.0.0.0/0', dstIp: '10.0.0.5', port: '80', priority: 2 },
      { id: 2, action: 'ALLOW', protocol: 'TCP', srcIp: '192.168.1.0/24', dstIp: '10.0.0.5', port: '80', priority: 1 }
    ];
    
    const packet = { protocol: 'TCP', srcIp: '192.168.1.10', dstIp: '10.0.0.5', port: '80' };
    const result = evaluatePacket(packet, customRules);
    
    expect(result.action).toBe('ALLOW');
    expect(result.matchedRule.id).toBe(2);
  });

  test('handles ANY protocol', () => {
    const customRules = [
      { id: 1, action: 'ALLOW', protocol: 'ANY', srcIp: '192.168.1.0/24', dstIp: '10.0.0.5', port: '0', priority: 1 }
    ];
    
    const packet1 = { protocol: 'TCP', srcIp: '192.168.1.10', dstIp: '10.0.0.5', port: '80' };
    const packet2 = { protocol: 'UDP', srcIp: '192.168.1.10', dstIp: '10.0.0.5', port: '53' };
    
    expect(evaluatePacket(packet1, customRules).action).toBe('ALLOW');
    expect(evaluatePacket(packet2, customRules).action).toBe('ALLOW');
  });

  test('handles any port (port 0)', () => {
    const customRules = [
      { id: 1, action: 'ALLOW', protocol: 'TCP', srcIp: '192.168.1.0/24', dstIp: '10.0.0.5', port: '0', priority: 1 }
    ];
    
    const packet1 = { protocol: 'TCP', srcIp: '192.168.1.10', dstIp: '10.0.0.5', port: '80' };
    const packet2 = { protocol: 'TCP', srcIp: '192.168.1.10', dstIp: '10.0.0.5', port: '443' };
    
    expect(evaluatePacket(packet1, customRules).action).toBe('ALLOW');
    expect(evaluatePacket(packet2, customRules).action).toBe('ALLOW');
  });
});

describe('validateRule', () => {
  test('validates correct rule', () => {
    const rule = {
      action: 'ALLOW',
      protocol: 'TCP',
      srcIp: '192.168.1.0/24',
      dstIp: '10.0.0.5',
      port: '80',
      priority: 1
    };
    
    const result = validateRule(rule);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('detects invalid action', () => {
    const rule = {
      action: 'INVALID',
      protocol: 'TCP',
      srcIp: '192.168.1.0/24',
      dstIp: '10.0.0.5',
      port: '80',
      priority: 1
    };
    
    const result = validateRule(rule);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Invalid action: must be ALLOW or DENY');
  });

  test('detects invalid protocol', () => {
    const rule = {
      action: 'ALLOW',
      protocol: 'HTTP',
      srcIp: '192.168.1.0/24',
      dstIp: '10.0.0.5',
      port: '80',
      priority: 1
    };
    
    const result = validateRule(rule);
    expect(result.isValid).toBe(false);
  });

  test('detects invalid priority', () => {
    const rule = {
      action: 'ALLOW',
      protocol: 'TCP',
      srcIp: '192.168.1.0/24',
      dstIp: '10.0.0.5',
      port: '80',
      priority: 0
    };
    
    const result = validateRule(rule);
    expect(result.isValid).toBe(false);
  });
});

describe('detectRuleConflicts', () => {
  test('detects duplicate priority', () => {
    const rules = [
      { id: 1, action: 'ALLOW', protocol: 'TCP', srcIp: '192.168.1.0/24', dstIp: '10.0.0.5', port: '80', priority: 1 },
      { id: 2, action: 'DENY', protocol: 'TCP', srcIp: '0.0.0.0/0', dstIp: '10.0.0.5', port: '22', priority: 1 }
    ];
    
    const conflicts = detectRuleConflicts(rules);
    expect(conflicts.some(c => c.type === 'SHADOWING')).toBe(true);
  });

  test('returns empty array for non-conflicting rules', () => {
    const rules = [
      { id: 1, action: 'ALLOW', protocol: 'TCP', srcIp: '192.168.1.0/24', dstIp: '10.0.0.5', port: '80', priority: 1 },
      { id: 2, action: 'DENY', protocol: 'UDP', srcIp: '0.0.0.0/0', dstIp: '8.8.8.8', port: '53', priority: 2 }
    ];
    
    const conflicts = detectRuleConflicts(rules);
    expect(conflicts).toEqual([]);
  });
});
