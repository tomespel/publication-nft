# Contributing to Publication NFT

Thank you for your interest in contributing to the Publication NFT project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/publication-nft.git
   cd publication-nft
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/tomespel/publication-nft.git
   ```

## Development Setup

### Ethereum Development

```bash
cd ethereum
npm install
npm run compile
npm test
```

### SUI Development

```bash
cd sui
sui move build
sui move test
```

## Making Changes

### Creating a Branch

Create a descriptive branch name:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Types of Contributions

#### Bug Fixes

- Clearly describe the bug in the PR
- Include steps to reproduce
- Add tests that fail without the fix

#### New Features

- Discuss major features in an issue first
- Keep changes focused and minimal
- Update documentation
- Add comprehensive tests

#### Documentation

- Fix typos, clarify instructions
- Add examples and use cases
- Keep formatting consistent

#### Tests

- Increase test coverage
- Add edge case testing
- Ensure tests are deterministic

## Testing

### Ethereum Tests

```bash
cd ethereum

# Run all tests
npm test

# Run specific test file
npx hardhat test test/PublicationNFT.test.js

# Run tests with gas reporting
REPORT_GAS=true npm test

# Run tests with coverage
npx hardhat coverage
```

### SUI Tests

```bash
cd sui

# Run all tests
sui move test

# Run tests with verbose output
sui move test --verbose

# Run specific test
sui move test --filter test_mint_publication_nft
```

### Test Requirements

- All new code must have tests
- Tests must pass before submitting PR
- Aim for >80% code coverage
- Include both positive and negative test cases

## Submitting Changes

### Before Submitting

1. **Update from upstream**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all tests**:
   ```bash
   # Ethereum
   cd ethereum && npm test
   
   # SUI
   cd sui && sui move test
   ```

3. **Check code style**:
   ```bash
   # Ethereum (if applicable)
   npm run lint
   
   # SUI - ensure code follows Move conventions
   ```

4. **Update documentation** if needed

### Commit Messages

Follow conventional commit format:

```
type(scope): brief description

Longer description if needed

Fixes #issue-number
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `style`: Code style changes
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(ethereum): add batch minting functionality

fix(sui): correct publication date validation

docs: update deployment guide with mainnet instructions

test(ethereum): add edge cases for metadata storage
```

### Creating a Pull Request

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a PR on GitHub with:
   - Clear title describing the change
   - Detailed description of what and why
   - Reference to related issues
   - Screenshots for UI changes
   - Test results

3. PR Template:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Test improvement
   
   ## Testing
   - [ ] Tests pass locally
   - [ ] New tests added
   - [ ] Documentation updated
   
   ## Related Issues
   Closes #issue-number
   ```

## Code Style

### Solidity (Ethereum)

- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use 4 spaces for indentation
- Maximum line length: 120 characters
- Use NatSpec comments for public functions
- Order: state variables, events, modifiers, constructor, functions
- Function order: external, public, internal, private

Example:
```solidity
/**
 * @dev Mint a new publication NFT
 * @param to The address that will own the minted token
 * @param uri The token URI containing metadata
 */
function mintPublication(
    address to,
    string memory uri
) public onlyOwner returns (uint256) {
    // Implementation
}
```

### Move (SUI)

- Follow [Move Style Guide](https://move-language.github.io/move/coding-conventions.html)
- Use 4 spaces for indentation
- Use snake_case for function and variable names
- Use PascalCase for struct names
- Document public functions with comments
- Keep functions focused and single-purpose

Example:
```move
/// Mint a new publication NFT
public entry fun mint(
    title: String,
    author: String,
    ctx: &mut TxContext
) {
    // Implementation
}
```

### JavaScript/TypeScript

- Use 2 spaces for indentation
- Use semicolons
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use async/await over promises chains

### Documentation

- Use clear, concise language
- Include code examples
- Keep formatting consistent
- Update all relevant docs when making changes

## Review Process

1. **Automated Checks**: CI/CD will run tests automatically
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any comments or requested changes
4. **Approval**: Once approved, maintainers will merge

### Review Timeline

- Initial response: 1-3 days
- Full review: 3-7 days
- Larger changes may take longer

## Getting Help

- **Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Discord/Slack**: Real-time communication (if available)

## Recognition

Contributors will be:
- Listed in release notes
- Mentioned in commit history
- Acknowledged in documentation

Thank you for contributing to Publication NFT! 🎉
