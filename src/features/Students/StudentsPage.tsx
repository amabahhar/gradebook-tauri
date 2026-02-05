import { useState, useRef } from 'react';
import { useStore } from '../../lib/store';
import { StudentForm } from './StudentForm';
import { Student } from '../../lib/types';
import { parseStudentImport } from '../../lib/excel';
import { Plus, Search, MoreHorizontal, Mail, User, FileSpreadsheet } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

export default function StudentsPage() {
    const { t } = useTranslation();
    const students = useStore(state => state.db.students);
    const addStudent = useStore(state => state.addStudent);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | undefined>(undefined);
    const [search, setSearch] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredStudents = students.filter(s =>
        s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (s: Student) => {
        setEditingStudent(s);
        setIsFormOpen(true);
    };

    const handleClose = () => {
        setIsFormOpen(false);
        setEditingStudent(undefined);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const importedStudents = await parseStudentImport(file);
            console.log("Imported students:", importedStudents);

            // Batch process for now (optimization: add bulk import to store)
            let addedCount = 0;
            importedStudents.forEach(s => {
                // Check if username/id already exists to prevent duplicates
                if (!students.find(existing => existing.username === s.username)) {
                    addStudent(s);
                    addedCount++;
                }
            });

            if (addedCount > 0) {
                alert(t('students.import_success', { count: addedCount, defaultValue: `Successfully imported ${addedCount} students.` }));
            } else {
                alert(t('students.import_no_new', 'No new students found to import (duplicates skipped).'));
            }
        } catch (err: any) {
            console.error("Import failed:", err);
            alert(`Failed to import Excel file: ${err.message || "Unknown error"}`);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('students.title')}</h1>
                    <p className="text-slate-500 mt-2 text-lg">{t('students.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx,.xls"
                        className="hidden"
                    />
                    <button
                        onClick={handleImportClick}
                        className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                        <span>{t('students.import_excel')}</span>
                    </button>
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        <span>{t('students.add_student')}</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50 backdrop-blur-sm">
                    <div className="relative flex-1 max-w-md group">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder={t('students.search_placeholder')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                        />
                    </div>
                    <div className="text-sm font-medium text-slate-500 ml-auto bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-slate-900">{filteredStudents.length}</span> {t('students.count_label')}
                    </div>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="p-24 text-center text-slate-500">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="font-semibold text-lg text-slate-800 mb-1">{students.length === 0 ? t('students.no_students_title') : t('students.no_results_title')}</p>
                        <p className="text-slate-400">{students.length === 0 ? t('students.no_students_desc') : t('students.no_results_desc')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left rtl:text-right text-sm">
                            <thead className="bg-slate-50/80 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">{t('students.table.id_username')}</th>
                                    <th className="px-6 py-4">{t('students.table.full_name')}</th>
                                    <th className="px-6 py-4">{t('students.table.contact')}</th>
                                    <th className="px-6 py-4 text-right rtl:text-left">{t('students.table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student, idx) => (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-slate-600 font-medium">{student.username}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center shadow-sm border border-white",
                                                    idx % 4 === 0 ? "bg-indigo-100 text-indigo-700" :
                                                        idx % 4 === 1 ? "bg-rose-100 text-rose-700" :
                                                            idx % 4 === 2 ? "bg-amber-100 text-amber-700" :
                                                                "bg-emerald-100 text-emerald-700"
                                                )}>
                                                    {student.full_name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">{student.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {student.email ? (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                    <span dir="ltr" className="text-left">{student.email}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 italic text-xs">No email</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <StudentForm onClose={handleClose} initialData={editingStudent} />
            )}
        </div>
    );
}
