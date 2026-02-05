import { Subject, Student, GradeRecord } from '../../lib/types';
import { useStore } from '../../lib/store';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

interface GradeGridProps {
    subject: Subject;
    students: Student[];
}

export function GradeGrid({ subject, students }: GradeGridProps) {
    const { t } = useTranslation();
    const grades = useStore(state => state.db.grades);
    const updateGrade = useStore(state => state.updateGrade);
    const settings = useStore(state => state.db.settings);

    // Helper to get or create a grade record
    const getGrade = (studentId: string) => {
        return grades.find(g => g.subject_id === subject.id && g.student_id === studentId) || {
            subject_id: subject.id,
            student_id: studentId,
            exam1: null,
            exam2: null,
            coursework: null,
            final_exam: null,
            total: null,
            coursework_scores: {},
            absences: [],
            absence_types: {}
        };
    };

    const handleScoreChange = (studentId: string, field: keyof GradeRecord, value: string) => {
        const numVal = value === '' ? null : parseFloat(value);
        const currentGrade = getGrade(studentId);

        const newGrade = { ...currentGrade, [field]: numVal };

        // Auto-calculate total
        const total = (newGrade.exam1 || 0) + (newGrade.exam2 || 0) + (newGrade.coursework || 0) + (newGrade.final_exam || 0);
        newGrade.total = total;

        updateGrade(newGrade);
    };

    return (
        <div className="overflow-x-auto custom-scrollbar pb-4">
            <table className="w-full text-left rtl:text-right text-sm border-separate border-spacing-0">
                <thead className="bg-slate-50/90 backdrop-blur-sm text-slate-500 font-bold text-xs uppercase tracking-wider sticky top-0 z-30">
                    <tr>
                        <th className="px-4 py-4 sticky left-0 rtl:left-auto rtl:right-0 bg-slate-50/95 backdrop-blur-sm z-40 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-b border-r rtl:border-r-0 rtl:border-l border-slate-200 min-w-[280px]">
                            {t('grades.grid.student')}
                        </th>
                        <th className="px-2 py-4 text-center w-28 border-b border-slate-200 group/col hover:bg-slate-100/50 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-indigo-900">{t('grades.grid.exam1')}</span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded-full inline-block mx-auto">{t('grades.grid.max')} {subject.max_exam1}</span>
                            </div>
                        </th>
                        <th className="px-2 py-4 text-center w-28 border-b border-slate-200 group/col hover:bg-slate-100/50 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-indigo-900">{t('grades.grid.exam2')}</span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded-full inline-block mx-auto">{t('grades.grid.max')} {subject.max_exam2}</span>
                            </div>
                        </th>
                        <th className="px-2 py-4 text-center w-28 border-b border-slate-200 group/col hover:bg-slate-100/50 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-indigo-900">{t('grades.grid.coursework')}</span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded-full inline-block mx-auto">{t('grades.grid.max')} {subject.max_coursework}</span>
                            </div>
                        </th>
                        <th className="px-2 py-4 text-center w-28 border-b border-slate-200 group/col hover:bg-slate-100/50 transition-colors">
                            <div className="flex flex-col">
                                <span className="text-indigo-900">{t('grades.grid.final')}</span>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded-full inline-block mx-auto">{t('grades.grid.max')} {subject.max_final_exam}</span>
                            </div>
                        </th>
                        <th className="px-4 py-4 text-center w-28 font-bold bg-slate-100/80 border-b border-l rtl:border-l-0 rtl:border-r border-slate-200 text-slate-700 sticky right-0 rtl:right-auto rtl:left-0 z-30 drop-shadow-sm">
                            {t('grades.grid.total')}
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {students.map((student) => {
                        const grade = getGrade(student.id);
                        const total = grade.total || 0;
                        const maxTotal = subject.max_exam1 + subject.max_exam2 + subject.max_coursework + subject.max_final_exam;
                        const pct = (total / maxTotal) * 100;

                        const isPassing = pct >= settings.pass_threshold_pct;

                        return (
                            <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors group">
                                <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-indigo-50/30 z-20 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.02)]">
                                    <div className="font-semibold text-slate-700 truncate max-w-[260px]" title={student.full_name}>{student.full_name}</div>
                                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">{student.username}</div>
                                </td>
                                <td className="p-2 text-center relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max={subject.max_exam1}
                                        step="0.5"
                                        placeholder="-"
                                        className="w-20 text-center py-2 px-1 border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded-lg bg-slate-50 focus:bg-white outline-none transition-all font-mono text-slate-700 text-sm placeholder:text-slate-300 shadow-sm focus:shadow-indigo-100"
                                        value={grade.exam1 ?? ''}
                                        onChange={e => handleScoreChange(student.id, 'exam1', e.target.value)}
                                    />
                                </td>
                                <td className="p-2 text-center relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max={subject.max_exam2}
                                        step="0.5"
                                        placeholder="-"
                                        className="w-20 text-center py-2 px-1 border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded-lg bg-slate-50 focus:bg-white outline-none transition-all font-mono text-slate-700 text-sm placeholder:text-slate-300 shadow-sm focus:shadow-indigo-100"
                                        value={grade.exam2 ?? ''}
                                        onChange={e => handleScoreChange(student.id, 'exam2', e.target.value)}
                                    />
                                </td>
                                <td className="p-2 text-center relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max={subject.max_coursework}
                                        step="0.5"
                                        placeholder="-"
                                        className="w-20 text-center py-2 px-1 border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded-lg bg-slate-50 focus:bg-white outline-none transition-all font-mono text-slate-700 text-sm placeholder:text-slate-300 shadow-sm focus:shadow-indigo-100"
                                        value={grade.coursework ?? ''}
                                        onChange={e => handleScoreChange(student.id, 'coursework', e.target.value)}
                                    />
                                </td>
                                <td className="p-2 text-center relative">
                                    <input
                                        type="number"
                                        min="0"
                                        max={subject.max_final_exam}
                                        step="0.5"
                                        placeholder="-"
                                        className="w-20 text-center py-2 px-1 border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded-lg bg-slate-50 focus:bg-white outline-none transition-all font-mono text-slate-700 text-sm placeholder:text-slate-300 shadow-sm focus:shadow-indigo-100"
                                        value={grade.final_exam ?? ''}
                                        onChange={e => handleScoreChange(student.id, 'final_exam', e.target.value)}
                                    />
                                </td>
                                <td className={clsx(
                                    "px-4 py-2 text-center font-bold border-l border-slate-100 tabular-nums sticky right-0 z-20 transition-colors",
                                    isPassing
                                        ? "text-emerald-700 bg-emerald-50/50 group-hover:bg-emerald-100/50"
                                        : "text-rose-700 bg-rose-50/50 group-hover:bg-rose-100/50"
                                )}>
                                    {total}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
