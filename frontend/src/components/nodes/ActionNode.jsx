/**
 * Action Node Component for React Flow
 */
import React from 'react';
import { Handle, Position } from 'reactflow';

const ActionNode = ({ data, isConnectable }) => {
  return (
    <div
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        border: '2px solid #4CAF50',
        background: '#fff',
        minWidth: '150px',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div>
        <strong>{data.label || 'Action'}</strong>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          {data.actionType || 'Configure action'}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ActionNode;
