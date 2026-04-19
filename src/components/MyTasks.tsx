import { useState, useEffect } from "react";
import axios from "axios";
import type { Task } from "../types";

const API_BASE = "http://localhost:3001/api";

export function MyTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // We assume the current user is "Admin"
  const CURRENT_USER_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin";

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/board`);
        // Filter tasks that have the Admin avatar... or if testing, just show a subset if Admin has no tasks.
        // For demonstration, let's include tasks where assignees array includes CURRENT_USER_AVATAR
        // If they have no tasks, we just show empty state.
        const allTasks: Task[] = res.data.tasks;
        const myAssignedTasks = allTasks.filter(t => t.assignees.includes(CURRENT_USER_AVATAR));
        setTasks(myAssignedTasks);
      } catch (err) {
        console.error("Failed to fetch board data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px' }}>Loading tasks...</div>;
  }

  return (
    <div style={{ padding: '40px', color: 'var(--text-main)', flex: 1, overflowY: 'auto' }}>
      <h2 style={{ marginBottom: '24px', fontWeight: 600 }}>My Tasks</h2>
      
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
             <p>You have no tasks assigned to you right now!</p>
             <p style={{ fontSize: '13px', marginTop: '8px' }}>Assign yourself a task on the Board to see it here.</p>
           </div>
        ) : (
          tasks.map(task => (
             <div key={task.id} style={{ 
               display: 'flex', 
               alignItems: 'center', 
               padding: '16px', 
               borderBottom: '1px solid var(--border-glass)',
               transition: 'background 0.2s',
               cursor: 'pointer'
             }}
             onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
             onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
             >
               <div style={{ 
                 width: '12px', 
                 height: '12px', 
                 borderRadius: '50%', 
                 background: task.columnId === 'done' ? '#10b981' : task.columnId === 'in-progress' ? '#f59e0b' : 'var(--primary)',
                 marginRight: '16px'
               }}></div>
               <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '16px', marginBottom: '4px', textDecoration: task.columnId === 'done' ? 'line-through' : 'none', opacity: task.columnId === 'done' ? 0.6 : 1 }}>{task.content}</div>
                 <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Due: {task.date}</div>
               </div>
               <div className="task-tags">
                 {task.tags?.map(tag => (
                   <span key={tag} className={`tag ${tag}`}>{tag}</span>
                 ))}
               </div>
             </div>
           ))
        )}
      </div>
    </div>
  );
}
