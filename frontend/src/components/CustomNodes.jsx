import { Handle, Position } from '@xyflow/react'
import { MessageSquare, Database, Brain, FileOutput, Settings } from 'lucide-react'

export const UserQueryNode = ({ data, selected }) => {
  return (
    <div className={`custom-node user-query-node ${selected ? 'selected' : ''}`}>
      {/* Header */}
      <div className="node-header">
        <div className="header-left">
          <MessageSquare size={20} className="node-icon" />
          <span className="node-title">User Query</span>
        </div>
        <Settings size={18} className="node-settings" />
      </div>
      
      {/* Content */}
      <div className="node-content">
        <div className="node-description">Enter point for querys</div>
        
        <div className="query-section">
          <div className="section-label">User Query</div>
          <div className="query-input-container">
            <textarea 
              placeholder="Write your query here"
              className="query-input"
              readOnly
              value={data.config?.placeholder || ''}
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
        style={{ right: -9}}
      />
    </div>
  )
}

export const KnowledgeBaseNode = ({ data, selected }) => {
  return (
    <div className={`custom-node knowledge-base-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <div className="header-left">
          <Database size={20} className="node-icon" />
          <span className="node-title">Knowledge Base</span>
        </div>
        <Settings size={18} className="node-settings" />
      </div>
      
      <div className="node-content">
        <div className="node-description">Let LLM search info in your file</div>
        
        <div className="file-section">
          <div className="section-label">File for Knowledge Base</div>
          <div className="file-display">
            {data.config?.uploadedFile ? (
              <div className="uploaded-file">
                📄 {data.config.uploadedFile.filename}
              </div>
            ) : (
              <div className="no-file">No file uploaded</div>
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
  return (
    <div className={`custom-node llm-engine-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <div className="header-left">
          <Brain size={20} className="node-icon" />
          <span className="node-title">LLM (OpenAI)</span>
        </div>
        <Settings size={18} className="node-settings" />
      </div>
      
      <div className="node-content">
        <div className="node-description">Run a query with OpenAI LLM</div>
        
        <div className="config-display">
          <div className="config-item">
            <span className="config-label">Model:</span>
            <span className="config-value">{data.config?.model || 'GPT-3.5 Turbo'}</span>
          </div>
          <div className="config-item">
            <span className="config-label">Temperature:</span>
            <span className="config-value">{data.config?.temperature || 0.7}</span>
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
        id="response"
        style={{ right: -6, top: '50%' }}
      />
    </div>
  )
}

export const OutputNode = ({  selected }) => {
  return (
    <div className={`custom-node output-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <div className="header-left">
          <FileOutput size={20} className="node-icon" />
          <span className="node-title">Output</span>
        </div>
        <Settings size={18} className="node-settings" />
      </div>
      
      <div className="node-content">
        <div className="node-description">Output of the final results as text</div>
        
        <div className="output-section">
          <div className="section-label">Output Text</div>
          <div className="output-display">
            Output will be generated based on query
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