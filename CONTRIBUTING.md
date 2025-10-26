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
3. Click "Simulate Packet"

**Expected**: Packet should match the rule
**Actual**: Packet does not match

**Environment**: Chrome 120, Windows 11
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Include:

- **Clear title**: Describe the enhancement
- **Use case**: Why is this useful?
- **Implementation ideas**: Possible approaches
- **Alternatives**: Other solutions considered

**Example Enhancement:**
```markdown
**Title**: Add export to CSV format

**Use Case**: Users want to export rules to spreadsheet format
for analysis and documentation.

**Implementation**: Add CSV export button alongside JSON export.

**Alternatives**: PDF export, XML format
```

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Write or update tests**
5. **Update documentation**
6. **Submit a pull request**

## 🔧 Development Setup

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Git

### Local Setup
```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/firewall-rule-simulator.git

# Navigate to directory
cd firewall-rule-simulator

# Add upstream remote
git remote add upstream https://github.com/original/firewall-rule-simulator.git

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

### Project Structure
src/
├── components/          # React components
│   └── FirewallSimulator.jsx
├── utils/              # Utility functions
│   ├── ipMatcher.js
│   └── ruleEvaluator.js
├── App.js              # Root component
├── index.js            # Entry point
└── index.css           # Global styles
tests/                  # Test files
docs/                   # Documentation
public/                 # Static files

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Update documentation
2. ✅ Add or update tests
3. ✅ Run full test suite
4. ✅ Update CHANGELOG.md
5. ✅ Follow code style guidelines

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe your testing approach

## Checklist
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Added tests for new features
```

### Review Process

1. Maintainer reviews your PR
2. Address feedback if any
3. CI/CD checks must pass
4. Require 1 approval minimum
5. Maintainer merges

## 🎨 Style Guidelines

### JavaScript Style

**General Rules:**
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Meaningful variable names
- Add JSDoc comments

**Example:**
```javascript
/**
 * Checks if an IP matches a rule pattern
 * @param {string} ip - The IP address to check
 * @param {string} pattern - The pattern to match against
 * @returns {boolean} True if match found
 */
function checkIpMatch(ip, pattern) {
  // Validate inputs
  if (!ip || !pattern) {
    return false;
  }
  
  // Perform matching
  return ip === pattern;
}
```

### React Component Style

**Functional Components:**
```javascript
import React, { useState } from 'react';

export default function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  const handleEvent = () => {
    // Event handling logic
  };
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

**Component Guidelines:**
- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for props
- Name event handlers with `handle` prefix

### CSS Style

**Tailwind CSS:**
- Use utility classes
- Avoid custom CSS when possible
- Use responsive modifiers
```jsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-xl">
  {/* Content */}
</div>
```

### Naming Conventions

**Variables:**
```javascript
const userName = 'John';        // camelCase for variables
const MAX_RETRIES = 3;          // UPPER_CASE for constants
```

**Functions:**
```javascript
function calculateTotal() {}     // camelCase for functions
function handleClick() {}        // handle prefix for handlers
```

**Components:**
```javascript
function FirewallSimulator() {}  // PascalCase for components
```

**Files:**
FirewallSimulator.jsx           // PascalCase for components
ipMatcher.js                    // camelCase for utilities

### Commit Messages

Follow conventional commits format:
type(scope): subject
body
footer

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

**Examples:**
feat(rules): add rule conflict detection
Add functionality to detect conflicting firewall rules
including duplicate priorities and rule shadowing.
Closes #123

fix(ip-matcher): correct CIDR /16 matching
Fixed bug where /16 CIDR ranges were not matching correctly.
Issue was in bit comparison loop.
Fixes #456

docs(readme): update installation instructions
Updated Node.js version requirement to 14.x

## 🧪 Testing Guidelines

### Writing Tests

**Test Structure:**
```javascript
describe('Component/Function Name', () => {
  describe('specific functionality', () => {
    test('should do something specific', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

**Best Practices:**
- Write tests for new features
- Update tests for bug fixes
- Aim for 80%+ code coverage
- Test edge cases
- Test error conditions
- Use descriptive test names

**Example:**
```javascript
describe('ipMatch', () => {
  test('matches exact IP addresses', () => {
    expect(ipMatch('192.168.1.10', '192.168.1.10')).toBe(true);
  });
  
  test('matches CIDR /24 ranges', () => {
    expect(ipMatch('192.168.1.10', '192.168.1.0/24')).toBe(true);
  });
  
  test('rejects IPs outside CIDR range', () => {
    expect(ipMatch('192.168.2.10', '192.168.1.0/24')).toBe(false);
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test ipMatcher.test.js
```

## 📚 Documentation

### Code Documentation

**JSDoc for Functions:**
```javascript
/**
 * Evaluates a packet against firewall rules
 * @param {object} packet - The packet to evaluate
 * @param {string} packet.protocol - Protocol (TCP, UDP, ICMP)
 * @param {string} packet.srcIp - Source IP address
 * @param {string} packet.dstIp - Destination IP address
 * @param {string} packet.port - Destination port
 * @param {array} rules - Array of firewall rules
 * @returns {object} Result with action, matchedRule, and reason
 * @throws {Error} If packet or rules are invalid
 * @example
 * const packet = { protocol: 'TCP', srcIp: '192.168.1.10', dstIp: '10.0.0.5', port: '80' };
 * const result = evaluatePacket(packet, rules);
 */
```

### README Updates

Update README.md when:
- Adding new features
- Changing installation process
- Updating dependencies
- Changing API

### Creating New Documentation

For new features, add documentation:
1. Update relevant sections in docs/
2. Add examples to docs/EXAMPLES.md
3. Update README.md if needed

## 🏆 Recognition

Contributors will be recognized in:
- README.md Contributors section
- CHANGELOG.md for their contributions
- GitHub contributors page

## ❓ Questions?

- Open an issue for questions
- Join discussions in GitHub Discussions
- Contact maintainers directly

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
    expect
