# Contributing to CSGuild Client

Thank you for your interest in contributing to CSGuild Client! This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./src/app/(main)/code-of-conduct/page.tsx).

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/csguild-client.git
   cd csguild-client
   ```
3. **Install dependencies** using Bun:
   ```bash
   bun install
   ```
4. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Setting Up Your Development Environment

1. **Copy environment variables**:
   ```bash
   cp .env.example .env.local
   ```

2. **Start the development server**:
   ```bash
   bun dev
   ```

3. **Run quality checks**:
   ```bash
   # Type checking
   bun run type-check
   
   # Linting
   bun run lint
   
   # Build test
   bun run build
   ```

### Branch Naming Conventions

- `feature/description` - for new features
- `fix/description` - for bug fixes
- `refactor/description` - for code refactoring
- `docs/description` - for documentation updates
- `chore/description` - for maintenance tasks

## Coding Standards

### TypeScript Guidelines

- **Strict typing**: Always use proper TypeScript types
- **Interface over type**: Prefer `interface` for object shapes
- **Explicit returns**: Define return types for functions
- **No `any`**: Avoid using `any` type

### React Best Practices

- **Functional components**: Use function declarations
- **Custom hooks**: Extract reusable logic
- **Proper naming**: 
  - Components: PascalCase (`UserProfile`)
  - Functions/Variables: camelCase (`handleSubmit`)
  - Constants: UPPER_CASE (`API_BASE_URL`)

### File Structure

```
src/
├── features/
│   └── feature-name/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       ├── utils/
│       └── index.ts
```

### Component Guidelines

```typescript
// Good component structure
interface UserProfileProps {
  userId: string;
  isEditable?: boolean;
}

function UserProfile({ userId, isEditable = false }: UserProfileProps) {
  // Component logic
  return (
    <div className="user-profile">
      {/* JSX content */}
    </div>
  );
}

export default UserProfile;
```

## Pull Request Process

### Before Submitting

1. **Run all checks**:
   ```bash
   bun run ci
   ```

2. **Update documentation** if needed

3. **Write descriptive commit messages**:
   ```bash
   git commit -m "feat: add user authentication flow"
   git commit -m "fix: resolve navigation menu mobile responsiveness"
   git commit -m "docs: update installation instructions"
   ```

### Pull Request Template

When creating a pull request, include:

- **Description**: What changes were made and why
- **Type of change**: Feature, bug fix, refactor, etc.
- **Testing**: How the changes were tested
- **Screenshots**: For UI changes
- **Breaking changes**: If any

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Approval** and merge

## Issue Reporting

### Bug Reports

When reporting bugs, include:

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Environment details** (OS, browser, Node version)
- **Screenshots** if applicable

### Feature Requests

For feature requests, provide:

- **Clear description** of the proposed feature
- **Use case** and user story
- **Acceptance criteria**
- **Mockups** or wireframes if applicable

## Development Guidelines

### State Management

- **Local state**: `useState` or `useReducer`
- **Global state**: Zustand stores in `src/stores/`
- **Server state**: TanStack Query
- **Forms**: React Hook Form + Zod validation

### Styling

- **Tailwind CSS**: Use utility-first approach
- **Component variants**: Use `class-variance-authority`
- **Responsive design**: Mobile-first approach
- **Dark mode**: Support theme switching

### Performance

- **Code splitting**: Use dynamic imports
- **Image optimization**: Use Next.js Image component
- **Memoization**: Use `React.memo`, `useMemo`, `useCallback` appropriately
- **Bundle analysis**: Check bundle size impact

## Testing Guidelines

### Unit Tests

```typescript
// Example test structure
describe('UserProfile Component', () => {
  it('should render user information correctly', () => {
    // Test implementation
  });

  it('should handle edit mode toggle', () => {
    // Test implementation
  });
});
```

### Best Practices

- **Test behavior**, not implementation
- **Use descriptive test names**
- **Mock external dependencies**
- **Test edge cases** and error states

## Getting Help

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bugs and feature requests
- **Code Review**: Ask for feedback on complex changes

## Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page

Thank you for contributing to CSGuild Client! 🚀
