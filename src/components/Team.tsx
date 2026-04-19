import { useState, useEffect } from "react";
import axios from "axios";
import type { Task } from "../types";

const API_BASE = "http://localhost:3001/api";

interface TeamMember {
  avatar: string;
  name: string;
  taskCount: number;
}

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/board`);
        const allTasks: Task[] = res.data.tasks;
        
        const memberMap: Record<string, TeamMember> = {};
        
        allTasks.forEach(task => {
          task.assignees?.forEach(avatar => {
            if (!memberMap[avatar]) {
              // Extract a sort of name from the seed URL
              const urlParts = avatar.split('=');
              let name = "Member";
              if (urlParts.length > 1) {
                name = urlParts[1];
                if (name.includes('-')) {
                  name = "Guest User";
                }
              }
              
              if (avatar.includes("Admin")) name = "You (Admin)";
              
              memberMap[avatar] = {
                avatar,
                name,
                taskCount: 0
              };
            }
            memberMap[avatar].taskCount += 1;
          });
        });

        setMembers(Object.values(memberMap).sort((a,b) => b.taskCount - a.taskCount));
      } catch (err) {
        console.error("Failed to fetch board data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px' }}>Loading team data...</div>;
  }

  return (
    <div style={{ padding: '40px', color: 'var(--text-main)', flex: 1, overflowY: 'auto' }}>
      <h2 style={{ marginBottom: '24px', fontWeight: 600 }}>Team Directory</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {members.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Nobody is assigned to any tasks yet!</p>
        ) : (
          members.map(member => (
            <div key={member.avatar} className="glass-panel" style={{ 
              padding: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}
            >
              <img 
                src={member.avatar} 
                alt={member.name} 
                style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', padding: '4px' }}
              />
              <div>
                <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '4px' }}>
                  {member.name}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                  {member.taskCount} tasks assigned
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
