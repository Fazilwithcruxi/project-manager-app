import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE = "http://localhost:3001/api";

export function CreateTaskModal({ onClose, onSuccess }: Props) {
  const [content, setContent] = useState("");
  const [columnId, setColumnId] = useState("todo");
  const [tags, setTags] = useState<string>("design");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    
    const newTask = {
      id: uuidv4(),
      columnId,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      comments: 0,
      attachments: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assignees: [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=" + uuidv4()
      ],
    };

    try {
      await axios.post(`${API_BASE}/tasks`, newTask);
      onSuccess();
    } catch (err) {
      console.error("Failed to create task:", err);
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel" style={{
        width: '400px', padding: '24px', background: 'var(--bg-dark-elem)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Create New Task</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Task Content</label>
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What needs to be done?"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)',
                color: 'var(--text-main)', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Column</label>
            <select 
              value={columnId} 
              onChange={(e) => setColumnId(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)',
                color: 'var(--text-main)', fontFamily: 'inherit'
              }}
            >
              <option value="todo" style={{ background: 'var(--bg-dark)' }}>To Do</option>
              <option value="in-progress" style={{ background: 'var(--bg-dark)' }}>In Progress</option>
              <option value="review" style={{ background: 'var(--bg-dark)' }}>In Review</option>
              <option value="done" style={{ background: 'var(--bg-dark)' }}>Done</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. design, dev, research"
              style={{
                width: '100%', padding: '12px', borderRadius: '8px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)',
                color: 'var(--text-main)', fontFamily: 'inherit'
              }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !content.trim()}
            style={{
              padding: '12px', background: 'var(--primary)', color: '#fff', border: 'none',
              borderRadius: '8px', fontWeight: 600, cursor: loading || !content.trim() ? 'not-allowed' : 'pointer',
              marginTop: '8px', opacity: loading || !content.trim() ? 0.6 : 1
            }}
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}
