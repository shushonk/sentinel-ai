import { AuditEvent, ApprovalRequest, ChatMessage, Role, RiskLevel, AuditStatus, ApprovalStatus } from '../types';

const ROLES: Role[] = ['SUPER_ADMIN', 'SECURITY_ADMIN', 'MANAGER', 'EMPLOYEE', 'AUDITOR'];
const RISK_LEVELS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const AUDIT_STATUSES: AuditStatus[] = ['SUCCESS', 'DENIED', 'PENDING_APPROVAL', 'FAILED'];
const APPROVAL_STATUSES: ApprovalStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'];

const NAMES = ['Elena Vance', 'Marcus Chen', 'Sarah Miller', 'John Doe', 'Jane Smith', 'Robert Tables', 'Alice Cooper', 'Bob Builder'];
const RESOURCES = ['Project X Document', 'Security Policy v2', 'Employee Directory', 'Financial Report Q3', 'Cloud Infrastructure Config', 'HR Records', 'API Keys Vault'];
const TOOLS = ['search_docs', 'send_email', 'update_project', 'create_ticket', 'delete_record'];

export const generateMockAuditLogs = (count: number): AuditEvent[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `audit-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    tenantId: 'tenant-1',
    actor: {
      id: `u-${i % NAMES.length}`,
      name: NAMES[i % NAMES.length],
      role: ROLES[i % ROLES.length],
      email: `${NAMES[i % NAMES.length].toLowerCase().replace(' ', '.')}@sentinel.ai`,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    },
    actionType: ['AGENT_CHAT', 'TOOL_EXECUTION', 'ACCESS_DENIED', 'POLICY_UPDATE', 'DATA_EXPORT'][i % 5] as any,
    resource: RESOURCES[i % RESOURCES.length],
    tool: TOOLS[i % TOOLS.length],
    risk: RISK_LEVELS[i % RISK_LEVELS.length],
    status: AUDIT_STATUSES[i % AUDIT_STATUSES.length],
    policyEvaluated: 'Policy-' + (i % 10),
    reason: i % 4 === 0 ? 'Insufficient permissions' : 'Authorized by role',
    payload: { details: 'Mock audit log payload' },
    previousHash: '0x' + Math.random().toString(16).slice(2),
    hash: '0x' + Math.random().toString(16).slice(2),
  }));
};

export const generateMockApprovalRequests = (count: number): ApprovalRequest[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `appr-${i}`,
    tenantId: 'tenant-1',
    toolId: TOOLS[i % TOOLS.length],
    toolName: TOOLS[i % TOOLS.length].replace('_', ' ').toUpperCase(),
    actionDescription: `Execution of ${TOOLS[i % TOOLS.length]} on ${RESOURCES[i % RESOURCES.length]}`,
    targetResource: RESOURCES[i % RESOURCES.length],
    arguments: { param1: 'value', param2: 123 },
    risk: RISK_LEVELS[i % RISK_LEVELS.length],
    requesterId: `u-${i % NAMES.length}`,
    requesterName: NAMES[i % NAMES.length],
    requesterRole: ROLES[i % ROLES.length],
    requesterDepartment: 'Engineering',
    status: APPROVAL_STATUSES[i % APPROVAL_STATUSES.length],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockAgentRuns = (count: number): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `run-${i}`,
    userId: `u-${i % NAMES.length}`,
    userName: NAMES[i % NAMES.length],
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    prompt: `I need to ${TOOLS[i % TOOLS.length]} in ${RESOURCES[i % RESOURCES.length]}`,
    status: i % 10 === 0 ? 'FAILED' : 'SUCCESS',
    tokenCount: Math.floor(Math.random() * 1000) + 100,
  }));
};

export const mockData = {
  auditLogs: generateMockAuditLogs(1200),
  approvals: generateMockApprovalRequests(1100),
  agentRuns: generateMockAgentRuns(1050),
};
