import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Roadmap } from './components/Roadmap';
import { MyTasks } from './components/MyTasks';
import { Team } from './components/Team';
import { CreateTaskModal } from './components/CreateTaskModal';
import { ManagerDashboard } from './components/ManagerDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    window.location.reload(); // Quick refresh to show new task across all tabs
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        <Header activeTab={activeTab} onCreate={() => setIsModalOpen(true)} />
        {activeTab === 'overview' ? <ManagerDashboard /> :
         activeTab === 'board' ? <Board /> : 
         activeTab === 'roadmap' ? <Roadmap /> : 
         activeTab === 'myTasks' ? <MyTasks /> : 
         <Team />}
      </main>
      
      {isModalOpen && (
        <CreateTaskModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleModalSuccess} 
        />
      )}
    </div>
  );
}

export default App;
