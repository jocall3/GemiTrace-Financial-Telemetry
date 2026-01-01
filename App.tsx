
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { AccDetAccNum } from './components/AccDetAccNum';
import { TelemetryEvent, DashboardStats } from './types';
import { GMI_TLM_EVT_TYP, cmpList, AccNumTypEnum, getSeverityColor } from './constants';
import { analyzeTelemetryStream } from './services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const App: React.FC = () => {
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    criticalErrors: 0,
    complianceViolations: 0,
    systemUptime: "99.98%"
  });

  const generateMockEvent = useCallback((): TelemetryEvent => {
    const eventTypes = Object.values(GMI_TLM_EVT_TYP);
    const severities: TelemetryEvent['severity'][] = ['INF', 'INF', 'INF', 'DBG', 'WRN', 'ERR', 'CRT'];
    const accTypes = Object.values(AccNumTypEnum);
    
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const severity = type === GMI_TLM_EVT_TYP.CRT ? 'CRT' : 
                     type === GMI_TLM_EVT_TYP.DATA_BRH_SUS ? 'CRT' :
                     severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      timestamp: new Date().toLocaleTimeString(),
      type: type as string,
      severity,
      company: cmpList[Math.floor(Math.random() * cmpList.length)],
      accountType: accTypes[Math.floor(Math.random() * accTypes.length)],
      accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
      description: `Triggered by ${type} logic for secure routing.`,
      metadata: { latency: Math.floor(Math.random() * 200) }
    };
  }, []);

  useEffect(() => {
    const initialEvents = Array.from({ length: 15 }, generateMockEvent);
    setEvents(initialEvents);

    const interval = setInterval(() => {
      setEvents(prev => [generateMockEvent(), ...prev.slice(0, 49)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [generateMockEvent]);

  useEffect(() => {
    const criticals = events.filter(e => e.severity === 'CRT').length;
    const violations = events.filter(e => e.type.includes('Compliance') || e.type.includes('Violation')).length;
    setStats(prev => ({
      ...prev,
      totalEvents: events.length + 12000, // Simulated scale
      criticalErrors: criticals,
      complianceViolations: violations
    }));
  }, [events]);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzeTelemetryStream(events.slice(0, 10));
    setAnalysisResult(result || "Analysis unavailable.");
    setIsAnalyzing(false);
  };

  const chartData = events.slice(0, 20).map((e, i) => ({
    name: e.timestamp,
    latency: e.metadata.latency,
    risk: e.severity === 'CRT' ? 100 : e.severity === 'ERR' ? 70 : e.severity === 'WRN' ? 40 : 10
  })).reverse();

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header />

      <main className="max-w-7xl mx-auto px-6 pt-8">
        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Visualizations */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Event Latency & Risk Trends</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <span className="text-xs font-medium text-slate-500">Latency (ms)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <span className="text-xs font-medium text-slate-500">Risk Score</span>
                  </div>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="latency" stroke="#6366f1" fillOpacity={1} fill="url(#colorLatency)" strokeWidth={2} />
                    <Line type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Event List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Live Event Stream</h2>
                <span className="text-xs text-slate-400">Showing last 50 events</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase">
                    <tr>
                      <th className="px-6 py-3">Timestamp</th>
                      <th className="px-6 py-3">Event Type</th>
                      <th className="px-6 py-3">Company</th>
                      <th className="px-6 py-3">Severity</th>
                      <th className="px-6 py-3">Account Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">{event.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-slate-800">{event.type}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">{event.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-tight ${getSeverityColor(event.severity)}`}>
                            {event.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <AccDetAccNum prtlAccNum={event.accountNumber} accDtlId={event.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold">AI Compliance Audit</h2>
              </div>
              
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Run an instant AI-powered heuristic analysis on the current telemetry stream to detect complex risk patterns and compliance drifts.
              </p>

              <button 
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                  isAnalyzing 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 active:scale-[0.98]'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>ANALYZING...</span>
                  </>
                ) : (
                  <>
                    <span>RUN AI AUDIT</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              {analysisResult && (
                <div className="mt-8 bg-slate-800/50 rounded-xl p-5 border border-slate-700/50 animate-in fade-in slide-in-from-bottom-4">
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 overflow-y-auto max-h-[400px]">
                    <div className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                      {analysisResult}
                    </div>
                  </div>
                  <button 
                    onClick={() => setAnalysisResult(null)}
                    className="mt-4 text-xs font-bold text-slate-500 hover:text-slate-300 uppercase tracking-widest"
                  >
                    Dismiss Analysis
                  </button>
                </div>
              )}

              {!analysisResult && !isAnalyzing && (
                <div className="mt-12 flex flex-col items-center text-center opacity-30">
                  <svg className="w-16 h-16 mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-xs uppercase tracking-widest font-bold">Waiting for Audit Initiation</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Buffer Status:</span>
            <div className="flex space-x-1">
              {Array.from({length: 8}).map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < events.length / 6 ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
              ))}
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Flow:</span>
            <span className="text-xs font-mono font-bold text-indigo-600">4.2 KB/s</span>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-medium italic">
          Proprietary Dashboard • Protected by Gemini Flash AI • 2024
        </div>
      </div>
    </div>
  );
};

export default App;
