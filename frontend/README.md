# AI Workflow Builder - Frontend

A React-based frontend for the AI Workflow Builder application that allows users to create visual workflows with drag-and-drop components.

## Features

- **Visual Workflow Builder**: Drag-and-drop interface using React Flow
- **Component Library**: Pre-built components (User Query, Knowledge Base, LLM Engine, Output)
- **Configuration Panel**: Dynamic configuration for each component type
- **Document Upload**: Upload and process PDF documents for knowledge base
- **Chat Interface**: Interactive chat to test workflows
- **Workflow Management**: Save, load, and manage multiple workflows

## Components

### Core Components
- **User Query**: Entry point for user input
- **Knowledge Base**: Document upload and vector search
- **LLM Engine**: AI model integration with configurable parameters
- **Output**: Display results in various formats

### Key Features
- Real-time workflow validation
- Responsive design for mobile and desktop
- File upload with progress tracking
- Chat history and conversation management
- Workflow sharing and collaboration

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Backend Integration

The frontend integrates with the FastAPI backend through the following endpoints:

- `GET /api/workflows` - Get all workflows
- `POST /api/save-workflow` - Save workflow definition
- `POST /api/run-workflow-inline` - Execute workflow with query
- `POST /api/upload-doc` - Upload documents to knowledge base

## Environment Setup

Make sure your backend is running on `http://localhost:8000` before starting the frontend.

## Technology Stack

- **React 19** - UI framework
- **React Router** - Client-side routing
- **React Flow** - Visual workflow editor
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx   # Main dashboard
│   ├── WorkflowBuilder.jsx  # Visual editor
│   ├── ComponentPanel.jsx   # Component library
│   ├── ConfigPanel.jsx     # Configuration panel
│   ├── ChatModal.jsx       # Chat interface
│   └── WorkflowRunner.jsx  # Workflow execution
├── services/          # API services
│   └── api.js        # HTTP client setup
└── App.jsx           # Main application component
```

## Usage

1. **Create Workflow**: Use the visual editor to drag and drop components
3. **Configure Components**: Select components to configure their settings
4. **Upload Documents**: Add documents to the knowledge base component
5. **Save Workflow**: Give your workflow a name and save it
6. **Test Workflow**: Use the chat interface to test your workflow
7. **Manage Workflows**: View, run, or delete existing workflows from the dashboard

## Development

- The app uses React 19 with modern hooks and context API
- Styling is done with vanilla CSS for maximum compatibility
- Components are modular and reusable
- State management uses React hooks and local state
- API calls are centralized in the services directory
