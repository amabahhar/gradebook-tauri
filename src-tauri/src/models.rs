use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct User {
    pub username: String,
    pub role: String,
    pub salt: String,
    pub password_hash: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct AppSettings {
    #[serde(default = "default_lang")]
    pub default_language: String,
    #[serde(default = "default_pass")]
    pub pass_threshold_pct: f64,
    #[serde(default = "default_abs")]
    pub absence_threshold: i32,
    #[serde(default = "default_date_fmt")]
    pub date_format: String,
    #[serde(default)]
    pub auth_enabled: bool,
    #[serde(default)]
    pub auth_username: String,
    #[serde(default)]
    pub auth_salt: String,
    #[serde(default)]
    pub auth_password_hash: String,
    #[serde(default)]
    pub users: Vec<User>,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            default_language: default_lang(),
            pass_threshold_pct: default_pass(),
            absence_threshold: default_abs(),
            date_format: default_date_fmt(),
            auth_enabled: false,
            auth_username: String::new(),
            auth_salt: String::new(),
            auth_password_hash: String::new(),
            users: Vec::new(),
        }
    }
}

fn default_lang() -> String { "ar".to_string() }
fn default_pass() -> f64 { 60.0 }
fn default_abs() -> i32 { 3 }
fn default_date_fmt() -> String { "iso".to_string() }

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct CourseworkCategory {
    pub id: String,
    pub name: String,
    pub max_points: f64,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Subject {
    pub id: String,
    pub code: String,
    pub name_en: String,
    pub name_ar: String,
    pub max_exam1: f64,
    pub max_exam2: f64,
    pub max_coursework: f64,
    pub max_final_exam: f64,
    #[serde(default)]
    pub coursework_categories: Vec<CourseworkCategory>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Student {
    pub id: String,
    pub username: String,
    pub full_name: String,
    pub email: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GradeRecord {
    pub subject_id: String,
    pub student_id: String,
    pub exam1: Option<f64>,
    pub exam2: Option<f64>,
    pub coursework: Option<f64>,
    pub final_exam: Option<f64>,
    pub total: Option<f64>,
    #[serde(default)]
    pub coursework_scores: HashMap<String, f64>,
    #[serde(default)]
    pub absences: Vec<String>,
    #[serde(default)]
    pub absence_types: HashMap<String, String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Database {
    #[serde(default)]
    pub settings: AppSettings,
    #[serde(default)]
    pub subjects: Vec<Subject>,
    #[serde(default)]
    pub students: Vec<Student>,
    #[serde(default)]
    pub grades: Vec<GradeRecord>,
}
