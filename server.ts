import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { mockData } from './src/lib/mockData.js';

// Mock Database wrapper
const db = {
  getOverview: () => ({
    metrics: {
      totalExecutions: 8420,
      successfulOperations: 7950,
      failedOperations: 142,
      deniedAuthorizations: 328,
      pendingApprovals: mockData.approvals.filter(a => a.status === 'PENDING').length,
      activeUsers: 142,
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
