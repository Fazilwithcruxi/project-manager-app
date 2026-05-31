import { X, CheckCircle, Clock, PlayCircle, Circle } from "lucide-react";
import type { Task, Column } from "../types";

interface Props {
  assigneeUrl: string;
  tasks: Task[];
  columns: Column[];
  onClose: () => void;
}

export function ProgressChainModal({ assigneeUrl, tasks, columns, onClose }: Props) {
  const userTasks = tasks.filter(t => t.assignees.includes(assigneeUrl));

  const getColumnIcon = (colId: string | number) => {
    switch (colId.toString()) {
      case 'todo': return <Circle size={20} color="#6366f1" />;
      case 'in-progress': return <PlayCircle size={20} color="#f59e0b" />;
      case 'review': return <Clock size={20} color="#ec4899" />;
      case 'done': return <CheckCircle size={20} color="#10b981" />;
      default: return <Circle size={20} color="var(--text-muted)" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div className="glass-panel" style={{
        width: '500px',
        maxHeight: '80vh',
        background: 'var(--bg-dark-elem)',
        padding: '32px',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
        }}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <img src={assigneeUrl} alt="Assignee" style={{
            width: '64px', height: '64px', borderRadius: '50%',
            border: '2px solid var(--primary)',
            boxShadow: '0 0 16px var(--primary-glow)'
          }} />
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Assignee Progress</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>Task progression chain</p>
          </div>
        </div>

        <div style={{ position: 'relative', paddingLeft: '24px' }}>
          {columns.map((col, index) => {
            const colTasks = userTasks.filter(t => t.columnId === col.id);
            const isLast = index === columns.length - 1;

            return (
              <div key={col.id} style={{ position: 'relative', marginBottom: isLast ? '0' : '32px' }}>
                {/* Connecting Line */}
                {!isLast && (
                  <div style={{
                    position: 'absolute',
                    left: '9px',
                    top: '24px',
                    bottom: '-32px',
                    width: '2px',
                    background: colTasks.length > 0 ? 'var(--primary)' : 'var(--border-glass)',
                    zIndex: 0
                  }} />
                )}

                {/* Node */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', position: 'relative', zIndex: 1 }}>
                  <div style={{ background: 'var(--bg-dark)', borderRadius: '50%', padding: '2px' }}>
                    {getColumnIcon(col.id)}
                  </div>
                  
                  <div style={{ flex: 1, marginTop: '-2px' }}>
                    <h3 style={{ fontSize: '16px', margin: '0 0 12px 0', color: colTasks.length > 0 ? 'var(--text-main)' : 'var(--text-muted)' }}>
                      {col.title} <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>{colTasks.length}</span>
                    </h3>
                    
                    {colTasks.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {colTasks.map(task => (
                          <div key={task.id} className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                             <div style={{ fontSize: '14px', marginBottom: '6px' }}>{task.content}</div>
                             <div style={{ display: 'flex', gap: '8px' }}>
                               {task.tags.map(tag => (
                                 <span key={tag} className={`tag ${tag}`} style={{ fontSize: '10px' }}>{tag}</span>
                               ))}
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No tasks in this stage.</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
