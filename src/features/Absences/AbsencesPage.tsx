import { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { AbsenceModal } from './AbsenceModal';
import { Student } from '../../lib/types';
import { BookOpen, AlertCircle, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

export default function AbsencesPage() {
    const { t } = useTranslation();
    const subjects = useStore(state => state.db.subjects);
    const students = useStore(state => state.db.students);
    const grades = useStore(state => state.db.grades);
    const settings = useStore(state => state.db.settings);

    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [manageStudent, setManageStudent] = useState<Student | undefined>();

    useEffect(() => {
        if (subjects.length > 0 && !selectedSubjectId) {
            setSelectedSubjectId(subjects[0].id);
        }
    }, [subjects, selectedSubjectId]);

    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

    const getAbsenceDetails = (studentId: string) => {
        const g = grades.find(x => x.subject_id === selectedSubjectId && x.student_id === studentId);
        return g || { absences: [], absence_types: {} };
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('attendance.title')}</h1>
                    <p className="text-slate-500 mt-1">{t('attendance.subtitle')}</p>
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
                            <option key={s.id} value={s.id}>{s.name_en}</option>
                        ))}
                    </select>
                </div>
            </div>

            {!selectedSubject ? (
                <div className="bg-white p-16 rounded-xl text-center text-slate-500 border border-slate-200 shadow-sm">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="font-medium">{t('attendance.select_subject_prompt')}</p>
                </div>
            ) : students.length === 0 ? (
                <div className="bg-white p-16 rounded-xl text-center text-slate-500 border border-slate-200 shadow-sm">
                    <p>{t('attendance.no_students_enrolled')}</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-200 overflow-hidden">
                    <table className="w-full text-left rtl:text-right text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">{t('attendance.table.student')}</th>
                                <th className="px-6 py-4">{t('attendance.table.status')}</th>
                                <th className="px-6 py-4 text-right rtl:text-left">{t('attendance.table.last_absence')}</th>
                                <th className="px-6 py-4 text-right rtl:text-left">{t('attendance.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {students.map(student => {
                                const details = getAbsenceDetails(student.id);
                                const count = details.absences?.length || 0;
                                const isHigh = count >= settings.absence_threshold;
                                const lastDate = count > 0 ? details.absences[count - 1] : null;

                                return (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{student.full_name}</div>
                                            <div className="text-xs text-slate-400 font-mono mt-0.5">{student.username}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-2 h-2 rounded-full",
                                                    isHigh ? "bg-red-500" : count > 0 ? "bg-yellow-500" : "bg-green-500"
                                                )}></div>
                                                <span className={clsx("font-medium", isHigh ? "text-red-700" : "text-slate-600")}>
                                                    {count} {count === 1 ? t('attendance.table.absence') : t('attendance.table.absences')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right rtl:text-left text-slate-500 font-mono text-xs">
                                            {lastDate || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right rtl:text-left">
                                            <button
                                                onClick={() => setManageStudent(student)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center gap-1 justify-end rtl:justify-start ml-auto rtl:mr-auto rtl:ml-0 px-3 py-1.5 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <Calendar className="w-3 h-3" />
                                                <span>{t('attendance.table.manage')}</span>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {manageStudent && selectedSubject && (
                <AbsenceModal
                    student={manageStudent}
                    subject={selectedSubject}
                    onClose={() => setManageStudent(undefined)}
                />
            )}
        </div>
    );
}
