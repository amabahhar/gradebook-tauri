import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import { Database, Subject, Student, GradeRecord } from './types';

interface AppState {
    db: Database;
    loading: boolean;
    initialized: boolean;

    // Actions
    init: () => Promise<void>;
    load: () => Promise<void>;
    save: () => Promise<void>;

    // Mutators
    updateSettings: (settings: Partial<Database['settings']>) => void;
    addSubject: (s: Subject) => void;
    updateSubject: (s: Subject) => void;
    deleteSubject: (id: string) => void;

    addStudent: (s: Student) => void;
    updateStudent: (s: Student) => void;

    updateGrade: (g: GradeRecord) => void;
}

const defaultDb: Database = {
    settings: {
        default_language: 'ar',
        pass_threshold_pct: 60,
        absence_threshold: 3,
        date_format: 'iso',
        auth_enabled: false,
        users: []
    },
    subjects: [],
    students: [],
    grades: []
};

export const useStore = create<AppState>((set, get) => ({
    db: defaultDb,
    loading: false,
    initialized: false,

    init: async () => {
        await get().load();
    },

    load: async () => {
        set({ loading: true });
        try {
            const db = await invoke<Database>('load_db');
            set({ db, initialized: true, loading: false });
        } catch (e) {
            console.error("Failed to load db", e);
            set({ loading: false });
        }
    },

    save: async () => {
        const { db } = get();
        try {
            await invoke('save_db', { db });
            console.log("Saved db");
        } catch (e) {
            console.error("Failed to save db", e);
        }
    },

    updateSettings: (s) => {
        set((state) => {
            const newDb = { ...state.db, settings: { ...state.db.settings, ...s } };
            return { db: newDb };
        });
        get().save();
    },

    addSubject: (s) => {
        set((state) => ({ db: { ...state.db, subjects: [...state.db.subjects, s] } }));
        get().save();
    },

    updateSubject: (s) => {
        set((state) => ({
            db: { ...state.db, subjects: state.db.subjects.map(x => x.id === s.id ? s : x) }
        }));
        get().save();
    },

    deleteSubject: (id) => {
        set((state) => ({
            db: { ...state.db, subjects: state.db.subjects.filter(x => x.id !== id) }
        }));
        get().save();
    },

    addStudent: (s) => {
        set((state) => ({ db: { ...state.db, students: [...state.db.students, s] } }));
        get().save();
    },

    updateStudent: (s) => {
        set((state) => ({
            db: { ...state.db, students: state.db.students.map(x => x.id === s.id ? s : x) }
        }));
        get().save();
    },

    updateGrade: (g) => {
        set((state) => {
            const existingIdx = state.db.grades.findIndex(
                x => x.subject_id === g.subject_id && x.student_id === g.student_id
            );
            let newGrades = [...state.db.grades];
            if (existingIdx >= 0) {
                newGrades[existingIdx] = g;
            } else {
                newGrades.push(g);
            }
            return { db: { ...state.db, grades: newGrades } };
        });
        get().save();
    }
}));
