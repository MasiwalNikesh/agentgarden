/**
 * Human Approval Node Component for React Flow
 */
import React from 'react';
import { Handle, Position } from 'reactflow';

const HumanApprovalNode = ({ data, isConnectable }) => {
  return (
    <div
      style={{
        padding: '10px 20px',
        borderRadius: '8px',
        border: '2px solid #9C27B0',
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
        <strong>{data.label || 'Human Approval'}</strong>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Requires approval
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

export default HumanApprovalNode;
