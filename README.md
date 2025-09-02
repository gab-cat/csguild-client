# CSGuild Client

A modern web application built with Next.js 15, TypeScript, and Tailwind CSS. This project implements a feature-based architecture with clean code practices and modern development tools.

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Package Manager**: [Bun](https://bun.sh/)
- **Linting**: [ESLint](https://eslint.org/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Bun** (latest version) - [Installation Guide](https://bun.sh/docs/installation)
- **Node.js** 18.17 or later (Node.js 18 is specifically required for Convex local deployment)
- **Git**
- **nvm** (recommended for Node.js version management) - [Installation Guide](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installing Bun

```bash
# macOS and Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installation
bun --version
```

### Setting up Node.js for Convex

This project uses Convex with "use node" actions that require Node.js 18. We recommend using nvm to manage Node.js versions:

```bash
# Install and use Node.js 18 (required for Convex local deployment)
nvm install 18
nvm use 18

# Or use the .nvmrc file in the project root
nvm use
```

**Important**: Always ensure you're using Node.js 18 when running `bunx convex dev` for local development.

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gab-cat/csguild-client.git
   cd csguild-client
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration values.

4. **Set up Node.js version for Convex**
   ```bash
   # Switch to Node.js 18 (required for Convex "use node" actions)
   nvm use 18
   ```

5. **Start the Convex development server**
   ```bash
   bunx convex dev --once
   ```

6. **Start the development server**
   ```bash
   bun dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server with Turbopack |
| `bun build` | Build the application for production |
| `bun start` | Start the production server |
| `bun lint` | Run ESLint to check code quality |
| `bun lint:fix` | Run ESLint and automatically fix issues |
| `bun type-check` | Run TypeScript type checking |

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main public routes
│   └── dashboard/         # Protected dashboard routes
├── components/            # Reusable UI components
│   ├── landing/           # Landing page components
│   ├── shared/            # Shared components (header, footer)
│   ├── static/            # Static content components
│   └── ui/                # Base UI components (shadcn/ui)
├── constants/             # Application constants
├── features/              # Feature-based modules
│   ├── auth/             # Authentication feature
│   └── facilities/       # Facilities feature
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── stores/                # Zustand global state stores
└── types/                 # TypeScript type definitions
```

## 🎨 Development Guidelines

This project follows strict coding standards and architectural patterns:

### Code Style
- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Line Length**: 80 characters maximum
- **Naming**: PascalCase for components, camelCase for functions/variables

### Component Architecture
- Use functional components with TypeScript
- Implement proper component composition
- Extract reusable logic into custom hooks
- Use React.memo() strategically for performance

### State Management
- **Local State**: `useState`
- **Global State**: Zustand stores
- **Server State**: TanStack Query
- **Forms**: React Hook Form + Zod validation

## 🔧 Development Workflow

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding guidelines
   - Write tests for new features
   - Update documentation as needed

3. **Run quality checks**
   ```bash
   bun lint
   bun type-check
   bun build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### CI/CD Pipeline

Our GitHub Actions workflow automatically:
- ✅ Installs dependencies with Bun
- ✅ Runs TypeScript type checking
- ✅ Executes ESLint for code quality
- ✅ Builds the application
- ✅ Caches dependencies for faster builds

## 🧪 Testing

```bash
# Run unit tests (when implemented)
bun test

# Run type checking
bun type-check

# Run linting
bun lint
```

## 🚀 Deployment

### Production Build

```bash
# Build for production
bun build

# Start production server
bun start
```

### Docker Deployment

```bash
# Build Docker image
docker build -t csguild-client .

# Run container
docker run -p 3000:3000 csguild-client
```

### Vercel Deployment

This project is optimized for [Vercel](https://vercel.com/) deployment:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on every push to main

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Follow the coding guidelines**
4. **Write tests for your changes**
5. **Submit a pull request**

### Code of Conduct

Please read our [Code of Conduct](./src/app/(main)/code-of-conduct/page.tsx) before contributing.

## 📖 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Bun Documentation](https://bun.sh/docs)

## 🐛 Troubleshooting

### Common Issues

1. **Bun installation fails**
   - Ensure you have the latest version of your OS
   - Try using the alternative installation methods

2. **Dependencies installation fails**
   ```bash
   # Clear Bun cache
   bun pm cache rm
   
   # Reinstall dependencies
   rm -rf node_modules bun.lockb
   bun install
   ```

3. **Build fails with memory issues**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   bun build
   ```

4. **Convex deployment error: "Node.js v18 is not installed"**
   ```bash
   # Switch to Node.js 18 before running Convex
   nvm use 18
   bunx convex dev --once
   ```
   
   This error occurs when trying to run Convex with "use node" actions while using a different Node.js version. Convex specifically requires Node.js 18 for local deployment.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: CSGuild Development Team
- **Repository**: [csguild-client](https://github.com/gab-cat/csguild-client)

---

Built with ❤️ using [Next.js](https://nextjs.org/) and [Bun](https://bun.sh/)
