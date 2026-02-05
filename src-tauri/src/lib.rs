use tauri::Manager;
use std::fs;
use std::path::PathBuf;

mod models;
use models::Database;

// Helper to get the db path
fn get_db_path(app: &tauri::AppHandle) -> PathBuf {
    // 1. Try executable directory (Portable Mode)
    if let Ok(exe_path) = app.path().executable_dir() {
        let portable_path: PathBuf = exe_path.join("db.json");
        if portable_path.exists() {
            return portable_path;
        }
    }

    // 2. Fallback to standard app data dir
    let path = app.path().app_data_dir().expect("failed to get app data dir");
    if !path.exists() {
        fs::create_dir_all(&path).expect("failed to create app data dir");
    }
    path.join("db.json")
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn save_db(app: tauri::AppHandle, db: Database) -> Result<(), String> {
    let path = get_db_path(&app);
    let json = serde_json::to_string_pretty(&db).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_db(app: tauri::AppHandle) -> Result<Database, String> {
    let path = get_db_path(&app);
    if !path.exists() {
        // Return default empty DB
        return Ok(Database::default());
    }
    let content = fs::read_to_string(path).map_err(|e| e.to_string())?;
    let db: Database = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    Ok(db)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, save_db, load_db])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
