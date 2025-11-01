/**
 * Core Workflow Types and Utilities
 * Defines the data structures for the interactive workflow editor
 */

// ============================================================================
// Node Types
// ============================================================================

export type NodeType = 'task' | 'code' | 'decision' | 'start' | 'end' | 'generic';
export type NodeStatus = 'idle' | 'running' | 'success' | 'error' | 'warning';

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type NodeData = {
  id: string;
  type: NodeType;
  position: Position;
  data: {
    label: string;
    description?: string;
    icon?: string;
    status?: NodeStatus;
    progress?: number; // 0-100
    // For code nodes
    code?: string;
    language?: string;
    // For decision nodes
    conditions?: { id: string; label: string; value: string }[];
    // For task nodes
    assignee?: string;
    dueDate?: Date;
    // Custom data
    [key: string]: any;
  };
  size?: Size;
  style?: any;
  selected?: boolean;
  dragging?: boolean;
  groupId?: string; // For NodeGroup
};

// ============================================================================
// Edge Types
// ============================================================================

export type EdgeType = 'default' | 'animated' | 'step' | 'bezier' | 'straight';
export type EdgeMarker = 'arrow' | 'arrowClosed' | 'circle' | 'none';

export type EdgeData = {
  id: string;
  type: EdgeType;
  source: string; // source node id
  target: string; // target node id
  sourceHandle?: string; // specific output handle
  targetHandle?: string; // specific input handle
  label?: string;
  animated?: boolean;
  style?: any;
  markerEnd?: EdgeMarker;
  markerStart?: EdgeMarker;
  selected?: boolean;
  // For decision branches
  condition?: string;
  // Custom data
  data?: {
    [key: string]: any;
  };
};

// ============================================================================
// Workflow State
// ============================================================================

export type WorkflowData = {
  id: string;
  name: string;
  description?: string;
  nodes: NodeData[];
  edges: EdgeData[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

// ============================================================================
// Handle Types (for connections)
// ============================================================================

export type HandleType = 'source' | 'target';
export type HandlePosition = 'top' | 'right' | 'bottom' | 'left';

export type Handle = {
  id: string;
  type: HandleType;
  position: HandlePosition;
  nodeId: string;
  offset?: { x: number; y: number };
};

// ============================================================================
// Connection State
// ============================================================================

export type Connection = {
  source: string;
  sourceHandle?: string;
  target?: string;
  targetHandle?: string;
};

// ============================================================================
// Drag State
// ============================================================================

export type DragNode = {
  nodeId: string;
  startPosition: Position;
  offset: Position;
};

// ============================================================================
// Node Group
// ============================================================================

export type NodeGroup = {
  id: string;
  label: string;
  nodeIds: string[];
  position: Position;
  size: Size;
  collapsed?: boolean;
  style?: any;
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate distance between two points
 */
export const getDistance = (p1: Position, p2: Position): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Check if a point is inside a rectangle
 */
export const isPointInRect = (
  point: Position,
  rect: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
};

/**
 * Get center point of a node
 */
export const getNodeCenter = (node: NodeData): Position => {
  const width = node.size?.width || 150;
  const height = node.size?.height || 60;
  return {
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
  };
};

/**
 * Calculate bezier curve path
 */
export const getBezierPath = (
  source: Position,
  target: Position
): string => {
  const dx = target.x - source.x;
  const dy = target.y - source.y;

  // Control point offset
  const offset = Math.abs(dx) / 2;

  return `M ${source.x},${source.y} C ${source.x + offset},${source.y} ${target.x - offset},${target.y} ${target.x},${target.y}`;
};

/**
 * Calculate straight line path
 */
export const getStraightPath = (
  source: Position,
  target: Position
): string => {
  return `M ${source.x},${source.y} L ${target.x},${target.y}`;
};

/**
 * Calculate step path (right angles)
 */
export const getStepPath = (
  source: Position,
  target: Position
): string => {
  const midX = source.x + (target.x - source.x) / 2;
  return `M ${source.x},${source.y} L ${midX},${source.y} L ${midX},${target.y} L ${target.x},${target.y}`;
};

/**
 * Generate unique ID
 */
export const generateId = (prefix: string = 'node'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Find node by ID
 */
export const findNode = (nodes: NodeData[], id: string): NodeData | undefined => {
  return nodes.find(node => node.id === id);
};

/**
 * Find edge by ID
 */
export const findEdge = (edges: EdgeData[], id: string): EdgeData | undefined => {
  return edges.find(edge => edge.id === id);
};

/**
 * Get connected edges for a node
 */
export const getConnectedEdges = (edges: EdgeData[], nodeId: string): EdgeData[] => {
  return edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
};

/**
 * Check if connection would create a cycle
 */
export const wouldCreateCycle = (
  edges: EdgeData[],
  source: string,
  target: string
): boolean => {
  const visited = new Set<string>();
  const queue = [target];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === source) return true;
    if (visited.has(current)) continue;

    visited.add(current);
    const outgoing = edges.filter(e => e.source === current);
    queue.push(...outgoing.map(e => e.target));
  }

  return false;
};

/**
 * Validate connection
 */
export const isValidConnection = (
  edges: EdgeData[],
  source: string,
  target: string
): boolean => {
  // Can't connect to self
  if (source === target) return false;

  // Check if connection already exists
  const exists = edges.some(e => e.source === source && e.target === target);
  if (exists) return false;

  // Check for cycles
  if (wouldCreateCycle(edges, source, target)) return false;

  return true;
};

/**
 * Get handle position on node
 */
export const getHandlePosition = (
  node: NodeData,
  handlePosition: HandlePosition
): Position => {
  const width = node.size?.width || 150;
  const height = node.size?.height || 60;
  const { x, y } = node.position;

  switch (handlePosition) {
    case 'top':
      return { x: x + width / 2, y };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
  }
};

/**
 * Fit view to nodes
 */
export const fitView = (
  nodes: NodeData[],
  containerWidth: number,
  containerHeight: number,
  padding: number = 50
): { x: number; y: number; zoom: number } => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, zoom: 1 };
  }

  // Calculate bounds
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach(node => {
    const width = node.size?.width || 150;
    const height = node.size?.height || 60;
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + width);
    maxY = Math.max(maxY, node.position.y + height);
  });

  const boundsWidth = maxX - minX;
  const boundsHeight = maxY - minY;

  // Calculate zoom to fit
  const zoomX = (containerWidth - padding * 2) / boundsWidth;
  const zoomY = (containerHeight - padding * 2) / boundsHeight;
  const zoom = Math.min(zoomX, zoomY, 1.5); // Max zoom 1.5x

  // Calculate center offset
  const x = (containerWidth - boundsWidth * zoom) / 2 - minX * zoom;
  const y = (containerHeight - boundsHeight * zoom) / 2 - minY * zoom;

  return { x, y, zoom };
};
