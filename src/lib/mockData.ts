import { AuditEvent, ApprovalRequest, ChatMessage, Role, RiskLevel, AuditStatus, ApprovalStatus } from '../types';

const ROLES: Role[] = ['SUPER_ADMIN', 'SECURITY_ADMIN', 'MANAGER', 'EMPLOYEE', 'AUDITOR'];
const RISK_LEVELS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const AUDIT_STATUSES: AuditStatus[] = ['SUCCESS', 'DENIED', 'PENDING_APPROVAL', 'FAILED'];
const APPROVAL_STATUSES: ApprovalStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED'];
const DEPARTMENTS = ['Engineering', 'Finance', 'Legal', 'Security', 'Operations', 'Executive', 'Human Resources', 'Marketing'];

const NAMES = [
  'Elena Vance', 'Marcus Chen', 'Sarah Miller', 'John Doe', 'Jane Smith', 
  'Robert Tables', 'Alice Cooper', 'Bob Builder', 'Charlie Brown', 'Diana Prince',
  'Ethan Hunt', 'Fiona Gallagher', 'George Costanza', 'Hannah Abbott', 'Ian Malcolm',
  'Jack Sparrow', 'Kelly Kapoor', 'Liam Neeson', 'Mia Wallace', 'Noah Calhoun',
  'Olivia Pope', 'Peter Parker', 'Quinn Fabray', 'Riley Reid', 'Sam Winchester',
  'Tina Fey', 'Ursula Corbero', 'Victor Frankenstein', 'Wendy Darling', 'Xander Harris'
];

const RESOURCES = [
  'Project X Document', 'Security Policy v2', 'Employee Directory', 'Financial Report Q3', 
  'Cloud Infrastructure Config', 'HR Records', 'API Keys Vault', 'Customer Database',
  'Marketing Strategy 2025', 'Product Roadmap', 'Internal Wiki', 'Legacy Archives',
  'Board Meeting Minutes', 'Budget Proposals', 'Quarterly Forecast', 'System Architecture'
];

const TOOLS = [
  'search_docs', 'send_email', 'update_project', 'create_ticket', 'delete_record',
  'provision_access', 'rotate_keys', 'export_data', 'reboot_service', 'scale_cluster'
];

