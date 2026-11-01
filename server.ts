import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock Database
const MOCK_DATA = {
  users: [
    { id: 'u1', name: 'Elena Vance', email: 'elena@sentinel.ai', role: 'SUPER_ADMIN', department: 'Executive', status: 'ACTIVE' },
    { id: 'u2', name: 'Marcus Chen', email: 'marcus@sentinel.ai', role: 'SECURITY_ADMIN', department: 'Security', status: 'ACTIVE' },
    { id: 'u3', name: 'Sarah Miller', email: 'sarah@sentinel.ai', role: 'EMPLOYEE', department: 'Engineering', status: 'ACTIVE' },
  ],
  auditEvents: Array.from({ length: 50 }, (_, i) => ({
    id: `a${i}`,
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    actor: { name: ['Elena Vance', 'Marcus Chen', 'Sarah Miller'][i % 3], role: ['SUPER_ADMIN', 'SECURITY_ADMIN', 'EMPLOYEE'][i % 3] },
    actionType: ['AGENT_CHAT', 'TOOL_EXECUTION', 'ACCESS_DENIED'][i % 3],
    resource: 'Project X Document',
    status: ['SUCCESS', 'DENIED', 'PENDING_APPROVAL'][i % 3],
    risk: ['LOW', 'MEDIUM', 'HIGH'][i % 3],
  })),
  tools: [
    { id: 't1', name: 'search_docs', displayName: 'Search Knowledge Base', description: 'Search company documents', risk: 'LOW', enabled: true },
    { id: 't2', name: 'send_email', displayName: 'Send External Email', description: 'Send emails to external partners', risk: 'HIGH', enabled: true },
    { id: 't3', name: 'update_project', displayName: 'Update Project Record', description: 'Modify project status or details', risk: 'MEDIUM', enabled: true },
  ],
  approvals: [
    { id: 'ap1', requesterName: 'Sarah Miller', toolName: 'Send External Email', status: 'PENDING', createdAt: new Date().toISOString(), risk: 'HIGH' },
    { id: 'ap2', requesterName: 'Elena Vance', toolName: 'Update Project Record', status: 'APPROVED', createdAt: new Date().toISOString(), risk: 'MEDIUM' },
  ]
};

async function createServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // AI Client
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });

  // API Endpoints
  app.get('/api/overview', (req, res) => {
    res.json({
      metrics: {
        totalExecutions: 1240,
        successfulOperations: 1180,
        failedOperations: 24,
        deniedAuthorizations: 36,
        pendingApprovals: MOCK_DATA.approvals.filter(a => a.status === 'PENDING').length,
        activeUsers: MOCK_DATA.users.length,
      },
      recentEvents: MOCK_DATA.auditEvents.slice(0, 5),
    });
  });

  app.get('/api/audit', (req, res) => {
    res.json(MOCK_DATA.auditEvents);
  });

  app.get('/api/tools', (req, res) => {
    res.json(MOCK_DATA.tools);
  });

  app.get('/api/approvals', (req, res) => {
    res.json(MOCK_DATA.approvals);
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
