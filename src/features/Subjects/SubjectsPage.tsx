import { useState } from 'react';
import { useStore } from '../../lib/store';
import { SubjectForm } from './SubjectForm';
import { Subject } from '../../lib/types';
import { Plus, MoreHorizontal, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

export default function SubjectsPage() {
    const { t } = useTranslation();
    const subjects = useStore(state => state.db.subjects);
    const deleteSubject = useStore(state => state.deleteSubject);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined);

    const handleEdit = (s: Subject) => {
        setEditingSubject(s);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm(t('subjects.delete_confirm'))) {
            deleteSubject(id);
        }
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingSubject(undefined);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('subjects.title')}</h1>
                    <p className="text-slate-500 mt-2 text-lg">{t('subjects.subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus className="w-5 h-5" />
                    <span>{t('subjects.create_course')}</span>
                </button>
            </div>

            {subjects.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm p-16 rounded-2xl shadow-sm border border-slate-200/60 text-center max-w-2xl mx-auto mt-12 animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('subjects.no_courses')}</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">{t('subjects.no_courses_desc')}</p>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="px-8 py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-bold transition-colors"
                    >
                        {t('subjects.create_first_course')}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject, idx) => (
                        <div
                            key={subject.id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 group flex flex-col overflow-hidden relative"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            {/* Course Header Color Bar */}
                            <div className={clsx(
                                "h-1.5 w-full bg-gradient-to-r",
                                idx % 3 === 0 ? "from-indigo-500 to-blue-500" :
                                    idx % 3 === 1 ? "from-emerald-500 to-teal-500" :
                                        "from-amber-500 to-orange-500"
                            )}></div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold tracking-wider rounded-md mb-3 uppercase">
                                            {subject.code}
                                        </span>
                                        <h3 className="font-bold text-xl text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                                            {subject.name_en}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium">{subject.name_ar}</p>
                                    </div>
                                    <div className="relative group/menu">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                        {/* Simplified Dropdown */}
                                        <div className="absolute right-0 rtl:right-auto rtl:left-0 top-10 bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-xl p-1 hidden group-hover/menu:flex flex-col z-20 w-32 animate-in fade-in zoom-in-95 duration-200">
                                            <button onClick={() => handleEdit(subject)} className="text-left rtl:text-right px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">{t('subjects.edit')}</button>
                                            <button onClick={() => handleDelete(subject.id)} className="text-left rtl:text-right px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">{t('subjects.delete')}</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">{t('subjects.max_score')}</span>
                                        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
                                            <div className="w-6 h-6 rounded bg-slate-50 flex items-center justify-center">
                                                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                            </div>
                                            <span>{subject.max_exam1 + subject.max_exam2 + subject.max_coursework + subject.max_final_exam} pts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link to={`/grades?subject=${subject.id}`} className="bg-slate-50/50 p-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/30 transition-colors">
                                <span>{t('subjects.open_gradebook')}</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" />
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            {isFormOpen && (
                <SubjectForm onClose={handleClose} initialData={editingSubject} />
            )}
        </div>
    );
}
