import { useState } from 'react';
import { useStore } from '../../lib/store';
import { Student, Subject, GradeRecord } from '../../lib/types';
import { X, Plus, Trash2, Calendar } from 'lucide-react';

interface AbsenceModalProps {
    student: Student;
    subject: Subject;
    onClose: () => void;
}

export function AbsenceModal({ student, subject, onClose }: AbsenceModalProps) {
    const grades = useStore(state => state.db.grades);
    const updateGrade = useStore(state => state.updateGrade);

    // Find or create grade record
    const grade = grades.find(g => g.subject_id === subject.id && g.student_id === student.id) || {
        subject_id: subject.id,
        student_id: student.id,
        exam1: null,
        exam2: null,
        coursework: null,
        final_exam: null,
        total: null,
        coursework_scores: {},
        absences: [],
        absence_types: {}
    } as GradeRecord;

    const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
    const [typeInput, setTypeInput] = useState('Absent');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!grade.absences.includes(dateInput)) {
            const newAbsences = [...grade.absences, dateInput].sort();
            const newTypes = { ...grade.absence_types, [dateInput]: typeInput };
            updateGrade({ ...grade, absences: newAbsences, absence_types: newTypes });
        }
    };

    const handleRemove = (date: string) => {
        const newAbsences = grade.absences.filter(d => d !== date);
        const newTypes = { ...grade.absence_types };
        delete newTypes[date];
        updateGrade({ ...grade, absences: newAbsences, absence_types: newTypes });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-lg">{student.full_name}</h3>
                        <p className="text-sm text-slate-500">Absences for {subject.name_en}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Add Form */}
                    <form onSubmit={handleAdd} className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-slate-500 block mb-1">Date</label>
                            <input
                                type="date"
                                required
                                value={dateInput}
                                onChange={e => setDateInput(e.target.value)}
                                className="w-full text-sm p-1.5 border rounded outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="w-24">
                            <label className="text-xs font-medium text-slate-500 block mb-1">Type</label>
                            <select
                                value={typeInput}
                                onChange={e => setTypeInput(e.target.value)}
                                className="w-full text-sm p-1.5 border rounded outline-none focus:border-blue-500 bg-white"
                            >
                                <option>Absent</option>
                                <option>Excused</option>
                                <option>Late</option>
                            </select>
                        </div>
                        <button type="submit" className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            <Plus className="w-4 h-4" />
                        </button>
                    </form>

                    {/* List */}
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {grade.absences.length === 0 ? (
                            <div className="text-center text-slate-400 py-4 text-sm">No absences recorded</div>
                        ) : (
                            grade.absences.map(date => (
                                <div key={date} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100 group transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="font-mono text-sm text-slate-700">{date}</span>
                                        <span className={clsx(
                                            "text-xs px-2 py-0.5 rounded-full font-medium",
                                            grade.absence_types[date] === 'Excused' ? "bg-green-100 text-green-700" :
                                                grade.absence_types[date] === 'Late' ? "bg-yellow-100 text-yellow-700" :
                                                    "bg-red-100 text-red-700"
                                        )}>
                                            {grade.absence_types[date] || 'Absent'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(date)}
                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function clsx(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}
