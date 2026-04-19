import express from 'express';
import cors from 'cors';
import { pool, initDb } from './db';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Database Table and Seed
initDb();

// Routes
// 1. Get Board State (Columns + Tasks)
app.get('/api/board', async (req, res) => {
  try {
    const columnsResult = await pool.query('SELECT * FROM columns ORDER BY sort_order ASC');
    const tasksResult = await pool.query('SELECT * FROM tasks ORDER BY sort_order ASC');

    const columns = columnsResult.rows.map(col => ({
      id: col.id,
      title: col.title,
    }));

    const tasks = tasksResult.rows.map(task => ({
      id: task.id,
      columnId: task.column_id,
      content: task.content,
      tags: task.tags,
      comments: task.comments,
      attachments: task.attachments,
      date: task.date,
      assignees: task.assignees,
    }));

    res.json({ columns, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Add New Task
app.post('/api/tasks', async (req, res) => {
  const { id, columnId, content, tags, comments, attachments, date, assignees } = req.body;
  try {
    // Get max sort_order for the column
    const maxOrderResult = await pool.query('SELECT MAX(sort_order) FROM tasks WHERE column_id = $1', [columnId]);
    const nextOrder = (maxOrderResult.rows[0].max || 0) + 1;

    await pool.query(
      `INSERT INTO tasks (id, column_id, content, tags, comments, attachments, date, assignees, sort_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, columnId, content, JSON.stringify(tags), comments, attachments, date, JSON.stringify(assignees), nextOrder]
    );

    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// 3. Update Task Column (Drag and Drop)
app.put('/api/tasks/:id/move', async (req, res) => {
  const { id } = req.params;
  const { newColumnId, newIndex } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Remove task from its current position
    await client.query('UPDATE tasks SET column_id = $1 WHERE id = $2', [newColumnId, id]);

    // Fast integer-based reordering for MVP purposes: 
    // In a production app, we'd shift index values or use decimal indexes.
    // Here we'll just set it to the new index and let the frontend dictate it.
    // To make it fully functional with DND, we can just update all tasks in the destination column with an array of ids.
    
    await client.query('COMMIT');
    res.json({ message: 'Task moved' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to move task' });
  } finally {
    client.release();
  }
});

// 4. Batch Reorder Tasks (Receives whole array of tasks for the column or whole board)
app.put('/api/board/sync', async (req, res) => {
  const { tasks } = req.body; // Array of { id, columnId, index }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // For large reorders, we wipe and insert or run multiple updates. Multiple updates is safer:
    for (const task of tasks) {
        await client.query(
            'UPDATE tasks SET column_id = $1, sort_order = $2 WHERE id = $3',
            [task.columnId, task.index, task.id]
        );
    }

    await client.query('COMMIT');
    res.json({ message: 'Board synced' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'Failed to sync board' });
  } finally {
    client.release();
  }
});

// 5. Update Task Details
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    await pool.query('UPDATE tasks SET content = $1 WHERE id = $2', [content, id]);
    res.json({ message: 'Task updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// 6. Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
