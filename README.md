# CommandPost 🚀

CommandPost is a modern, cross-platform API development environment that bridges the gap between interactive API testing (like Postman) and automated CLI generation. Built with **Wails (Go)** and **React (TypeScript)**, it provides a premium developer experience for designing, testing, and graduates API interactions into standalone CLI tools.

![CommandPost Banner](https://via.placeholder.com/1200x400/1e293b/6366f1?text=CommandPost:+Interactive+API+Workspace+%2B+CLI+Generator)

## ✨ Features

### 🛠 Interactive API Workspace
- **OpenAPI Integration**: Load specifications via URL or local file (`JSON/YAML`).
- **Full Request Builder**: Support for Query Params, Headers, and Request Bodies.
- **Built-in Auth**: Support for Bearer Tokens and Basic Authentication (with more coming soon).
- **Responsive Layout**: Resizable sidebar and modern dark-mode aesthetic.

### 📜 History & Collections
- **Persistent History**: Every request is saved to a local SQLite database and survives application restarts.
- **Saved Collections**: Organize your most-used requests into custom folders.
- **Quick Replay**: Re-run any request from your history or collections with one click.

### 🏎 CLI Generation (Pro Feature)
- **Live Preview**: See a real-time preview of the equivalent CLI command as you build your request.
- **Standalone CLI Scaffolding**: Generate a complete, production-ready Go CLI from your OpenAPI spec.
  - Subcommands organized by tags.
  - Flag validation and environment variable support.
  - Built-in error handling and auth support.

## 🚀 Getting Started

### Prerequisites
- [Go](https://golang.org/doc/install) (1.21+)
- [Node.js](https://nodejs.org/) & [NPM](https://www.npmjs.com/)
- [Wails CLI](https://wails.io/docs/gettingstarted/installation)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/3-x-9/CommandPost.git
   cd CommandPost
   ```
2. Run in development mode:
   ```bash
   wails dev
   ```
3. To build a production binary:
   ```bash
   wails build
   ```

## 🛠 Project Structure
- `app.go`: Main Wails bridge logic (Go).
- `goInternal/`: Core backend logic, including the CLI generator and storage.
- `frontend/`: React source code (TypeScript/CSS).
- `frontend/src/components/`: Modular UI components (Layout, Request, Response, Sidebar, etc.).

## 🤝 Contributing
Contributions are welcome! Whether it's adding new auth types, improving the generator templates, or polishing the UI, feel free to open a PR.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Built with ❤️ by [3-x-9](https://github.com/3-x-9)
