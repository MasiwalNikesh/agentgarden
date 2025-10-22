/**
 * Condition Node Component for React Flow
 */
import React from 'react';
import { Handle, Position } from 'reactflow';

const ConditionNode = ({ data, isConnectable }) => {
  return (
    <div
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        border: '2px solid #FF9800',
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
        <strong>{data.label || 'Condition'}</strong>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          {data.condition || 'Configure condition'}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '30%' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '70%' }}
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ConditionNode;
