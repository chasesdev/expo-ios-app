import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  ScrollView,
  TouchableOpacity,
  Text as RNText,
} from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Path } from 'react-native-svg';
import { Host } from '../../common/SwiftUIHost';
import { useTheme } from '../../../design-system';
import { WorkflowNode } from './Node';
import { WorkflowEdge } from './Edge';
import {
  WorkflowData,
  NodeData,
  EdgeData,
  Position,
  generateId,
  getNodeCenter,
  getHandlePosition,
  isValidConnection,
  fitView as calculateFitView,
  findNode,
} from './types';

export interface WorkflowPlannerProps {
  initialWorkflow?: WorkflowData;
  editable?: boolean;
  onWorkflowChange?: (workflow: WorkflowData) => void;
  onNodeSelect?: (nodeId: string | null) => void;
  onEdgeSelect?: (edgeId: string | null) => void;
  containerWidth?: number;
  containerHeight?: number;
  testID?: string;
}

/**
 * WorkflowPlanner - Interactive workflow editor component
 * Full drag-drop, pan-zoom, connect nodes functionality
 */
export const WorkflowPlanner = React.memo(function WorkflowPlanner({
  initialWorkflow,
  editable = true,
  onWorkflowChange,
  onNodeSelect,
  onEdgeSelect,
  containerWidth = 800,
  containerHeight = 600,
  testID,
}: WorkflowPlannerProps) {
  const theme = useTheme();

  // Workflow state
  const [nodes, setNodes] = useState<NodeData[]>(initialWorkflow?.nodes || []);
  const [edges, setEdges] = useState<EdgeData[]>(initialWorkflow?.edges || []);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Viewport state (pan/zoom)
  const [viewport, setViewport] = useState({
    x: initialWorkflow?.viewport?.x || 0,
    y: initialWorkflow?.viewport?.y || 0,
    zoom: initialWorkflow?.viewport?.zoom || 1,
  });

  // Drag state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const nodeDragOffset = useRef<Position>({ x: 0, y: 0 });
  const initialNodePosition = useRef<Position>({ x: 0, y: 0 });
  const initialViewportPosition = useRef<Position>({ x: 0, y: 0 });

  // Connection state
  const [connecting, setConnecting] = useState<{
    sourceNodeId: string;
    sourceHandle: string;
  } | null>(null);
  const [connectionEnd, setConnectionEnd] = useState<Position | null>(null);

  // Pan responder for canvas
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        dragStartPos.current = { x: locationX, y: locationY };
        initialViewportPosition.current = { x: viewport.x, y: viewport.y };
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (!editable) return;

        if (draggingNodeId) {
          // Node dragging - use initial position plus delta
          const newX = initialNodePosition.current.x + gestureState.dx / viewport.zoom;
          const newY = initialNodePosition.current.y + gestureState.dy / viewport.zoom;
          updateNodePosition(draggingNodeId, { x: newX, y: newY });
        } else if (connecting) {
          // Connection dragging
          const { locationX, locationY } = evt.nativeEvent;
          setConnectionEnd({
            x: (locationX - viewport.x) / viewport.zoom,
            y: (locationY - viewport.y) / viewport.zoom,
          });
        } else {
          // Canvas panning - use initial viewport position plus delta
          setViewport(prev => ({
            ...prev,
            x: initialViewportPosition.current.x + gestureState.dx,
            y: initialViewportPosition.current.y + gestureState.dy,
          }));
        }
      },
      onPanResponderRelease: () => {
        if (draggingNodeId) {
          setDraggingNodeId(null);
          emitWorkflowChange();
        }
        if (connecting && connectionEnd) {
          // Try to complete connection by finding nearby target handle
          const targetNode = findNearestNodeHandle(connectionEnd, nodes, connecting.sourceNodeId);
          if (targetNode) {
            const newEdge: EdgeData = {
              id: generateId('edge'),
              type: 'bezier',
              source: connecting.sourceNodeId,
              target: targetNode.nodeId,
              sourceHandle: connecting.sourceHandle,
              targetHandle: targetNode.handle,
              markerEnd: 'arrowClosed',
            };

            if (isValidConnection(newEdge, nodes, edges)) {
              setEdges(prev => [...prev, newEdge]);
              emitWorkflowChange();
            }
          }
          setConnecting(null);
          setConnectionEnd(null);
        }
      },
    })
  ).current;

  // Helper functions
  const findNearestNodeHandle = (
    point: Position,
    nodes: NodeData[],
    excludeNodeId: string
  ): { nodeId: string; handle: string } | null => {
    const threshold = 30; // Distance threshold for snapping to handle

    for (const node of nodes) {
      if (node.id === excludeNodeId) continue;

      const handles = ['top', 'right', 'bottom', 'left'];
      for (const handle of handles) {
        const handlePos = getHandlePosition(node, handle as any);
        const distance = Math.sqrt(
          Math.pow(point.x - handlePos.x, 2) + Math.pow(point.y - handlePos.y, 2)
        );

        if (distance < threshold) {
          return { nodeId: node.id, handle };
        }
      }
    }

    return null;
  };

  const updateNodePosition = (nodeId: string, position: Position) => {
    setNodes(prev =>
      prev.map(node =>
        node.id === nodeId ? { ...node, position } : node
      )
    );
  };

  const selectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
    onNodeSelect?.(nodeId);
  };

  const selectEdge = (edgeId: string | null) => {
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
    onEdgeSelect?.(edgeId);
  };

  const addNode = (type: NodeData['type']) => {
    const newNode: NodeData = {
      id: generateId('node'),
      type,
      position: {
        x: (containerWidth / 2 - viewport.x) / viewport.zoom - 90,
        y: (containerHeight / 2 - viewport.y) / viewport.zoom - 30,
      },
      data: {
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        status: 'idle',
      },
    };
    setNodes(prev => [...prev, newNode]);
    selectNode(newNode.id);
    emitWorkflowChange();
  };

  const deleteSelected = () => {
    if (selectedNodeId) {
      setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
      setEdges(prev => prev.filter(e => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setEdges(prev => prev.filter(e => e.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    }
    emitWorkflowChange();
  };

  const fitView = () => {
    const fitted = calculateFitView(nodes, containerWidth, containerHeight);
    setViewport(fitted);
  };

  const zoomIn = () => {
    setViewport(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 2) }));
  };

  const zoomOut = () => {
    setViewport(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.5) }));
  };

  const emitWorkflowChange = () => {
    if (onWorkflowChange) {
      onWorkflowChange({
        id: initialWorkflow?.id || generateId('workflow'),
        name: initialWorkflow?.name || 'Untitled Workflow',
        nodes,
        edges,
        viewport,
      });
    }
  };

  // Render connection handle
  const renderHandle = (nodeId: string, type: 'source' | 'target', position: 'top' | 'right' | 'bottom' | 'left') => {
    const handleSize = 12;
    const offset = -handleSize / 2;

    const positionStyles: any = {
      top: { top: offset, left: '50%', marginLeft: offset },
      right: { right: offset, top: '50%', marginTop: offset },
      bottom: { bottom: offset, left: '50%', marginLeft: offset },
      left: { left: offset, top: '50%', marginTop: offset },
    };

    return (
      <TouchableOpacity
        style={[
          styles.handle,
          positionStyles[position],
          {
            width: handleSize,
            height: handleSize,
            backgroundColor: type === 'source' ? '#10B981' : '#3B82F6',
          },
        ]}
        onPress={() => {
          if (type === 'source') {
            setConnecting({ sourceNodeId: nodeId, sourceHandle: position });
          }
        }}
      />
    );
  };

  return (
    <View style={[styles.container, { width: containerWidth, height: containerHeight }]} testID={testID}>
      {/* Controls */}
      {editable && (
        <View style={styles.controls}>
          <Host>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {/* Add Node Buttons */}
              <TouchableOpacity onPress={() => addNode('task')} style={styles.controlButton}>
                <RNText style={styles.controlText}>+ Task</RNText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addNode('code')} style={styles.controlButton}>
                <RNText style={styles.controlText}>+ Code</RNText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => addNode('decision')} style={styles.controlButton}>
                <RNText style={styles.controlText}>+ Decision</RNText>
              </TouchableOpacity>

              {/* Zoom Controls */}
              <TouchableOpacity onPress={zoomOut} style={styles.controlButton}>
                <RNText style={styles.controlText}>−</RNText>
              </TouchableOpacity>
              <TouchableOpacity onPress={zoomIn} style={styles.controlButton}>
                <RNText style={styles.controlText}>+</RNText>
              </TouchableOpacity>
              <TouchableOpacity onPress={fitView} style={styles.controlButton}>
                <RNText style={styles.controlText}>Fit</RNText>
              </TouchableOpacity>

              {/* Delete */}
              {(selectedNodeId || selectedEdgeId) && (
                <TouchableOpacity onPress={deleteSelected} style={[styles.controlButton, styles.deleteButton]}>
                  <RNText style={[styles.controlText, { color: '#FFFFFF' }]}>Delete</RNText>
                </TouchableOpacity>
              )}
            </View>
          </Host>
        </View>
      )}

      {/* Canvas */}
      <View
        style={[styles.canvas, { backgroundColor: theme.colors.background.rgb }]}
        {...panResponder.panHandlers}
      >
        {/* Grid Background (SVG) */}
        <Svg
          width={containerWidth}
          height={containerHeight}
          style={styles.grid}
        >
          <Defs>
            <Pattern
              id="grid-pattern"
              x={viewport.x % 20}
              y={viewport.y % 20}
              width={20 * viewport.zoom}
              height={20 * viewport.zoom}
              patternUnits="userSpaceOnUse"
            >
              <Circle cx={1} cy={1} r={1} fill="#E5E7EB" opacity={0.5} />
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </Svg>

        <View
          style={[
            styles.viewport,
            {
              transform: [
                { translateX: viewport.x },
                { translateY: viewport.y },
                { scale: viewport.zoom },
              ],
            },
          ]}
        >
          {/* Edges */}
          {edges.map(edge => {
            const sourceNode = findNode(nodes, edge.source);
            const targetNode = findNode(nodes, edge.target);
            if (!sourceNode || !targetNode) return null;

            const sourcePos = getHandlePosition(sourceNode, 'bottom');
            const targetPos = getHandlePosition(targetNode, 'top');

            return (
              <WorkflowEdge
                key={edge.id}
                edge={edge}
                sourcePosition={sourcePos}
                targetPosition={targetPos}
                selected={edge.id === selectedEdgeId}
                onPress={() => selectEdge(edge.id)}
              />
            );
          })}

          {/* Active Connection Line */}
          {connecting && connectionEnd && (() => {
            const sourceNode = findNode(nodes, connecting.sourceNodeId);
            if (!sourceNode) return null;

            const sourcePos = getHandlePosition(sourceNode, connecting.sourceHandle as any);
            const path = `M ${sourcePos.x},${sourcePos.y} L ${connectionEnd.x},${connectionEnd.y}`;

            return (
              <Svg
                style={{ position: 'absolute', top: 0, left: 0, width: containerWidth, height: containerHeight, pointerEvents: 'none' }}
                width={containerWidth}
                height={containerHeight}
              >
                <Path
                  d={path}
                  stroke="#3B82F6"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  fill="none"
                />
              </Svg>
            );
          })()}

          {/* Nodes */}
          {nodes.map(node => (
            <WorkflowNode
              key={node.id}
              node={node}
              selected={node.id === selectedNodeId}
              onPress={() => selectNode(node.id)}
              onDragStart={() => {
                setDraggingNodeId(node.id);
                initialNodePosition.current = { ...node.position };
              }}
              renderHandle={(type, position) => renderHandle(node.id, type, position)}
            />
          ))}
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <RNText style={{ fontSize: 11, color: theme.colors.mutedForeground.rgb }}>
          {nodes.length} nodes • {edges.length} edges • {Math.round(viewport.zoom * 100)}% zoom
        </RNText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  canvas: {
    flex: 1,
    position: 'relative',
  },
  viewport: {
    flex: 1,
    position: 'relative',
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  controls: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 100,
  },
  controlButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  controlText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  handle: {
    position: 'absolute',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 50,
  },
  info: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});

