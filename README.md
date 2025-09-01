# 🤖 GenAI Stack - Visual Workflow Builder

A modern, visual workflow builder for creating and running AI-powered workflows with drag-and-drop components, real-time chat interface, and seamless integration with LLMs and knowledge bases.

![GenAI Stack](https://img.shields.io/badge/GenAI-Stack-10b981?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)

## ✨ Features

### 🎨 **Visual Workflow Builder**
- **Drag & Drop Interface** - Intuitive component placement
- **Custom Node Design** - Professional, card-based components
- **Real-time Connections** - Visual workflow connections
- **Live Configuration** - Configure components on-the-fly

### 🧩 **Smart Components**
- **User Query** - Entry point for user questions
- **Knowledge Base** - Document upload and vector search
- **LLM Engine** - OpenAI/Gemini integration with customizable settings
- **Output** - Formatted response display

### 💬 **Interactive Chat**
- **Real-time Testing** - Test workflows instantly
- **Floating Chat Button** - Easy access to workflow interaction
- **Context-aware Responses** - Leverages uploaded documents

### 📊 **Workflow Management**
- **Save & Load** - Persistent workflow storage
- **Dashboard View** - Manage all your workflows
- **Run History** - Track workflow executions

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** database
- **Git**

### 📦 Installation

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-workflow-builder
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys
```

#### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

#### 4. Database Setup
```bash
# Create PostgreSQL database
createdb genai_workflows

# Update your .env file with database connection details
DATABASE_URL=postgresql://username:password@localhost/genai_workflows
```

### 🏃‍♂️ Running the Application

#### Start Backend Server
```bash
cd backend
uvicorn server:app --reload --port 8000
```

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```

#### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎯 Usage Guide

### Creating Your First Workflow

1. **Access Dashboard**
   - Navigate to http://localhost:3000
   - Click "Create New Workflow"

2. **Build Your Workflow**
   - **Drag components** from the left panel to the canvas
   - **Connect components** by dragging from output handles to input handles
   - **Configure each component** by clicking on them

3. **Basic RAG Workflow Example**
   ```
   User Query → Knowledge Base → LLM Engine → Output
   ```

4. **Configure Components**
   - **User Query**: Set placeholder text
   - **Knowledge Base**: Upload PDF documents
   - **LLM Engine**: Choose model, set temperature, customize prompt
   - **Output**: Select output format

5. **Test Your Workflow**
   - Click the green **"Run Stack"** button
   - Or use the floating **"Chat with Stack"** button
   - Ask questions and see AI responses

6. **Save Your Workflow**
   - Enter a workflow name
   - Click **"Save"** button
   - Access from dashboard later

### Component Configuration

#### 🔤 **User Query Component**
- **Purpose**: Entry point for user questions
- **Configuration**: 
  - Placeholder text for input field

#### 📚 **Knowledge Base Component**
- **Purpose**: Document storage and retrieval
- **Configuration**:
  - Collection name
  - Chunk size (100-2000)
  - Document upload (PDF, TXT, DOC)

#### 🧠 **LLM Engine Component**
- **Purpose**: AI text generation
- **Configuration**:
  - Model selection (GPT-3.5, GPT-4, Gemini)
  - Temperature (0.0-1.0)
  - Max tokens (50-4000)
  - System prompt customization
  - Web search toggle

#### 📤 **Output Component**
- **Purpose**: Response formatting
- **Configuration**:
  - Output format (Text, Markdown, JSON)
  - Show sources toggle

## 🏗️ Architecture

### Frontend Structure
```
frontend/src/
├── components/
│   ├── Dashboard.jsx          # Workflow management
│   ├── WorkflowBuilder.jsx    # Visual editor
│   ├── WorkflowRunner.jsx     # Execution interface
│   ├── CustomNodes.jsx        # Node components
│   ├── ComponentPanel.jsx     # Component library
│   ├── ConfigPanel.jsx        # Configuration panel
│   ├── ChatModal.jsx          # Chat interface
│   └── Navbar.jsx            # Navigation
├── services/
│   └── api.js                # API client
└── App.jsx                   # Main application
```

### Backend Structure
```
backend/
├── routes/
│   ├── llmRoute.py           # Workflow endpoints
│   └── userRoute.py          # User management
├── core/
│   ├── workflow.py           # Workflow execution
│   ├── hf.py                 # LLM integration
│   ├── extractor.py          # Document processing
│   └── chroma_client.py      # Vector database
├── models/
│   ├── llm.py               # Database models
│   └── user.py              # User models
└── server.py                # FastAPI application
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost/genai_workflows

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Hugging Face (optional)
HUGGINGFACE_API_KEY=your_hf_api_key

# File Upload
UPLOAD_DIR=./uploaded_docs

# CORS (development)
CORS_ORIGINS=http://localhost:3000
```

### Database Schema

The application uses PostgreSQL with the following main tables:
- `workflows` - Stores workflow definitions
- `documents` - Manages uploaded files
- `chatlogs` - Conversation history
- `users` - User management (optional)

## 🚀 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
```bash
cd backend
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example for backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Main Endpoints

- `GET /api/workflows` - List all workflows
- `POST /api/saveWorkflow` - Save a new workflow
- `DELETE /api/workflows/{id}` - Delete a workflow
- `POST /api/run-workflow-inline` - Execute workflow
- `POST /api/upload-doc` - Upload documents

### Workflow Definition Format

```json
{
  "name": "My RAG Workflow",
  "definition": {
    "nodes": [
      {
        "id": "userQuery-123",
        "type": "UserQuery",
        "config": {
          "placeholder": "Ask your question..."
        }
      }
    ],
    "edges": [
      {
        "source": "userQuery-123",
        "target": "output-456"
      }
    ]
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for your frontend URL
   - Check that both servers are running

2. **Database Connection**
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env file

3. **File Upload Issues**
   - Ensure UPLOAD_DIR exists and is writable
   - Check file size limits

4. **ChromaDB Collection Errors**
   - Collection names must be 3-512 characters
   - Use alphanumeric characters, dots, underscores, hyphens

### Debug Mode

Enable debug logging:
```bash
# Backend
uvicorn server:app --reload --log-level debug

# Frontend
npm run dev -- --debug
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Flow** - For the visual workflow editor
- **FastAPI** - For the high-performance backend
- **ChromaDB** - For vector database functionality
- **OpenAI** - For LLM integration
- **Lucide React** - For beautiful icons

---

**Built with ❤️ for the AI community**

For support, please open an issue or contact the development team.