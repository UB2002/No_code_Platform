import { MessageSquare, Database, Brain, Monitor } from 'lucide-react'

const components = [
  {
    type: 'userQuery',
    label: 'User Query',
    icon: MessageSquare,
    description: 'Accepts user input and queries'
  },
  {
    type: 'knowledgeBase',
    label: 'Knowledge Base',
    icon: Database,
    description: 'Upload and search documents'
  },
  {
    type: 'llmEngine',
    label: 'LLM Engine',
    icon: Brain,
    description: 'Process queries with AI models'
  },
  {
    type: 'output',
    label: 'Output',
    icon: Monitor,
    description: 'Display results to user'
  }
]

const ComponentPanel = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="component-panel">
      <h3>Components</h3>
      <div className="component-list">
        {components.map((component) => {
          const IconComponent = component.icon
          return (
            <div
              key={component.type}
              className="component-item"
              onDragStart={(event) => onDragStart(event, component.type)}
              draggable
            >
              <div className="component-icon">
                <IconComponent size={24} />
              </div>
              <div className="component-info">
                <h4>{component.label}</h4>
                <p>{component.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ComponentPanel