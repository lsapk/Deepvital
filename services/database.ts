import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'deepvital.db';

export async function getDatabase() {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
}

export async function initDatabase() {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS user_profile (
      id INTEGER PRIMARY KEY NOT NULL,
      question_id TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_question UNIQUE (question_id)
    );

    CREATE TABLE IF NOT EXISTS health_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      unit TEXT,
      metadata TEXT,
      timestamp DATETIME NOT NULL,
      CONSTRAINT unique_log UNIQUE (type, timestamp)
    );

    CREATE TABLE IF NOT EXISTS ai_conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      context_data TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}
