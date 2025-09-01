/* eslint-disable no-unused-vars */
import { useState, useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ComponentPanel from './ComponentPanel'
import ConfigPanel from './ConfigPanel'
import ChatModal from './ChatModal'
import { nodeTypes } from './CustomNodes'
import { Save, Play, MessageCircle, ArrowLeft } from 'lucide-react'
import axios from 'axios'

const nodeTypeLabels = {
  userQuery: 'UserQuery',
  knowledgeBase: 'KnowledgeBase',
  llmEngine: 'LLMEngine',
  output: 'Output'
}

const WorkflowBuilder = ({ onBack }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState(null)
  const [showChat, setShowChat] = useState(false)
  const [workflowName, setWorkflowName] = useState('')
  const [saving, setSaving] = useState(false)
  const [validating, setValidating] = useState(false)
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)

  const onConnect = useCallback(
    (params) => {
      console.log('Connecting:', params)
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  const onDragOver = useCallback((event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: type, // Use the custom node type
        position,
        data: {
          label: nodeTypeLabels[type],
          type: nodeTypeLabels[type], // Use the display name for backend
          config: getDefaultConfig(type)
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes]
  )

  const getDefaultConfig = (type) => {
    switch (type) {
      case 'userQuery':
        return { placeholder: 'Enter your question...' }
      case 'knowledgeBase':
        return { collectionName: 'knowledge_base', chunkSize: 500 }
      case 'llmEngine':
        return {
          model: 'gpt-3.5-turbo',
          temperature: 0.7,
          maxTokens: 256,
          systemPrompt: 'You are a helpful assistant.'
        }
      case 'output':
        return { format: 'text' }
      default:
        return {}
    }
  }

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node)
  }, [])

  const updateNodeConfig = (nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config } }
          : node
      )
    )
  }

  const validateWorkflow = async () => {
    setValidating(true)
    try {
      const workflow = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.data.type,
          config: node.data.config
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target
        }))
      }

      // Basic client-side validation
      const hasUserQuery = nodes.some(node => node.data.type === 'UserQuery')
      const hasOutput = nodes.some(node => node.data.type === 'Output')

      if (!hasUserQuery) {
        throw new Error('Workflow must include a UserQuery component')
      }

      if (!hasOutput) {
        throw new Error('Workflow must include an Output component')
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Validation failed'
      }
    } finally {
      setValidating(false)
    }
  }

  const saveWorkflow = async () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name')
      return
    }

    setSaving(true)
    try {
      const workflow = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.data.type,
          config: node.data.config
        })),
        edges: edges.map(edge => ({
          source: edge.source,
          target: edge.target
        }))
      }

      await axios.post('http://localhost:8000/api/saveWorkflow', {
        name: workflowName,
        definition: workflow,
        owner: 'default_user'
      })

      alert('Workflow saved successfully!')
    } catch (error) {
      alert('Failed to save workflow: ' + (error.response?.data?.detail || error.message))
    } finally {
      setSaving(false)
    }
  }

  const runWorkflow = async () => {
    const validation = await validateWorkflow()
    if (!validation.success) {
      alert('Workflow validation failed: ' + validation.error)
      return
    }
    setShowChat(true)
  }

  const getCurrentWorkflow = () => {
    return {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.data.type,
        config: node.data.config
      })),
      edges: edges.map(edge => ({
        source: edge.source,
        target: edge.target
      }))
    }
  }

  return (
    <div className="workflow-builder">
      <div className="builder-header">
        <div className="workflow-controls">
          <button onClick={onBack} className="btn btn-secondary">
            <ArrowLeft size={16} />
            Back
          </button>
          <h1>GenAI Stack</h1>
        </div>
        <div className="workflow-controls">
          <input
            type="text"
            placeholder="Workflow Name"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="workflow-name-input"
          />
          <button onClick={saveWorkflow} disabled={saving} className="btn btn-secondary">
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>

        </div>
      </div>

      <div className="builder-content">
        <ComponentPanel />

        <div className="flow-container" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            connectionMode="loose"
            snapToGrid={true}
            snapGrid={[15, 15]}
            fitView
          >
            <Controls />

            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>

          {/* Floating Run Button */}
          <button
            onClick={runWorkflow}
            disabled={validating}
            className="floating-run-btn"
            title="Run Stack"
          >
            <Play size={20} />
            {validating ? 'Validating...' : ''}
          </button>

          {/* Floating Chat Button */}
          <button
            onClick={() => setShowChat(true)}
            className="floating-chat-btn"
            title="Chat with Stack"
          >
            <MessageCircle size={20} />

          </button>
        </div>

        <ConfigPanel
          selectedNode={selectedNode}
          onUpdateConfig={updateNodeConfig}
        />
      </div>

      {showChat && (
        <ChatModal
          workflow={getCurrentWorkflow()}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  )
}

export default WorkflowBuilder