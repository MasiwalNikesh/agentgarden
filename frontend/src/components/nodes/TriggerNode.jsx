/**
 * Trigger Node Component for React Flow
 */
import React from 'react';
import { Handle, Position } from 'reactflow';

const TriggerNode = ({ data, isConnectable }) => {
  return (
    <div
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        border: '2px solid #2196F3',
        background: '#fff',
        minWidth: '150px',
      }}
    >
      <div>
        <strong>{data.label || 'Trigger'}</strong>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          {data.triggerType || 'Configure trigger'}
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

export default TriggerNode;
