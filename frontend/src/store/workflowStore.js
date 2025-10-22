/**
 * Workflow state management using Zustand
 */
import { create } from 'zustand';
import { workflowAPI } from '../services/api';

const useWorkflowStore = create((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  executions: [],
  isLoading: false,
  error: null,

  // React Flow state
  nodes: [],
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    // Handle node changes from React Flow
    console.log('Nodes changed:', changes);
  },

  onEdgesChange: (changes) => {
    // Handle edge changes from React Flow
    console.log('Edges changed:', changes);
  },

  onConnect: (connection) => {
    // Handle new connections
    console.log('New connection:', connection);
  },

  fetchWorkflows: async () => {
    set({ isLoading: true, error: null });
    try {
      const workflows = await workflowAPI.listWorkflows();
      set({ workflows, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch workflows',
        isLoading: false,
      });
    }
  },

  fetchWorkflow: async (workflowId) => {
    set({ isLoading: true, error: null });
    try {
      const workflow = await workflowAPI.getWorkflow(workflowId);
      set({
        currentWorkflow: workflow,
        nodes: workflow.workflow_data?.nodes || [],
        edges: workflow.workflow_data?.edges || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch workflow',
        isLoading: false,
      });
    }
  },

  createWorkflow: async (workflowData) => {
    set({ isLoading: true, error: null });
    try {
      const workflow = await workflowAPI.createWorkflow(workflowData);
      set((state) => ({
        workflows: [...state.workflows, workflow],
        currentWorkflow: workflow,
        isLoading: false,
      }));
      return workflow;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to create workflow',
        isLoading: false,
      });
      return null;
    }
  },

  updateWorkflow: async (workflowId, workflowData) => {
    set({ isLoading: true, error: null });
    try {
      const workflow = await workflowAPI.updateWorkflow(workflowId, workflowData);
      set((state) => ({
        workflows: state.workflows.map((w) =>
          w.id === workflowId ? workflow : w
        ),
        currentWorkflow: workflow,
        isLoading: false,
      }));
      return workflow;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to update workflow',
        isLoading: false,
      });
      return null;
    }
  },

  saveCurrentWorkflow: async () => {
    const { currentWorkflow, nodes, edges } = get();
    if (!currentWorkflow) return;

    const workflowData = {
      ...currentWorkflow,
      workflow_data: { nodes, edges },
    };

    return await get().updateWorkflow(currentWorkflow.id, workflowData);
  },

  deleteWorkflow: async (workflowId) => {
    set({ isLoading: true, error: null });
    try {
      await workflowAPI.deleteWorkflow(workflowId);
      set((state) => ({
        workflows: state.workflows.filter((w) => w.id !== workflowId),
        currentWorkflow: null,
        isLoading: false,
      }));
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to delete workflow',
        isLoading: false,
      });
      return false;
    }
  },

  executeWorkflow: async (workflowId, inputData) => {
    set({ isLoading: true, error: null });
    try {
      const execution = await workflowAPI.executeWorkflow(workflowId, inputData);
      set({ isLoading: false });
      return execution;
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to execute workflow',
        isLoading: false,
      });
      return null;
    }
  },

  fetchExecutions: async (workflowId) => {
    set({ isLoading: true, error: null });
    try {
      const executions = await workflowAPI.listExecutions(workflowId);
      set({ executions, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.detail || 'Failed to fetch executions',
        isLoading: false,
      });
    }
  },
}));

export default useWorkflowStore;
