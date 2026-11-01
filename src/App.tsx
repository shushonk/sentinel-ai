import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Database, 
  Wrench, 
  ShieldCheck, 
  ClipboardList, 
  FileText, 
  Users, 
  Settings, 
  Bell, 
  Search,
  ChevronRight,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Menu,
  X,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Page = 'overview' | 'agent' | 'knowledge' | 'tools' | 'access' | 'approvals' | 'audit' | 'users' | 'policies' | 'settings';

interface NavItem {
  id: Page;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'agent', label: 'AI Agent', icon: MessageSquare },
  { id: 'knowledge', label: 'Knowledge Base', icon: Database },
  { id: 'tools', label: 'Tools & Integrations', icon: Wrench },
  { id: 'access', label: 'Access Control', icon: ShieldCheck },
  { id: 'approvals', label: 'Approval Center', icon: ClipboardList },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'policies', label: 'Policies', icon: Lock },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// --- Components ---

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen }: { 
  activePage: Page, 
  setActivePage: (p: Page) => void,
  isOpen: boolean,
  setIsOpen: (b: boolean) => void
}) => (
  <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 transition-transform duration-300 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Shield className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Sentinel AI</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActivePage(item.id); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
              activePage === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">EV</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Elena Vance</p>
            <p className="text-xs text-slate-500 truncate">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  </aside>
);

const TopBar = ({ activePage, setIsOpen }: { activePage: Page, setIsOpen: (b: boolean) => void }) => (
  <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
    <div className="flex items-center justify-between h-16 px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Organizations</span>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-slate-900">Sentinel Global</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search Sentinel..." className="bg-transparent border-none focus:ring-0 text-sm w-48" />
        </div>
        <button className="relative p-2 hover:bg-slate-100 rounded-lg">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        <button className="flex items-center gap-2 p-1 hover:bg-slate-100 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">EV</div>
        </button>
      </div>
    </div>
  </header>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/overview').then(res => res.json()).then(setMetrics);
  }, []);

  if (!metrics) return <div className="p-8 animate-pulse space-y-4">
    <div className="h-32 bg-slate-200 rounded-xl"></div>
    <div className="grid grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>)}
    </div>
  </div>;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Overview</h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time status of agent governance and activity.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Environment: Production
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Executions', value: metrics.metrics.totalExecutions, icon: LayoutDashboard, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Approvals', value: metrics.metrics.pendingApprovals, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Security Denials', value: metrics.metrics.deniedAuthorizations, icon: Shield, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Active Agents', value: 8, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs font-medium text-emerald-600">+12.5%</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Recent Security Events</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Actor</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium text-right">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.recentEvents.map((event: any) => (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {event.actor.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{event.actor.name}</p>
                          <p className="text-xs text-slate-500">{event.actor.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{event.actionType}</p>
                      <p className="text-xs text-slate-500">{event.resource}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700' : 
                        event.status === 'DENIED' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 tabular-nums">
                      {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-6">Operations by Risk</h3>
            <div className="space-y-4">
              {[
                { label: 'Critical', color: 'bg-red-500', value: 4, total: 100 },
                { label: 'High', color: 'bg-orange-500', value: 12, total: 100 },
                { label: 'Medium', color: 'bg-amber-500', value: 34, total: 100 },
                { label: 'Low', color: 'bg-emerald-500', value: 50, total: 100 },
              ].map((risk, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-600">{risk.label}</span>
                    <span className="text-slate-900">{risk.value}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${risk.color}`} style={{ width: `${risk.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl text-white shadow-lg shadow-blue-600/20">
            <Shield className="w-8 h-8 mb-4 opacity-50" />
            <h4 className="font-bold text-lg">Governance Health</h4>
            <p className="text-blue-100 text-sm mt-2">Systems are operating within optimal security boundaries. No critical violations detected in the last 24h.</p>
            <button className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/20">
              Run Security Audit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AgentWorkspace = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })), userMsg] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">How can I help you today?</h2>
            <p className="text-slate-500 mt-2">I am Sentinel AI, your enterprise agent for searching knowledge and executing authorized tasks.</p>
            <div className="grid grid-cols-2 gap-4 mt-8 w-full">
              {[
                "Summarize recent project reports",
                "Check pending team approvals",
                "Search security policies",
                "Draft external project update"
              ].map((p, i) => (
                <button key={i} onClick={() => setInput(p)} className="p-4 text-left text-sm bg-white border border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-sm transition-all text-slate-600">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                : 'bg-white border border-slate-200 text-slate-800'
            }`}>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 lg:p-8 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type your request here..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-16 min-h-[64px]"
          />
          <button 
            onClick={sendMessage}
            className="absolute right-3 top-3 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
          All interactions are monitored and recorded for audit purposes
        </p>
      </div>
    </div>
  );
};

const SimpleTablePage = ({ title, description, icon: Icon, apiPath }: { title: string, description: string, icon: any, apiPath: string }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch(apiPath).then(res => res.json()).then(setData);
  }, [apiPath]);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <p className="text-slate-500 mt-1 text-sm">{description}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder={`Search ${title.toLowerCase()}...`} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                {data.length > 0 && Object.keys(data[0]).filter(k => k !== 'id').map(key => (
                  <th key={key} className="px-6 py-3 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors text-sm">
                  {Object.entries(item).filter(([k]) => k !== 'id').map(([key, value]: [any, any]) => (
                    <td key={key} className="px-6 py-4">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState<Page>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col lg:pl-64">
        <TopBar activePage={activePage} setIsOpen={setIsSidebarOpen} />
        
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activePage === 'overview' && <Dashboard />}
              {activePage === 'agent' && <AgentWorkspace />}
              {activePage === 'audit' && <SimpleTablePage title="Audit Logs" description="Historical record of all system activity and access." icon={FileText} apiPath="/api/audit" />}
              {activePage === 'tools' && <SimpleTablePage title="Tools & Integrations" description="Manage authorized external capabilities for AI agents." icon={Wrench} apiPath="/api/tools" />}
              {activePage === 'approvals' && <SimpleTablePage title="Approval Center" description="Review and manage sensitive tool execution requests." icon={ClipboardList} apiPath="/api/approvals" />}
              
              {/* Fallback for other pages in prototype */}
              {!['overview', 'agent', 'audit', 'tools', 'approvals'].includes(activePage) && (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                    <Settings className="w-10 h-10" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 capitalize">{activePage.replace('-', ' ')}</h2>
                  <p className="text-slate-500 mt-2">This module is currently in development.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
