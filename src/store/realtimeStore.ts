import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface SystemLog {
  id: string;
  type: 'threats' | 'auth' | 'infra' | 'payment' | 'system';
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
  details?: Record<string, unknown>;
  userId?: string;
  ip?: string;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  requests: number;
  errors: number;
  activeUsers: number;
  uptime: number;
}

export interface RealtimeState {
  isConnected: boolean;
  systemLogs: SystemLog[];
  metrics: SystemMetrics;
  threatCount: number;
  authAttempts: number;
  lastUpdate: string;

  // Actions
  addLog: (log: Omit<SystemLog, 'id' | 'timestamp'>) => void;
  updateMetrics: (metrics: Partial<SystemMetrics>) => void;
  incrementThreatCount: () => void;
  incrementAuthAttempts: () => void;
  clearLogs: () => void;
  simulateRealtimeUpdates: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);
const generateLog = (type: SystemLog['type'], level: SystemLog['level'], message: string): SystemLog => ({
  id: generateId(),
  type,
  level,
  message,
  timestamp: new Date().toISOString(),
});

export const useRealtimeStore = create<RealtimeState>()(
  persist(
    (set, get) => ({
      isConnected: true,
      systemLogs: [],
      metrics: {
        cpu: 15,
        memory: 68,
        disk: 42,
        network: 23,
        requests: 1247,
        errors: 3,
        activeUsers: 89,
        uptime: 99.9,
      },
      threatCount: 156,
      authAttempts: 1247,
      lastUpdate: new Date().toISOString(),

      addLog: (log: Omit<SystemLog, 'id' | 'timestamp'>) => {
        const newLog = {
          ...log,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };

        set(state => ({
          systemLogs: [newLog, ...state.systemLogs].slice(0, 100), // Keep last 100 logs
        }));
      },

      updateMetrics: (newMetrics: Partial<SystemMetrics>) => {
        set(state => ({
          metrics: { ...state.metrics, ...newMetrics },
          lastUpdate: new Date().toISOString(),
        }));
      },

      incrementThreatCount: () => {
        set(state => ({
          threatCount: state.threatCount + 1,
        }));
      },

      incrementAuthAttempts: () => {
        set(state => ({
          authAttempts: state.authAttempts + 1,
        }));
      },

      clearLogs: () => {
        set({ systemLogs: [] });
      },

      simulateRealtimeUpdates: () => {
        const { updateMetrics, addLog } = get();

        // Simulate metrics updates
        setInterval(() => {
          const currentMetrics = get().metrics;
          const updatedMetrics = {
            cpu: Math.max(5, Math.min(95, currentMetrics.cpu + (Math.random() - 0.5) * 10)),
            memory: Math.max(30, Math.min(90, currentMetrics.memory + (Math.random() - 0.5) * 5)),
            disk: Math.max(20, Math.min(80, currentMetrics.disk + (Math.random() - 0.5) * 2)),
            network: Math.max(10, Math.min(70, currentMetrics.network + (Math.random() - 0.5) * 8)),
            requests: currentMetrics.requests + Math.floor(Math.random() * 50),
            errors: Math.max(0, currentMetrics.errors + Math.floor(Math.random() * 3) - 1),
            activeUsers: Math.max(50, Math.min(150, currentMetrics.activeUsers + Math.floor((Math.random() - 0.5) * 10))),
            uptime: 99.5 + Math.random() * 0.5,
          };
          updateMetrics(updatedMetrics);
        }, 5000);

        // Simulate security events
        setInterval(() => {
          if (Math.random() > 0.7) {
            const events = [
              generateLog('threats', 'warning', 'Suspicious IP detected from 192.168.1.100'),
              generateLog('threats', 'info', 'DDoS attack mitigated successfully'),
              generateLog('auth', 'warning', 'Failed login attempt from unknown device'),
              generateLog('infra', 'info', 'Server load balanced automatically'),
              generateLog('system', 'success', 'Database backup completed'),
            ];
            const event = events[Math.floor(Math.random() * events.length)];
            addLog(event);
          }
        }, 10000);
      },
    }),
    {
      name: 'realtime-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        systemLogs: state.systemLogs.slice(0, 20), // Persist only recent logs
        metrics: state.metrics,
        threatCount: state.threatCount,
        authAttempts: state.authAttempts,
      }),
    }
  )
);

