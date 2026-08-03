import sqlite3

conn = sqlite3.connect("creatoriq.db")
cursor = conn.cursor()

columns = [
    ("channel_id", "TEXT DEFAULT ''"),
    ("channel_handle", "TEXT DEFAULT ''"),
    ("thumbnail_url", "TEXT DEFAULT ''"),
]

for column_name, column_type in columns:
    try:
        cursor.execute(
            f"ALTER TABLE social_accounts ADD COLUMN {column_name} {column_type}"
        )
        print(f"Added column: {column_name}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print(f"Column already exists: {column_name}")
        else:
            print(f"Error adding {column_name}: {e}")

conn.commit()
conn.close()

print("Database updated successfully.")
