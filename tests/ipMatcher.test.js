import { ipMatch, isValidIp, isValidCidr } from '../src/utils/ipMatcher';

describe('ipMatch', () => {
  describe('Exact IP matching', () => {
    test('matches exact IP addresses', () => {
      expect(ipMatch('192.168.1.10', '192.168.1.10')).toBe(true);
      expect(ipMatch('10.0.0.5', '10.0.0.5')).toBe(true);
    });

    test('does not match different IP addresses', () => {
      expect(ipMatch('192.168.1.10', '192.168.1.11')).toBe(false);
      expect(ipMatch('10.0.0.5', '10.0.0.6')).toBe(false);
    });
  });

  describe('Wildcard matching', () => {
    test('matches any IP with 0.0.0.0/0', () => {
      expect(ipMatch('192.168.1.10', '0.0.0.0/0')).toBe(true);
      expect(ipMatch('10.0.0.5', '0.0.0.0/0')).toBe(true);
      expect(ipMatch('8.8.8.8', '0.0.0.0/0')).toBe(true);
    });
  });

  describe('CIDR notation matching', () => {
    test('matches /24 CIDR ranges', () => {
      expect(ipMatch('192.168.1.10', '192.168.1.0/24')).toBe(true);
      expect(ipMatch('192.168.1.1', '192.168.1.0/24')).toBe(true);
      expect(ipMatch('192.168.1.255', '192.168.1.0/24')).toBe(true);
    });

    test('does not match IPs outside /24 CIDR range', () => {
      expect(ipMatch('192.168.2.10', '192.168.1.0/24')).toBe(false);
      expect(ipMatch('192.169.1.10', '192.168.1.0/24')).toBe(false);
    });

    test('matches /16 CIDR ranges', () => {
      expect(ipMatch('10.0.5.100', '10.0.0.0/16')).toBe(true);
      expect(ipMatch('10.0.255.255', '10.0.0.0/16')).toBe(true);
    });

    test('does not match IPs outside /16 CIDR range', () => {
      expect(ipMatch('10.1.5.100', '10.0.0.0/16')).toBe(false);
    });

    test('matches /8 CIDR ranges', () => {
      expect(ipMatch('10.50.100.200', '10.0.0.0/8')).toBe(true);
      expect(ipMatch('10.255.255.255', '10.0.0.0/8')).toBe(true);
    });

    test('matches /32 CIDR (single IP)', () => {
      expect(ipMatch('192.168.1.10', '192.168.1.10/32')).toBe(true);
      expect(ipMatch('192.168.1.11', '192.168.1.10/32')).toBe(false);
    });

    test('matches /0 CIDR (all IPs)', () => {
      expect(ipMatch('1.2.3.4', '0.0.0.0/0')).toBe(true);
      expect(ipMatch('255.255.255.255', '0.0.0.0/0')).toBe(true);
    });
  });
});

describe('isValidIp', () => {
  test('validates correct IP addresses', () => {
    expect(isValidIp('192.168.1.1')).toBe(true);
    expect(isValidIp('10.0.0.5')).toBe(true);
    expect(isValidIp('0.0.0.0')).toBe(true);
    expect(isValidIp('255.255.255.255')).toBe(true);
  });

  test('rejects invalid IP addresses', () => {
    expect(isValidIp('256.1.1.1')).toBe(false);
    expect(isValidIp('192.168.1')).toBe(false);
    expect(isValidIp('192.168.1.1.1')).toBe(false);
    expect(isValidIp('abc.def.ghi.jkl')).toBe(false);
  });
});

describe('isValidCidr', () => {
  test('validates correct CIDR notation', () => {
    expect(isValidCidr('192.168.1.0/24')).toBe(true);
    expect(isValidCidr('10.0.0.0/8')).toBe(true);
    expect(isValidCidr('0.0.0.0/0')).toBe(true);
  });

  test('rejects invalid CIDR notation', () => {
    expect(isValidCidr('192.168.1.0')).toBe(false);
    expect(isValidCidr('192.168.1.0/33')).toBe(false);
    expect(isValidCidr('192.168.1.0/-1')).toBe(false);
    expect(isValidCidr('256.1.1.1/24')).toBe(false);
  });
});
