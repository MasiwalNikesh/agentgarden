/**
 * Workflow Editor Component using React Flow
 */
import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useWorkflowStore from '../store/workflowStore';

// Custom node types
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import HumanApprovalNode from './nodes/HumanApprovalNode';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  humanApproval: HumanApprovalNode,
};

const WorkflowEditor = () => {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes,
    setEdges,
  } = useWorkflowStore();

  const [nodes, , onNodesChange] = useNodesState(storeNodes);
  const [edges, , onEdgesChange] = useEdgesState(storeEdges);

  const onConnect = useCallback(
    (params) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
    },
    [edges, setEdges]
  );

  // Sync local state changes back to store
  React.useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  React.useEffect(() => {
    setEdges(edges);
  }, [edges, setEdges]);

  const onNodeDragStop = useCallback((event, node) => {
    console.log('Node dragged:', node);
  }, []);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default WorkflowEditor;
