import { useState, useEffect } from "react";
import axios from "axios";
import type { Task } from "../types";

const API_BASE = "http://localhost:3001/api";

export function Roadmap() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/board`);
        setTasks(res.data.tasks);
      } catch (err) {
        console.error("Failed to fetch board data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px' }}>Loading roadmap...</div>;
  }

  return (
    <div style={{ padding: '40px', color: 'var(--text-main)', flex: 1, overflowY: 'auto' }}>
      <h2 style={{ marginBottom: '24px', fontWeight: 600 }}>Project Roadmap</h2>
      
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tasks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No tasks to plan.</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '16px', 
              borderBottom: '1px solid var(--border-glass)' 
            }}>
              <div style={{ width: '100px', fontWeight: 500, color: 'var(--primary)' }}>
                {task.date}
              </div>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: task.columnId === 'done' ? '#10b981' : 'var(--secondary)',
                marginRight: '16px'
              }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>{task.content}</div>
                <div className="task-tags">
                  {task.tags?.map(tag => (
                    <span key={tag} className={`tag ${tag}`}>{tag}</span>
                  ))}
                </div>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', textTransform: 'capitalize' }}>
                Status: {task.columnId.toString().replace('-', ' ')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