export const generateMockAuditLogs = (count: number): AuditEvent[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `audit-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    tenantId: 'tenant-1',
    actor: {
      id: `u-${i % NAMES.length}`,
      name: NAMES[i % NAMES.length],
      role: ROLES[i % ROLES.length],
      email: `${NAMES[i % NAMES.length].toLowerCase().replace(/\s+/g, '.')}@sentinel.ai`,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
    },
    actionType: ['AGENT_CHAT', 'TOOL_INVOCATION', 'TOOL_EXECUTION', 'ACCESS_DENIED', 'POLICY_UPDATE', 'DATA_EXPORT'][i % 6] as any,
    resource: RESOURCES[i % RESOURCES.length],
    tool: TOOLS[i % TOOLS.length],
    risk: RISK_LEVELS[i % RISK_LEVELS.length],
    status: AUDIT_STATUSES[i % AUDIT_STATUSES.length],
    policyEvaluated: 'Policy-' + (i % 20),
    reason: i % 4 === 0 ? 'Insufficient permissions for target resource' : 'Authorized by organizational role and scope',
    payload: { details: 'Mock audit log payload with detailed trace data for investigation.' },
    previousHash: '0x' + Math.random().toString(16).slice(2, 10),
    hash: '0x' + Math.random().toString(16).slice(2, 10),
  }));
};

export const generateMockApprovalRequests = (count: number): ApprovalRequest[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `appr-${i}`,
    tenantId: 'tenant-1',
    toolId: TOOLS[i % TOOLS.length],
    toolName: TOOLS[i % TOOLS.length].replace(/_/g, ' ').toUpperCase(),
    actionDescription: `Requested execution of ${TOOLS[i % TOOLS.length]} on ${RESOURCES[i % RESOURCES.length]}`,
    targetResource: RESOURCES[i % RESOURCES.length],
    arguments: { target: RESOURCES[i % RESOURCES.length], reason: 'Standard operational requirement' },
    risk: RISK_LEVELS[i % RISK_LEVELS.length],
    requesterId: `u-${i % NAMES.length}`,
    requesterName: NAMES[i % NAMES.length],
    requesterRole: ROLES[i % ROLES.length],
    requesterDepartment: DEPARTMENTS[i % DEPARTMENTS.length] as any,
    status: APPROVAL_STATUSES[i % APPROVAL_STATUSES.length],
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + (Math.random() * 7 + 1) * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockUsers = (count: number): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `u-${i}`,
    name: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${Math.floor(i / NAMES.length)}` : ''),
    email: `${NAMES[i % NAMES.length].toLowerCase().replace(/\s+/g, '.')}${i}@sentinel.ai`,
    role: ROLES[i % ROLES.length],
    department: DEPARTMENTS[i % DEPARTMENTS.length] as any,
    status: i % 20 === 0 ? 'SUSPENDED' : 'ACTIVE',
    lastActive: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockPolicies = (count: number): any[] => {
  const categories = ['ACCESS_CONTROL', 'RISK_GUARDRAIL', 'DATA_LEAK_PREVENTION', 'COMPLIANCE'];
  const enforcements = ['ENFORCE', 'MONITOR_ONLY', 'DISABLED'];
  return Array.from({ length: count }, (_, i) => ({
    id: `p-${i}`,
    name: `Enterprise Governance Policy ${i + 1}`,
    category: categories[i % categories.length],
    enforcement: enforcements[i % enforcements.length],
    risk: RISK_LEVELS[i % RISK_LEVELS.length],
    rulesSummary: `Strict validation of ${RESOURCES[i % RESOURCES.length]} access for all ${ROLES[i % ROLES.length]} members.`,
    lastUpdated: new Date(Date.now() - Math.random() * 100 * 24 * 60 * 60 * 1000).toISOString(),
    updatedBy: NAMES[i % NAMES.length],
  }));
};

export const generateMockTools = (count: number): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `t-${i}`,
    name: TOOLS[i % TOOLS.length] + `_${i}`,
    displayName: (TOOLS[i % TOOLS.length].replace(/_/g, ' ') + ` ${i}`).toUpperCase(),
    description: `Enterprise-grade tool for ${TOOLS[i % TOOLS.length].replace(/_/g, ' ')} operations within the Sentinel ecosystem.`,
    risk: RISK_LEVELS[i % RISK_LEVELS.length],
    enabled: i % 10 !== 0,
    version: `v1.${i % 5}.0`,
    lastExecuted: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockKnowledgeBase = (count: number): any[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `kb-${i}`,
    title: RESOURCES[i % RESOURCES.length] + ` Part ${Math.floor(i / RESOURCES.length) + 1}`,
    author: NAMES[i % NAMES.length],
    department: DEPARTMENTS[i % DEPARTMENTS.length] as any,
    classification: ['PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED'][i % 4],
    updatedAt: new Date(Date.now() - Math.random() * 200 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Project', 'Security', 'Compliance'].slice(0, (i % 3) + 1),
  }));
};

export const mockData = {
  auditLogs: generateMockAuditLogs(2000),
  approvals: generateMockApprovalRequests(1500),
  users: generateMockUsers(500),
  policies: generateMockPolicies(50),
  tools: generateMockTools(40),
  knowledgeBase: generateMockKnowledgeBase(300),
  agentRuns: Array.from({ length: 1000 }, (_, i) => ({
    id: `run-${i}`,
    userName: NAMES[i % NAMES.length],
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    prompt: `Executing governance check for ${RESOURCES[i % RESOURCES.length]} using ${TOOLS[i % TOOLS.length]}.`,
    status: i % 12 === 0 ? 'FAILED' : 'SUCCESS',
    risk: RISK_LEVELS[i % RISK_LEVELS.length],
  })),
};
