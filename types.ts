
export interface TelemetryEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'INF' | 'DBG' | 'WRN' | 'ERR' | 'CRT';
  company: string;
  accountType: string;
  accountNumber: string;
  description: string;
  metadata: Record<string, any>;
}

export interface DashboardStats {
  totalEvents: number;
  criticalErrors: number;
  complianceViolations: number;
  systemUptime: string;
}
