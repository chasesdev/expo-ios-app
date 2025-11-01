// Conversation Components (Phase 3 - Batch 1)
export { Message, exampleMessages } from './Message';
export type { MessageProps, MessageAttachment, MessageReaction } from './Message';

export { Response, exampleResponses } from './Response';
export type { ResponseProps } from './Response';

export { Suggestion, exampleSuggestions, quickActionSuggestions } from './Suggestion';
export type { SuggestionProps, SuggestionOption } from './Suggestion';

export { Conversation, exampleConversation } from './Conversation';
export type { ConversationProps } from './Conversation';

export { PromptInput, examplePromptSuggestions } from './PromptInput';
export type { PromptInputProps, PromptAttachment } from './PromptInput';

// Content Display Components (Phase 3 - Batch 2)
export { Artifact, exampleArtifacts } from './Artifact';
export type { ArtifactProps, Artifact as ArtifactData } from './Artifact';

export { Image as AIImage, exampleImages } from './Image';
export type { AIImageProps, AIImageSource } from './Image';

export { Sources, exampleSources } from './Sources';
export type { SourcesProps, Source } from './Sources';

export { InlineCitation, ExampleTextWithCitations } from './InlineCitation';
export type { InlineCitationProps } from './InlineCitation';

export { WebPreview, exampleWebPreviews } from './WebPreview';
export type { WebPreviewProps, WebPreviewData } from './WebPreview';

// Tool & Context Components (Phase 3 - Batch 3)
export { Tool, exampleTools } from './Tool';
export type { ToolProps, ToolData, ToolStatus } from './Tool';

export { Context, exampleContextItems } from './Context';
export type { ContextProps, ContextItem, ContextType } from './Context';

// Action Components (Phase 3 - Batch 4)
export { Actions, exampleActionGroups, ExampleActionsCard } from './Actions';
export type { ActionsProps, Action, ActionType } from './Actions';

export { Toolbar, exampleToolbars, ExampleToolbarsDemo } from './Toolbar';
export type { ToolbarProps, ToolbarItem } from './Toolbar';

export { OpenInChat, exampleOpenInChat, ExampleOpenInChatVariants } from './OpenInChat';
export type { OpenInChatProps } from './OpenInChat';

// Terminal/VCR Component (Phase 3 - Bonus)
export { Terminal, exampleRecordings } from './Terminal';
export type { TerminalProps, TerminalRecording, TerminalFrame, TerminalFrameType } from './Terminal';

// Planning & Reasoning Components (Phase 4)
export { Plan, examplePlans } from './Plan';
export type { PlanProps, PlanData, PlanStep } from './Plan';

export { Task, exampleTasks } from './Task';
export type { TaskProps, TaskData, TaskStatus, TaskPriority } from './Task';

export { ChainOfThought, exampleChainOfThought } from './ChainOfThought';
export type { ChainOfThoughtProps, ChainOfThoughtData, ThoughtStep } from './ChainOfThought';

export { Reasoning, exampleReasoning } from './Reasoning';
export type { ReasoningProps, ReasoningData } from './Reasoning';

// Workflow Components (Phase 4 - Complete Interactive Editor)
export { WorkflowPlanner, WorkflowNode, WorkflowEdge, exampleWorkflow, exampleNodes, exampleEdges } from './workflow';
export type {
  WorkflowData,
  NodeData,
  EdgeData,
  NodeType,
  NodeStatus,
  EdgeType,
  Position,
  Handle,
  Connection,
} from './workflow';
