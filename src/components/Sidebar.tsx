import { LayoutDashboard, CheckSquare, Users, Settings, Target, Layers, PieChart } from "lucide-react";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: Props) {
  return (
    <div className="sidebar">
      <div className="logo">
        <Layers className="logo-icon" size={28} />
        Zenith
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <PieChart size={20} />
          Overview
        </div>
        <div 
          className={`nav-item ${activeTab === 'board' ? 'active' : ''}`}
          onClick={() => setActiveTab('board')}
        >
          <LayoutDashboard size={20} />
          Board
        </div>
        <div 
          className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          <Target size={20} />
          Roadmap
        </div>
        <div 
          className={`nav-item ${activeTab === 'myTasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('myTasks')}
        >
          <CheckSquare size={20} />
          My Tasks
        </div>
        <div 
          className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={20} />
          Team
        </div>
      </div>

      <div style={{ marginTop: 'auto' }}>
         <div className="nav-item" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
          <Settings size={20} />
          Settings
        </div>
      </div>
    </div>
  );
}
