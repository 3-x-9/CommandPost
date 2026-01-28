# CommandPost

**CommandPost** is a modern, high-performance API development environment designed to bridge the gap between interactive API exploration and automated CLI generation. Built with **Wails (Go)** and **React (TypeScript)**, it provides a premium developer experience for designing, testing, and graduates API interactions into production-ready standalone CLI tools.

---

## Key Features

###  Interactive API Workspace
- **OpenAPI 3.0 Integration**: Load specifications instantly via remote URL or local file (`JSON/YAML`).
- **Complete Request Builder**: Support for all HTTP methods (GET, POST, PUT, DELETE, PATCH) with full control over Query Params, Headers, and Request Bodies.
- **Advanced Authentication**: Built-in support for Bearer Tokens, Basic Auth, and API Keys (Header/Query).
- **Responsive Design**: Modern, dark-mode aesthetic with a resizable sidebar and intuitive layout.

### Production-Ready CLI Generation
- **Live Preview**: See a real-time preview of the equivalent CLI command as you build your request in the UI.
- **Cobra-Powered Scaffolding**: Generate complete, standalone Go source code for CLI tools directly from your OpenAPI spec.
- **Smart Organization**: Generated commands follow your spec's tags, with built-in validation, bash completion support, and environment variable overrides.

### History & Collections
- **Persistent Storage**: Every request and response is automatically saved to a local SQLite database using a high-concurrency WAL mode configuration.
- **Recursive Postman Import**: Seamlessly transition from Postman with full support for nested folders and complex collection structures.
- **Quick Replay**: Instantly re-run any request from your persistent history or saved collections.

### Environment Management
- **Switchable Contexts**: Manage multiple environments (Dev, Staging, Prod) with specific Base URLs and variables.
- **Dynamic Path Resolution**: Effortlessly switch between environment-specific targets without re-configuring your requests.

---

##  Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Wails v2](https://wails.io/) |
| **Backend** | Go 1.24.0, SQLite (modernc.org/sqlite) |
| **Frontend** | React 18, TypeScript, Vite |
| **Icons & UI** | Lucide React, Custom Vanilla CSS |

---

## Getting Started

### Prerequisites
- [Go](https://golang.org/doc/install) (1.24+)
- [Node.js](https://nodejs.org/) & [NPM](https://www.npmjs.com/)
- [Wails CLI](https://wails.io/docs/gettingstarted/installation)

### Installation & Development
1. **Clone & Setup**:
   ```bash
   git clone https://github.com/3-x-9/CommandPost.git
   cd CommandPost
   ```
2. **Launch Dev Environment**:
   ```bash
   wails dev
   ```
3. **Build Binary**:
   ```bash
   wails build
   ```

---

## Architecture

CommandPost is engineered for stability and performance:

- **Single Writer Pattern**: To prevent SQLite "database is locked" errors during high-concurrency scenarios, all database mutations are dispatched through a centralized Go channel (`dbChan`) and processed sequentially by a dedicated background worker.
- **WAL Mode**: SQLite is configured in **Write-Ahead Logging** mode to allow simultaneous reads while the worker is writing, ensuring the UI remains responsive at all times.
- **Wails Bridge**: Leverages native OS bindings for file selection, directory dialogs, and low-latency communication between the Go runtime and the React frontend.

---

## Author
**3-x-9** - [GitHub](https://github.com/3-x-9)

## License
This project is licensed under the MIT License.