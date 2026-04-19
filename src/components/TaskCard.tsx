import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../types";
import { MessageSquare, Paperclip, Clock, Trash2, Edit2, Check, X } from "lucide-react";

interface Props {
  task: Task;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newContent: string) => void;
}

export function TaskCard({ task, index, onDelete, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);

  const handleSave = () => {
    onUpdate(task.id as string, editContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(task.content);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id.toString()} index={index} isDragDisabled={isEditing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card glass-panel ${snapshot.isDragging ? "dragging" : ""}`}
        >
          <div className="task-actions" style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', opacity: 0, transition: 'opacity 0.2s' }}>
             {!isEditing && (
               <>
                 <button onClick={() => setIsEditing(true)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                   <Edit2 size={14} />
                 </button>
                 <button onClick={() => onDelete(task.id as string)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                   <Trash2 size={14} />
                 </button>
               </>
             )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="task-tags">
              {task.tags.map((tag) => (
                <span key={tag} className={`tag ${tag}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {isEditing ? (
            <div style={{ marginBottom: '16px' }}>
               <textarea 
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
                 autoFocus
                 style={{ 
                   width: '100%', 
                   background: 'rgba(0,0,0,0.2)', 
                   border: '1px solid var(--primary)', 
                   color: '#fff', 
                   padding: '8px', 
                   borderRadius: '6px',
                   fontFamily: 'inherit',
                   minHeight: '60px',
                   resize: 'vertical'
                 }}
               />
               <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                 <button onClick={handleSave} style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Check size={14} /></button>
                 <button onClick={handleCancel} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><X size={14} /></button>
               </div>
            </div>
          ) : (
            <div className="task-content" onDoubleClick={() => setIsEditing(true)}>{task.content}</div>
          )}
          
          <div className="task-footer">
            <div className="task-meta">
              {task.comments > 0 && (
                <div className="task-meta-item">
                  <MessageSquare size={14} />
                  <span>{task.comments}</span>
                </div>
              )}
              {task.attachments > 0 && (
                <div className="task-meta-item">
                  <Paperclip size={14} />
                  <span>{task.attachments}</span>
                </div>
              )}
              <div className="task-meta-item">
                <Clock size={14} />
                <span>{task.date}</span>
              </div>
            </div>
            
            <div className="task-assignees" style={{ display: 'flex' }}>
              {task.assignees.map((assignee, idx) => (
                <img
                  key={idx}
                  src={assignee}
                  alt="Assignee"
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid var(--border-glass)',
                    marginLeft: idx > 0 ? '-8px' : '0'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
