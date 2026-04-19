import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER || 'zenith_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'zenith_db',
  password: process.env.DB_PASSWORD || 'zenith_password',
  port: parseInt(process.env.DB_PORT || '5433'),
});

export const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS columns (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        sort_order INTEGER NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        column_id VARCHAR(255) REFERENCES columns(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        tags JSONB DEFAULT '[]',
        comments INTEGER DEFAULT 0,
        attachments INTEGER DEFAULT 0,
        date VARCHAR(255) NOT NULL,
        assignees JSONB DEFAULT '[]',
        sort_order INTEGER NOT NULL
      );
    `);

    // Check if we need to seed the columns
    const result = await client.query('SELECT COUNT(*) FROM columns');
    if (parseInt(result.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO columns (id, title, sort_order) VALUES
        ('todo', 'To Do', 1),
        ('in-progress', 'In Progress', 2),
        ('review', 'In Review', 3),
        ('done', 'Done', 4);
      `);
      
      await client.query(`
        INSERT INTO tasks (id, column_id, content, tags, comments, attachments, date, assignees, sort_order) VALUES
        ('1', 'todo', 'Design new landing page structure and hero section', '["design"]', 3, 2, 'Oct 24', '["https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"]', 1),
        ('2', 'todo', 'Integrate payment gateway API endpoints', '["dev"]', 8, 0, 'Oct 25', '["https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi"]', 2),
        ('3', 'in-progress', 'Conduct user research for dashboard layout', '["research"]', 1, 4, 'Oct 26', '["https://api.dicebear.com/7.x/avataaars/svg?seed=Max"]', 1),
        ('4', 'review', 'Refactor authentication module using TypeScript', '["dev"]', 5, 1, 'Oct 22', '["https://api.dicebear.com/7.x/avataaars/svg?seed=Bella"]', 1),
        ('5', 'done', 'Set up project repository and CI/CD pipelines', '["dev"]', 0, 0, 'Oct 20', '["https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam"]', 1);
      `);
      console.log('Database seeded with initial data');
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};
