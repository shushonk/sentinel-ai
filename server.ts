import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

import { mockData } from './src/lib/mockData.js';

// Mock Database wrapper
const db = {
  getOverview: () => ({
    metrics: {
      totalExecutions: 12450,
      successfulOperations: 11820,
      failedOperations: 242,
      deniedAuthorizations: 388,
      pendingApprovals: mockData.approvals.filter(a => a.status === 'PENDING').length,
      activeUsers: mockData.users.length,
    },
    recentEvents: mockData.auditLogs.slice(0, 5),
  }),
  getAuditLogs: (page = 1, limit = 50) => {
    const start = (page - 1) * limit;
    return {
      data: mockData.auditLogs.slice(start, start + limit),
      total: mockData.auditLogs.length,
      page,
      limit
    };
  },
  getApprovals: (page = 1, limit = 50) => {
    const start = (page - 1) * limit;
    return {
      data: mockData.approvals.slice(start, start + limit),
      total: mockData.approvals.length,
      page,
      limit
    };
  },
  getPolicies: () => mockData.policies,
  getRoles: () => [
    { id: 'r1', name: 'Super Admin', permissions: ['*'], userCount: 2 },
    { id: 'r2', name: 'Security Admin', permissions: ['audit.read', 'policies.manage', 'security.investigate'], userCount: 3 },
    { id: 'r3', name: 'Manager', permissions: ['approvals.review', 'agent.chat'], userCount: 12 },
    { id: 'r4', name: 'Employee', permissions: ['agent.chat', 'documents.read'], userCount: 85 },
  ],
  getUsers: () => mockData.users,
  getTools: () => mockData.tools,
  getKnowledgeBase: () => mockData.knowledgeBase,
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

  app.get('/api/knowledge', (req, res) => {
    res.json(db.getKnowledgeBase());
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