// Example workflow
export const exampleWorkflow: WorkflowData = {
  id: 'workflow-1',
  name: 'User Authentication Flow',
  description: 'Complete OAuth authentication workflow',
  nodes: [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 250, y: 50 },
      data: { label: 'User Clicks Login' },
    },
    {
      id: 'task-1',
      type: 'task',
      position: { x: 200, y: 150 },
      data: {
        label: 'Redirect to OAuth Provider',
        description: 'Google/GitHub OAuth',
        status: 'success',
        progress: 100,
      },
    },
    {
      id: 'decision-1',
      type: 'decision',
      position: { x: 250, y: 280 },
      data: {
        label: 'Auth Success?',
        conditions: [
          { id: 'yes', label: 'Yes', value: 'true' },
          { id: 'no', label: 'No', value: 'false' },
        ],
      },
    },
    {
      id: 'code-1',
      type: 'code',
      position: { x: 150, y: 410 },
      data: {
        label: 'Generate JWT',
        code: 'const token = jwt.sign(\n  { userId: user.id },\n  SECRET,\n  { expiresIn: "24h" }\n);',
        language: 'javascript',
        status: 'success',
      },
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 250, y: 540 },
      data: { label: 'Redirect to App' },
    },
  ],
  edges: [
    { id: 'e1', type: 'bezier', source: 'start-1', target: 'task-1', markerEnd: 'arrowClosed' },
    { id: 'e2', type: 'bezier', source: 'task-1', target: 'decision-1', markerEnd: 'arrowClosed' },
    { id: 'e3', type: 'step', source: 'decision-1', target: 'code-1', label: 'Yes', markerEnd: 'arrowClosed' },
    { id: 'e4', type: 'bezier', source: 'code-1', target: 'end-1', markerEnd: 'arrowClosed' },
  ],
  viewport: { x: 50, y: 50, zoom: 1 },
};
