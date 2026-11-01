export type Role =
  | 'SUPER_ADMIN'
  | 'SECURITY_ADMIN'
  | 'MANAGER'
  | 'EMPLOYEE'
  | 'AUDITOR';

export type Permission =
  | 'agent.chat'
  | 'documents.read'
  | 'documents.write'
  | 'tools.execute'
  | 'approvals.request'
  | 'approvals.review'
  | 'audit.read'
  | 'audit.export'
  | 'users.manage'
  | 'policies.manage';

export type DataClassification = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export type Department = 'Engineering' | 'Finance' | 'Legal' | 'Security' | 'Operations' | 'All';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ApprovalRequirement = 'NONE' | 'MANAGER' | 'SECURITY_ADMIN' | 'DUAL_APPROVAL';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  classificationClearance: DataClassification;
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastActive: string;
  tenantId: string;
}

export interface Tenant {
  id: string;
  name: string;
  industry: string;
  plan: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  content: string;
  department: Department;
  classification: DataClassification;
  author: string;
  updatedAt: string;
  tags: string[];
  tenantId: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  risk: RiskLevel;
  requiredPermission: Permission;
  approvalRequirement: ApprovalRequirement;
  enabled: boolean;
  timeoutMs: number;
  category: string;
  parametersSchema: {
    type: string;
    properties: Record<string, { type: string; description: string; enum?: string[] }>;
    required: string[];
  };
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export interface ApprovalRequest {
  id: string;
  tenantId: string;
  toolId: string;
  toolName: string;
  actionDescription: string;
  targetResource: string;
  arguments: Record<string, any>;
  risk: RiskLevel;
  requesterId: string;
  requesterName: string;
  requesterRole: Role;
  requesterDepartment: Department;
  status: ApprovalStatus;
  createdAt: string;
  expiresAt: string;
  decidedAt?: string;
  decidedBy?: string;
  decidedByName?: string;
  decisionNotes?: string;
  executionResult?: {
    success: boolean;
    message: string;
    output?: any;
  };
  auditEventId?: string;
}

export type AuditActionType =
  | 'AGENT_CHAT'
  | 'TOOL_INVOCATION'
  | 'TOOL_EXECUTION'
  | 'APPROVAL_REQUESTED'
  | 'APPROVAL_DECISION'
  | 'ACCESS_DENIED'
  | 'POLICY_UPDATE'
  | 'ROLE_MODIFIED'
  | 'DATA_EXPORT';

export type AuditStatus = 'SUCCESS' | 'DENIED' | 'PENDING_APPROVAL' | 'FAILED' | 'CANCELLED';

export interface AuditEvent {
  id: string;
  timestamp: string;
  tenantId: string;
  actor: {
    id: string;
    name: string;
    role: Role;
    email: string;
    ip: string;
  };
  actionType: AuditActionType;
  resource: string;
  tool?: string;
  risk: RiskLevel;
  status: AuditStatus;
  policyEvaluated: string;
  reason: string;
  payload: Record<string, any>;
  previousHash: string;
  hash: string;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'ACCESS_CONTROL' | 'RISK_GUARDRAIL' | 'DATA_LEAK_PREVENTION' | 'COMPLIANCE';
  enforcement: 'ENFORCE' | 'MONITOR_ONLY' | 'DISABLED';
  rulesSummary: string;
  severity: RiskLevel;
  lastUpdated: string;
  updatedBy: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolInvocations?: Array<{
    toolName: string;
    displayName: string;
    args: Record<string, any>;
    status: 'SUCCESS' | 'DENIED' | 'APPROVAL_REQUIRED';
    output?: any;
    denialReason?: string;
    approvalId?: string;
    risk: RiskLevel;
  }>;
  approvalRequest?: ApprovalRequest;
  auditEventId?: string;
  dataClassificationViewed?: DataClassification;
}

export interface Conversation {
  id: string;
  title: string;
  userId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}
