import { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { GradeGrid } from './GradeGrid';
// import { Subject } from '../../lib/types';
import { BookOpen, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GradesPage() {
    const { t } = useTranslation();
    const subjects = useStore(state => state.db.subjects);
    const students = useStore(state => state.db.students);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

    useEffect(() => {
        if (subjects.length > 0 && !selectedSubjectId) {
            setSelectedSubjectId(subjects[0].id);
        }
    }, [subjects, selectedSubjectId]);

    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('grades.title')}</h1>
                    <p className="text-slate-500 mt-1">{t('grades.subtitle')}</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="pl-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                    </div>
                    <select
                        className="bg-transparent text-sm font-medium text-slate-700 outline-none min-w-[180px]"
                        value={selectedSubjectId}
                        onChange={e => setSelectedSubjectId(e.target.value)}
                    >
                        <option value="" disabled>{t('grades.select_subject_placeholder')}</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name_en} ({s.code})</option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedSubject ? (
                <div className="bg-white p-16 rounded-xl shadow-sm border border-slate-200 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">{t('grades.no_subject_selected')}</h3>
                    <p className="text-slate-500 mt-2">{t('grades.select_subject_prompt')}</p>
                </div>
            ) : students.length === 0 ? (
                <div className="bg-white p-16 rounded-xl shadow-sm border border-slate-200 text-center">
                    <h3 className="text-lg font-medium text-slate-900">{t('grades.no_students')}</h3>
                    <p className="text-slate-500 mt-2">{t('grades.no_students_prompt')}</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
                    {/* Summary Stats or Toolbar could go here */}
                    <GradeGrid subject={selectedSubject} students={students} />
                </div>
            )}
        </div>
    );
}
