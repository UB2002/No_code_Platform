import { Handle, Position } from '@xyflow/react'
import { MessageSquare, Database, Brain, FileOutput, Upload, File } from 'lucide-react'
import { useState } from 'react'
import axios from 'axios'

export const UserQueryNode = ({ data, selected }) => {
  const [queryText, setQueryText] = useState(data.config?.queryText || '')

  const handleConfigChange = (key, value) => {
    if (data.onConfigChange) {
      data.onConfigChange(data.id, { ...data.config, [key]: value })
    }
  }

  const handleQueryChange = (value) => {
    setQueryText(value)
    handleConfigChange('queryText', value)
  }

  return (
    <div className={`custom-node user-query-node ${selected ? 'selected' : ''}`}>
      {/* Header */}
      <div className="node-header">
        <div className="header-left">
          <MessageSquare size={20} className="node-icon" />
          <span className="node-title">User Query</span>
        </div>
      </div>

      {/* Content */}
      <div className="node-content">
        <div className="node-description">Enter point for queries</div>

        <div className="query-section">
          <div className="section-label">Enter Your Query</div>
          <div className="query-input-container">
            <textarea
              placeholder="Write your query here..."
              className="query-input"
              value={queryText}
              onChange={(e) => handleQueryChange(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Connection Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="custom-handle"
        id="query"
        style={{ right: -9 }}
      />
    </div>
  )
}

export const KnowledgeBaseNode = ({ data, selected }) => {
  const [uploading, setUploading] = useState(false)

  const handleConfigChange = (key, value) => {
    if (data.onConfigChange) {
      data.onConfigChange(data.id, { ...data.config, [key]: value })
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('metadata', JSON.stringify({ uploadedAt: new Date().toISOString() }))

      const response = await axios.post('http://localhost:8000/api/upload-doc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      handleConfigChange('uploadedFile', {
        fileId: response.data.file_id,
        filename: response.data.filename,
        chunks: response.data.chunks
      })

      alert(`File uploaded successfully! ${response.data.chunks} chunks created.`)
    } catch (error) {
      alert('File upload failed: ' + (error.response?.data?.detail || error.message))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={`custom-node knowledge-base-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <div className="header-left">
          <Database size={20} className="node-icon" />
          <span className="node-title">Knowledge Base</span>
        </div>
      </div>

      <div className="node-content">
        <div className="node-description">Let LLM search info in your file</div>

        <div className="inline-config">
          <label>Collection Name</label>
          <input
            type="text"
            value={data.config?.collectionName || 'knowledge_base'}
            onChange={(e) => handleConfigChange('collectionName', e.target.value)}
            className="config-input"
          />

          <label>Chunk Size</label>
          <input
            type="number"
            value={data.config?.chunkSize || 500}
            onChange={(e) => handleConfigChange('chunkSize', parseInt(e.target.value))}
            min="100"
            max="2000"
            className="config-input"
          />

          <label>Upload Document</label>
          <div className="file-upload-inline">
            <input
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              disabled={uploading}
              id={`file-upload-${data.id}`}
              style={{ display: 'none' }}
            />
            <label htmlFor={`file-upload-${data.id}`} className="upload-btn-inline">
              <Upload size={14} />
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
          </div>
        </div>

        <div className="file-section">
          <div className="section-label">File Status</div>
          <div className="file-display">
            {data.config?.uploadedFile ? (
              <div className="uploaded-file">
                <File size={16} />
                <span>{data.config.uploadedFile.filename}</span>
                <small>({data.config.uploadedFile.chunks} chunks)</small>
              </div>
            ) : (
              <div className="no-file">
                <span>No file uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="custom-handle"
        id="input"
        style={{ left: -6, top: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="custom-handle"
        id="context"
        style={{ right: -6, top: '50%' }}
      />
    </div>
  )
}

export const LLMEngineNode = ({ data, selected }) => {
  const handleConfigChange = (key, value) => {
    if (data.onConfigChange) {
      data.onConfigChange(data.id, { ...data.config, [key]: value })
    }
  }

  return (
    <div className={`custom-node llm-engine-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <div className="header-left">
          <Brain size={20} className="node-icon" />
          <span className="node-title">LLM (OpenAI)</span>
        </div>
      </div>

      <div className="node-content">
        <div className="node-description">Run a query with OpenAI LLM</div>

        <div className="inline-config">
          <label>Model</label>
          <select
            value={data.config?.model || 'gpt-3.5-turbo'}
            onChange={(e) => handleConfigChange('model', e.target.value)}
            className="config-select"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gemini-pro">Gemini Pro</option>
          </select>

          <label>Temperature: {data.config?.temperature || 0.7}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={data.config?.temperature || 0.7}
            onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
            className="config-range"
          />

          <label>Max Tokens</label>
          <input
            type="number"
            value={data.config?.maxTokens || 256}
            onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
            min="50"
            max="4000"
            className="config-input"
          />

          <label>System Prompt</label>
          <textarea
            value={data.config?.systemPrompt || ''}
            onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
            placeholder="You are a helpful assistant..."
            rows={3}
            className="config-textarea"
          />

          <label className="config-checkbox">
            <input
              type="checkbox"
              checked={data.config?.useWebSearch || false}
              onChange={(e) => handleConfigChange('useWebSearch', e.target.checked)}
            />
            Enable Web Search
          </label>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="custom-handle"
        id="input"
        style={{ left: -6, top: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="custom-handle"
        id="response"
        style={{ right: -6, top: '50%' }}
      />
    </div>
  )
}

export const OutputNode = ({ data, selected }) => {
  const handleConfigChange = (key, value) => {
    if (data.onConfigChange) {
      data.onConfigChange(data.id, { ...data.config, [key]: value })
    }
  }

  return (
    <div className={`custom-node output-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <div className="header-left">
          <FileOutput size={20} className="node-icon" />
          <span className="node-title">Output</span>
        </div>
      </div>

      <div className="node-content">
        <div className="node-description">Output of the final results as text</div>

        <div className="inline-config">
          <label>Output Format</label>
          <select
            value={data.config?.format || 'text'}
            onChange={(e) => handleConfigChange('format', e.target.value)}
            className="config-select"
          >
            <option value="text">Plain Text</option>
            <option value="markdown">Markdown</option>
            <option value="json">JSON</option>
          </select>

          <label className="config-checkbox">
            <input
              type="checkbox"
              checked={data.config?.showSources || false}
              onChange={(e) => handleConfigChange('showSources', e.target.checked)}
            />
            Show Sources
          </label>
        </div>

        <div className="output-section">
          <div className="section-label">Output Preview</div>
          <div className="output-display">
            Output will be generated based on query
            {data.config?.format && data.config.format !== 'text' && (
              <small> (Format: {data.config.format})</small>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="custom-handle"
        id="input"
        style={{ left: -6, top: '50%' }}
      />
    </div>
  )
}

export const nodeTypes = {
  userQuery: UserQueryNode,
  knowledgeBase: KnowledgeBaseNode,
  llmEngine: LLMEngineNode,
  output: OutputNode,
}