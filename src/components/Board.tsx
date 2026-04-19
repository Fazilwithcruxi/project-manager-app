import { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { BoardColumn } from "./BoardColumn";
import type { Task, Column } from "../types";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const API_BASE = "http://localhost:3001/api";

export function Board() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/board`);
        setColumns(res.data.columns);
        setTasks(res.data.tasks);
      } catch (err) {
        console.error("Failed to fetch board data:", err);
        // Fallback for GH pages demo
        setTasks([
          { id: '1', columnId: 'todo', content: 'Design new landing page', tags: ['design'], comments: 3, attachments: 2, date: 'Oct 24', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'] },
          { id: '2', columnId: 'todo', content: 'Integrate payment API', tags: ['dev'], comments: 8, attachments: 0, date: 'Oct 25', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi'] },
          { id: '3', columnId: 'in-progress', content: 'Conduct user research', tags: ['research'], comments: 1, attachments: 4, date: 'Oct 26', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Max'] },
          { id: '4', columnId: 'review', content: 'Refactor auth module', tags: ['dev'], comments: 5, attachments: 1, date: 'Oct 22', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Bella'] },
          { id: '5', columnId: 'done', content: 'Set up project repo', tags: ['dev'], comments: 0, attachments: 0, date: 'Oct 20', assignees: ['https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam'] }
        ]);
        setColumns([
          { id: 'todo', title: 'To Do' },
          { id: 'in-progress', title: 'In Progress' },
          { id: 'review', title: 'In Review' },
          { id: 'done', title: 'Done' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const draggedTask = tasks.find((t) => t.id.toString() === draggableId);
    if (!draggedTask) return;

    const newTasks = tasks.filter((t) => t.id.toString() !== draggableId);
    const updatedTask = { ...draggedTask, columnId: destination.droppableId };
    
    const destColumnTasks = newTasks.filter(t => t.columnId === destination.droppableId);
    destColumnTasks.splice(destination.index, 0, updatedTask);

    const finalTasks = [
      ...newTasks.filter(t => t.columnId !== destination.droppableId),
      ...destColumnTasks
    ];

    // Optimistically update UI
    setTasks(finalTasks);

    // Sync to backend mapping indexes based on finalTasks
    const destinationTasksPayload = destColumnTasks.map((t, idx) => ({ id: t.id, columnId: t.columnId, index: idx + 1 }));
    try {
      await axios.put(`${API_BASE}/board/sync`, { tasks: destinationTasksPayload });
    } catch (err) {
      console.error("Failed to sync reorder:", err);
      // Depending on structure, might want to revert UI if failed
    }
  };

  const addTask = async (columnId: string) => {
    const newTask: Task = {
      id: uuidv4(),
      columnId,
      content: "New task from user",
      tags: ["design"],
      comments: 0,
      attachments: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      assignees: [
        "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
        "https://api.dicebear.com/7.x/avataaars/svg?seed=" + uuidv4()
      ],
    };
    
    // Optimistic UI Update
    setTasks([...tasks, newTask]);

    try {
      await axios.post(`${API_BASE}/tasks`, newTask);
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const deleteTask = async (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    try {
      await axios.delete(`${API_BASE}/tasks/${taskId}`);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const updateTask = async (taskId: string, newContent: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, content: newContent } : t));
    try {
      await axios.put(`${API_BASE}/tasks/${taskId}`, { content: newContent });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px' }}>Loading board...</div>;
  }

  return (
    <div className="board-container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.columnId === column.id);
          return (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              onUpdateTask={updateTask}
            />
          );
        })}
      </DragDropContext>
    </div>
  );
}
