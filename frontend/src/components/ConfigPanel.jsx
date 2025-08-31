import { useState, useEffect } from 'react'
import { Upload, File } from 'lucide-react'
import axios from 'axios'

const ConfigPanel = ({ selectedNode, onUpdateConfig }) => {
  const [config, setConfig] = useState({})
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config || {})
    }
  }, [selectedNode])

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    if (selectedNode) {
      onUpdateConfig(selectedNode.id, newConfig)
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

  if (!selectedNode) {
    return (
      <div className="config-panel">
        <h3>Configuration</h3>
        <p>Select a component to configure its settings</p>
      </div>
    )
  }

  const renderConfigFields = () => {
    const nodeType = selectedNode.data.type

    switch (nodeType) {
      case 'UserQuery':
        return (
          <div className="config-section">
            <label>Placeholder Text</label>
            <input
              type="text"
              value={config.placeholder || ''}
              onChange={(e) => handleConfigChange('placeholder', e.target.value)}
              placeholder="Enter placeholder text..."
            />
          </div>
        )

      case 'KnowledgeBase':
        return (
          <div className="config-section">
            <label>Collection Name</label>
            <input
              type="text"
              value={config.collectionName || 'knowledge_base'}
              onChange={(e) => handleConfigChange('collectionName', e.target.value)}
            />
            
            <label>Chunk Size</label>
            <input
              type="number"
              value={config.chunkSize || 500}
              onChange={(e) => handleConfigChange('chunkSize', parseInt(e.target.value))}
              min="100"
              max="2000"
            />

            <label>Upload Document</label>
            <div className="file-upload">
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
                id="file-upload"
                style={{ display: 'none' }}
              />
              <label htmlFor="file-upload" className="upload-btn">
                <Upload size={16} />
                {uploading ? 'Uploading...' : 'Choose File'}
              </label>
              
              {config.uploadedFile && (
                <div className="uploaded-file">
                  <File size={16} />
                  <span>{config.uploadedFile.filename}</span>
                  <small>({config.uploadedFile.chunks} chunks)</small>
                </div>
              )}
            </div>
          </div>
        )

      case 'LLMEngine':
        return (
          <div className="config-section">
            <label>Model</label>
            <select
              value={config.model || 'gpt-3.5-turbo'}
              onChange={(e) => handleConfigChange('model', e.target.value)}
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gemini-pro">Gemini Pro</option>
            </select>

            <label>Temperature</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature || 0.7}
              onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
            />
            <span>{config.temperature || 0.7}</span>

            <label>Max Tokens</label>
            <input
              type="number"
              value={config.maxTokens || 256}
              onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
              min="50"
              max="4000"
            />

            <label>System Prompt</label>
            <textarea
              value={config.systemPrompt || ''}
              onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
              placeholder="You are a helpful assistant..."
              rows={4}
            />

            <label>
              <input
                type="checkbox"
                checked={config.useWebSearch || false}
                onChange={(e) => handleConfigChange('useWebSearch', e.target.checked)}
              />
              Enable Web Search
            </label>
          </div>
        )

      case 'Output':
        return (
          <div className="config-section">
            <label>Output Format</label>
            <select
              value={config.format || 'text'}
              onChange={(e) => handleConfigChange('format', e.target.value)}
            >
              <option value="text">Plain Text</option>
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={config.showSources || false}
                onChange={(e) => handleConfigChange('showSources', e.target.checked)}
              />
              Show Sources
            </label>
          </div>
        )

      default:
        return <p>No configuration available for this component</p>
    }
  }

  return (
    <div className="config-panel">
      <h3>Configuration</h3>
      <div className="selected-component">
        <h4>{selectedNode.data.label}</h4>
        <small>ID: {selectedNode.id}</small>
      </div>
      {renderConfigFields()}
    </div>
  )
}

export default ConfigPanel