
import { Droppable } from "@hello-pangea/dnd";
import type { Column, Task } from "../types";
import { TaskCard } from "./TaskCard";
import { Plus, MoreHorizontal } from "lucide-react";

interface Props {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, newContent: string) => void;
}

export function BoardColumn({ column, tasks, onAddTask, onDeleteTask, onUpdateTask }: Props) {
  return (
    <div className="column glass-panel">
      <div className="column-header" style={{ padding: '16px' }}>
        <div className="column-title">
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: column.id === 'todo' ? '#6366f1' : column.id === 'in-progress' ? '#f59e0b' : column.id === 'done' ? '#10b981' : '#ec4899'
          }}></div>
          {column.title}
          <span className="task-count">{tasks.length}</span>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      <Droppable droppableId={column.id.toString()}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="task-list"
            style={{
              backgroundColor: snapshot.isDraggingOver ? 'rgba(255,255,255,0.02)' : 'transparent',
              padding: '0 16px 16px 16px'
            }}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                 key={task.id} 
                 task={task} 
                 index={index} 
                 onDelete={onDeleteTask}
                 onUpdate={onUpdateTask}
              />
            ))}
            {provided.placeholder}
            
            <button className="add-task-btn" onClick={() => onAddTask(column.id as string)}>
              <Plus size={16} /> Add Task
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
}
