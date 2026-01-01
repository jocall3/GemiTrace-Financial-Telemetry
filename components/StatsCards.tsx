
import React from 'react';
import { DashboardStats } from '../types';

export const StatsCards: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-sm font-medium text-slate-500 mb-1">Total Events</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-slate-900">{stats.totalEvents.toLocaleString()}</h3>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">60m span</span>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-sm font-medium text-slate-500 mb-1">Compliance Violations</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-slate-900">{stats.complianceViolations}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded ${stats.complianceViolations > 0 ? 'text-red-600 bg-red-50' : 'text-emerald-600 bg-emerald-50'}`}>
            {stats.complianceViolations > 0 ? 'NEEDS REVIEW' : 'SECURE'}
          </span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-sm font-medium text-slate-500 mb-1">Critical Errors</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-slate-900">{stats.criticalErrors}</h3>
          <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">ACTIVE</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-sm font-medium text-slate-500 mb-1">System Uptime</p>
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-slate-900">{stats.systemUptime}</h3>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">EXCELLENT</span>
        </div>
      </div>
    </div>
  );
};
