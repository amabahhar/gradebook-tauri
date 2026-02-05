export interface AppSettings {
    default_language: string;
    pass_threshold_pct: number;
    absence_threshold: number;
    date_format: string;
    auth_enabled?: boolean;
    auth_username?: string;
    auth_salt?: string;
    auth_password_hash?: string;
    users?: {
        username: string;
        role: string;
        salt: string;
        password_hash: string;
    }[];
}

export interface CourseworkCategory {
    id: string;
    name: string;
    max_points: number;
}

export interface Subject {
    id: string;
    code: string;
    name_en: string;
    name_ar: string;
    max_exam1: number;
    max_exam2: number;
    max_coursework: number;
    max_final_exam: number;
    coursework_categories: CourseworkCategory[];
}

export interface Student {
    id: string;
    username: string;
    full_name: string;
    email: string;
}

export interface GradeRecord {
    subject_id: string;
    student_id: string;
    exam1: number | null;
    exam2: number | null;
    coursework: number | null;
    final_exam: number | null;
    total: number | null;
    coursework_scores: Record<string, number>;
    absences: string[];
    absence_types: Record<string, string>;
}

export interface Database {
    settings: AppSettings;
    subjects: Subject[];
    students: Student[];
    grades: GradeRecord[];
}
