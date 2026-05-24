# Contributing to Nexora

Thank you for considering contributing to Nexora! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on the code, not the person
- Constructive feedback only
- Report issues confidentially if needed

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/nexora-event-management.git`
3. Add upstream remote: `git remote add upstream https://github.com/samarthb/nexora-event-management.git`
4. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Making Changes

1. Follow the existing code style
2. Write meaningful commit messages
3. Keep commits atomic and focused
4. Update documentation if needed

### Commit Message Format

```
type(scope): subject

body

footer
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(auth): add login functionality

Implement JWT-based login with password hashing
Fixes #123
```

## Before Submitting a Pull Request

- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] No console errors/warnings
- [ ] Documentation updated
- [ ] Commits are meaningful

## Pull Request Process

1. Update README.md with any new features
2. Update version number (follows semver)
3. Add description of changes
4. Link related issues
5. Request review from maintainers

## Testing

### Frontend
```bash
npm run type-check
npm run lint
```

### Backend
```bash
npm run type-check
npm run lint
```

## Documentation

- Document new features in respective README files
- Update API documentation if endpoints change
- Add examples where helpful
- Keep comments clear and concise

## Questions?

- Check existing GitHub issues
- Read the documentation
- Ask in discussions/issues
- Contact the team

## License

By contributing, you agree to license your contributions under the MIT License.

---

**Thank you for contributing to Nexora!** ❤️
