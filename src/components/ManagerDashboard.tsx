import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import type { Task } from '../types';
import { Target, CheckCircle, Clock } from 'lucide-react';

const API_BASE = "http://localhost:3001/api";

type TimeRange = 'daily' | 'weekly' | 'monthly';

export function ManagerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // columns not needed for this component's render currently
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/board`);
        setTasks(res.data.tasks);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        // Fallback for demo when backend is offline
        setTasks([
          { id: '1', columnId: 'todo', content: 'Design new landing page', tags: ['design'], comments: 3, attachments: 2, date: 'Oct 24', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'] },
          { id: '2', columnId: 'todo', content: 'Integrate payment API', tags: ['dev'], comments: 8, attachments: 0, date: 'Oct 25', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi'] },
          { id: '3', columnId: 'in-progress', content: 'Conduct user research', tags: ['research'], comments: 1, attachments: 4, date: 'Oct 26', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Max'] },
          { id: '4', columnId: 'review', content: 'Refactor auth module', tags: ['dev'], comments: 5, attachments: 1, date: 'Oct 22', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Bella'] },
          { id: '5', columnId: 'done', content: 'Set up project repo', tags: ['dev'], comments: 0, attachments: 0, date: 'Oct 20', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam'] }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set<string>();
    tasks.forEach(t => t.assignees.forEach(a => assignees.add(a)));
    return Array.from(assignees);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (!selectedMember) return tasks;
    return tasks.filter(t => t.assignees.includes(selectedMember));
  }, [tasks, selectedMember]);

  // Aggregate stats
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.columnId === 'done').length;
  const inProgressTasks = filteredTasks.filter(t => t.columnId === 'in-progress' || t.columnId === 'review').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Mock data for charts (since database dates are just "Oct 24", we simulate past data)
  // For a real app, we'd map over actual dates
  const chartData = useMemo(() => {
    if (timeRange === 'daily') {
      return [
        { name: 'Mon', completed: 2, inProgress: 4 },
        { name: 'Tue', completed: 3, inProgress: 5 },
        { name: 'Wed', completed: 1, inProgress: 3 },
        { name: 'Thu', completed: 5, inProgress: 2 },
        { name: 'Fri', completed: Math.max(1, completedTasks), inProgress: Math.max(1, inProgressTasks) },
      ];
    } else if (timeRange === 'weekly') {
      return [
        { name: 'Week 1', completed: 10, inProgress: 15 },
        { name: 'Week 2', completed: 14, inProgress: 12 },
        { name: 'Week 3', completed: 8, inProgress: 18 },
        { name: 'Week 4', completed: Math.max(5, completedTasks * 2), inProgress: Math.max(5, inProgressTasks * 2) },
      ];
    } else {
      return [
        { name: 'August', completed: 40, inProgress: 30 },
        { name: 'September', completed: 55, inProgress: 25 },
        { name: 'October', completed: Math.max(20, completedTasks * 4), inProgress: Math.max(10, inProgressTasks * 4) },
      ];
    }
  }, [timeRange, completedTasks, inProgressTasks]);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px' }}>Loading analytics...</div>;
  }

  return (
    <div className="dashboard-container" style={{ padding: '40px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>Project Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track progress, cut-offs, and team performance.</p>
        </div>
        
        <div className="time-toggles" style={{ display: 'flex', gap: '8px', background: 'var(--bg-dark-elem)', padding: '6px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          {(['daily', 'weekly', 'monthly'] as TimeRange[]).map(t => (
            <button 
              key={t}
              onClick={() => setTimeRange(t)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: timeRange === t ? 'var(--primary)' : 'transparent',
                color: timeRange === t ? '#fff' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Team Filter */}
      <div className="team-filter glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Filter by Team Member</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div 
             onClick={() => setSelectedMember(null)}
             style={{ 
               width: '48px', height: '48px', borderRadius: '50%', 
               background: selectedMember === null ? 'var(--primary)' : 'var(--bg-dark)',
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               cursor: 'pointer', border: '2px solid',
               borderColor: selectedMember === null ? 'var(--primary)' : 'var(--border-glass)',
               transition: 'all 0.2s', fontWeight: 600
             }}
             title="All Members"
          >
            All
          </div>
          {uniqueAssignees.map(a => (
            <img 
              key={a}
              src={a} 
              alt="Avatar"
              onClick={() => setSelectedMember(a)}
              style={{
                width: '48px', height: '48px', borderRadius: '50%', cursor: 'pointer',
                border: '2px solid',
                borderColor: selectedMember === a ? 'var(--primary)' : 'transparent',
                opacity: selectedMember && selectedMember !== a ? 0.5 : 1,
                transition: 'all 0.2s',
                background: 'var(--bg-dark-elem)',
                padding: '2px'
              }}
              title="Click to filter"
            />
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Target size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Total Tasks</p>
            <h2 style={{ fontSize: '32px', fontWeight: 700 }}>{totalTasks}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>Completed</p>
            <h2 style={{ fontSize: '32px', fontWeight: 700 }}>{completedTasks}</h2>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
            <Clock size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '4px' }}>In Progress / Review</p>
            <h2 style={{ fontSize: '32px', fontWeight: 700 }}>{inProgressTasks}</h2>
          </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 600 }}>Progress Tracker ({timeRange})</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-dark-elem)', borderColor: 'var(--border-glass)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="inProgress" name="In Progress" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorInProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '24px', fontSize: '18px', fontWeight: 600 }}>Summary</h3>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: `conic-gradient(var(--primary) ${completionRate}%, var(--bg-dark) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'var(--bg-dark-elem)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <span style={{ fontSize: '36px', fontWeight: 700 }}>{completionRate}%</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Completion</span>
              </div>
            </div>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '15px' }}>
              {selectedMember 
                ? `This member has completed ${completedTasks} tasks and has ${inProgressTasks} tasks currently in progress or review.` 
                : `The team has completed ${completedTasks} tasks overall, with ${inProgressTasks} tasks currently in progress or review.`}
              <br/><br/>
              <b>Next Cutoff: </b> Friday, 5:00 PM
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
