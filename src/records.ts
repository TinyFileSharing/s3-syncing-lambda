import sql from './db'

export interface Record {
  id: string
  name: string
  owner: string
  size: number | null
  type: string
  createdAt: Date
  updatedAt: Date | null
  expirationAt: Date | null
}

export async function upsertRecord(record: Record) {
  await sql`
    INSERT INTO records 
    (
      id, 
      name, 
      size, 
      owner,
      type,
      expiration_at,
      created_at,
      updated_at
    )
    VALUES 
    (
      ${record.id},
      ${record.name},
      ${record.size},
      ${record.owner},
      ${record.type},
      ${record.expirationAt},
      CURRENT_TIMESTAMP
      NULL,
    )
    ON CONFLICT (id) DO UPDATE
      SET name = EXCLUDED.name,
          size = EXCLUDED.size,
          owner = EXCLUDED.owner,
          author = EXCLUDED.author,
          type = EXCLUDED.type,
          expiration_at = EXCLUDED.expiration_at,
          created_at = EXCLUDED.created_at,
          updated_at = CURRENT_TIMESTAMP;
  `
}

export async function removeRecord(id: string) {
  await sql`DELETE FROM TABLE records WHERE id = ${id};`
}
