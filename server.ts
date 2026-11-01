import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { mockData } from './src/lib/mockData.js';

// Add extra mock data for specific pages
const extendedMockData = {
  ...mockData,
  policies: [
    { id: 'p1', name: 'PII Data Leak Prevention', category: 'DLP', enforcement: 'ENFORCE', risk: 'CRITICAL', lastUpdated: '2023-10-15T10:00:00Z' },
    { id: 'p2', name: 'High-Risk Tool Approval', category: 'ACCESS', enforcement: 'ENFORCE', risk: 'HIGH', lastUpdated: '2023-10-14T09:00:00Z' },
    { id: 'p3', name: 'External Communication Logging', category: 'AUDIT', enforcement: 'MONITOR', risk: 'LOW', lastUpdated: '2023-10-12T08:00:00Z' },
    { id: 'p4', name: 'Cross-Tenant Isolation', category: 'COMPLIANCE', enforcement: 'ENFORCE', risk: 'CRITICAL', lastUpdated: '2023-10-10T07:00:00Z' },
  ],
  roles: [
    { id: 'r1', name: 'Super Admin', permissions: ['*'], userCount: 2 },
    { id: 'r2', name: 'Security Admin', permissions: ['audit.read', 'policies.manage', 'security.investigate'], userCount: 3 },
    { id: 'r3', name: 'Manager', permissions: ['approvals.review', 'agent.chat'], userCount: 12 },
    { id: 'r4', name: 'Employee', permissions: ['agent.chat', 'documents.read'], userCount: 85 },
  ],
  users: [
    { id: 'u1', name: 'Elena Vance', email: 'elena@sentinel.ai', role: 'Super Admin', department: 'Executive', status: 'ACTIVE' },
    { id: 'u2', name: 'Marcus Chen', email: 'marcus@sentinel.ai', role: 'Security Admin', department: 'Security', status: 'ACTIVE' },
    { id: 'u3', name: 'Sarah Miller', email: 'sarah@sentinel.ai', role: 'Employee', department: 'Engineering', status: 'ACTIVE' },
    { id: 'u4', name: 'John Doe', email: 'john@sentinel.ai', role: 'Manager', department: 'Operations', status: 'ACTIVE' },
  ]
};

// Mock Database wrapper
const db = {
  getOverview: () => ({
    metrics: {
      totalExecutions: 8420,
      successfulOperations: 7950,
      failedOperations: 142,
      deniedAuthorizations: 328,
      pendingApprovals: extendedMockData.approvals.filter(a => a.status === 'PENDING').length,
      activeUsers: 142,
    },
    recentEvents: extendedMockData.auditLogs.slice(0, 5),
  }),
  getAuditLogs: (page = 1, limit = 50) => {
    const start = (page - 1) * limit;
    return {
      data: extendedMockData.auditLogs.slice(start, start + limit),
      total: extendedMockData.auditLogs.length,
      page,
      limit
    };
  },
  getApprovals: (page = 1, limit = 50) => {
    const start = (page - 1) * limit;
    return {
      data: extendedMockData.approvals.slice(start, start + limit),
      total: extendedMockData.approvals.length,
      page,
      limit
    };
  },
  getPolicies: () => extendedMockData.policies,
  getRoles: () => extendedMockData.roles,
  getUsers: () => extendedMockData.users,
  getTools: () => [
    { id: 't1', name: 'search_docs', displayName: 'Search Knowledge Base', description: 'Search company documents', risk: 'LOW', enabled: true },
    { id: 't2', name: 'send_email', displayName: 'Send External Email', description: 'Send emails to external partners', risk: 'HIGH', enabled: true },
    { id: 't3', name: 'update_project', displayName: 'Update Project Record', description: 'Modify project status or details', risk: 'MEDIUM', enabled: true },
  ]
};

async function createServer() {
  const app = express();
  const port = 3000;

  app.use(express.json());

  // AI Client
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // API Endpoints
  app.get('/api/overview', (req, res) => {
    res.json(db.getOverview());
  });

  app.get('/api/audit', (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    res.json(db.getAuditLogs(page, limit));
  });

  app.get('/api/tools', (req, res) => {
    res.json(db.getTools());
  });

  app.get('/api/approvals', (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    res.json(db.getApprovals(page, limit));
  });

  app.post('/api/approvals/:id/approve', (req, res) => {
    const { id } = req.params;
    const approval = mockData.approvals.find(a => a.id === id);
    if (approval) {
      approval.status = 'APPROVED';
      approval.decidedAt = new Date().toISOString();
      approval.decidedBy = 'u-0'; // Elena Vance
      res.json({ success: true, approval });
    } else {
      res.status(404).json({ error: 'Approval request not found' });
    }
  });

  app.post('/api/approvals/:id/reject', (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    const approval = mockData.approvals.find(a => a.id === id);
    if (approval) {
      approval.status = 'REJECTED';
      approval.decidedAt = new Date().toISOString();
      approval.decidedBy = 'u-0';
      approval.decisionNotes = reason || 'Rejected by administrator';
      res.json({ success: true, approval });
    } else {
      res.status(404).json({ error: 'Approval request not found' });
    }
  });

  app.get('/api/policies', (req, res) => {
    res.json(db.getPolicies());
  });

  app.get('/api/roles', (req, res) => {
    res.json(db.getRoles());
  });

  app.get('/api/users', (req, res) => {
    res.json(db.getUsers());
  });

  app.post('/api/agent/chat', async (req, res) => {
    const { messages } = req.body;
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
      return res.json({ 
        content: "[DEMO MODE] This is a simulated response. To enable real AI, please configure GEMINI_API_KEY in the Secrets panel.\n\nI can see you're asking about: " + (messages[messages.length-1]?.parts?.[0]?.text || "nothing specific") + ". In a production environment, I would search your authorized knowledge base and execute approved tools." 
      });
    }

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3.8-flash",
        contents: messages,
        config: {
          systemInstruction: "You are Sentinel AI, an enterprise governance agent. You assist users with searching knowledge and executing tools while respecting security policies. If a user asks for something sensitive, explain the approval process.",
        }
      });
      res.json({ content: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create Vite server
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(port, () => {
    console.log(`Sentinel AI running at http://localhost:${port}`);
  });
}

createServer().catch(console.error);
