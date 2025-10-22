/**
 * Workflow Editor Page Component
 */
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkflowEditor from '../components/WorkflowEditor';
import useWorkflowStore from '../store/workflowStore';

const WorkflowEditorPage = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const {
    currentWorkflow,
    fetchWorkflow,
    saveCurrentWorkflow,
    executeWorkflow,
    isLoading,
  } = useWorkflowStore();

  useEffect(() => {
    if (workflowId && workflowId !== 'new') {
      fetchWorkflow(workflowId);
    }
  }, [workflowId, fetchWorkflow]);

  const handleSave = async () => {
    const result = await saveCurrentWorkflow();
    if (result) {
      alert('Workflow saved successfully!');
    }
  };

  const handleExecute = async () => {
    if (!currentWorkflow) return;

    const inputData = {}; // TODO: Add input dialog
    const result = await executeWorkflow(currentWorkflow.id, inputData);

    if (result) {
      alert('Workflow execution started!');
      navigate(`/workflows/${currentWorkflow.id}/executions`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>{currentWorkflow?.name || 'New Workflow'}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} disabled={isLoading}>
            Save
          </button>
          <button onClick={handleExecute} disabled={isLoading || !currentWorkflow}>
            Execute
          </button>
          <button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      <WorkflowEditor />

      <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>Workflow Details</h3>
        {currentWorkflow && (
          <div>
            <p><strong>Name:</strong> {currentWorkflow.name}</p>
            <p><strong>Description:</strong> {currentWorkflow.description || 'N/A'}</p>
            <p><strong>Status:</strong> {currentWorkflow.status}</p>
            <p><strong>Created:</strong> {new Date(currentWorkflow.created_at).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowEditorPage;
