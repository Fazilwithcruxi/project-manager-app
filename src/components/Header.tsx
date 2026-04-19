import { Search, Bell, PlusCircle } from "lucide-react";

interface Props {
  activeTab: string;
  onCreate: () => void;
}

export function Header({ activeTab, onCreate }: Props) {
  return (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <h2 style={{ fontWeight: 600, fontSize: '20px', textTransform: 'capitalize' }}>
          {activeTab === 'board' ? 'Website Redesign Sprint' : 
           activeTab === 'roadmap' ? 'Project Roadmap' : 
           activeTab === 'myTasks' ? 'My Tasks' : 
           'Team Directory'}
        </h2>
        <div className="search-bar">
          <Search size={18} color="var(--text-muted)" />
          <input type="text" placeholder="Search tasks, members..." />
        </div>
      </div>

      <div className="user-profile">
        {activeTab === 'board' && (
          <button 
            onClick={onCreate}
            style={{
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}>
            <PlusCircle size={18} />
            Create
          </button>
        )}
        <div style={{ position: 'relative', cursor: 'pointer', padding: '8px' }}>
          <Bell size={20} color="var(--text-muted)" />
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            background: 'var(--secondary)',
            borderRadius: '50%',
            fontWeight: 'bold',
            border: '2px solid var(--bg-dark-elem)'
          }}></div>
        </div>
        <div className="avatar">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User Avatar" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </div>
  );
}
