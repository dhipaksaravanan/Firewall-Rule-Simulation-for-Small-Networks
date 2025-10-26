# Contributing to Firewall Rule Simulator

Thank you for your interest in contributing to the Firewall Rule Simulator! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Testing Guidelines](#testing-guidelines)

## 📜 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Trolling, insulting comments, or personal attacks
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title**: Describe the issue concisely
- **Steps to reproduce**: Detailed steps to replicate the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, version

**Example Bug Report:**
```markdown
**Title**: IP matching fails for /16 CIDR ranges

**Steps to Reproduce:**
1. Add rule with source IP 10.0.0.0/16
2. Test packet from 10.0.5.100
3.(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].type).toBe('DUPLICATE_PRIORITY');
  });

  test('detects rule shadowing', () => {
    const rules = [
      { id: 1, action: 'DENY', protocol: 'TCP', srcIp: '0.0.0.0/0', dstIp: '10.0.0.5', port: '0', priority: 1 },
      { id: 2, action: 'ALLOW', protocol: 'TCP', srcIp: '192.168.1.0/24', dstIp: '10.0.0.5', port: '80', priority: 2 }
    ];
    
    const conflicts = detectRuleConflicts(rules);
    expect
