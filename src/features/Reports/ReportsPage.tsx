import { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FileDown, FileText, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ReportsPage() {
    const { t } = useTranslation();
    const subjects = useStore(state => state.db.subjects);
    const students = useStore(state => state.db.students);
    const grades = useStore(state => state.db.grades);

    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

    useEffect(() => {
        if (subjects.length > 0 && !selectedSubjectId) {
            setSelectedSubjectId(subjects[0].id);
        }
    }, [subjects, selectedSubjectId]);

    const selectedSubject = subjects.find(s => s.id === selectedSubjectId);

    const getStudentGrade = (studentId: string) => {
        return grades.find(g => g.subject_id === selectedSubjectId && g.student_id === studentId);
    };

    const exportPDF = () => {
        if (!selectedSubject) return;

        const doc = new jsPDF();

        // Note: jsPDF default fonts might not support Arabic well without a custom font.
        // For now, we keep the PDF generation somewhat standard or assume English charset for names mostly.
        // A full Arabic PDF solution requires loading a font like 'Amiri'.

        doc.setFontSize(18);
        doc.text(selectedSubject.name_en, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Subject Code: ${selectedSubject.code}`, 14, 28);

        const tableBody = students.map(s => {
            const g = getStudentGrade(s.id);
            const total = g?.total || 0;

            return [
                s.username,
                s.full_name,
                g?.exam1 || '-',
                g?.exam2 || '-',
                g?.coursework || '-',
                g?.final_exam || '-',
                total,
                g?.absences?.length || 0
            ];
        });

        autoTable(doc, {
            head: [['ID', 'Name', 'Ex1', 'Ex2', 'CW', 'Final', 'Total', 'Abs']],
            body: tableBody,
            startY: 35,
            theme: 'grid',
            headStyles: { fillColor: [66, 133, 244] },
        });

        doc.save(`${selectedSubject.name_en}_Report.pdf`);
    };

    const exportExcel = () => {
        if (!selectedSubject) return;

        const data = students.map(s => {
            const g = getStudentGrade(s.id);
            return {
                ID: s.username,
                Name: s.full_name,
                Exam1: g?.exam1 || 0,
                Exam2: g?.exam2 || 0,
                Coursework: g?.coursework || 0,
                Final: g?.final_exam || 0,
                Total: g?.total || 0,
                Absences: g?.absences?.length || 0
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Grades");
        XLSX.writeFile(wb, `${selectedSubject.name_en}_Grades.xlsx`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{t('reports.title')}</h1>
                    <p className="text-slate-500 mt-1">{t('reports.subtitle')}</p>
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
                <div className="bg-white p-16 rounded-xl text-center text-slate-500 border border-slate-200">
                    <p>{t('reports.select_prompt')}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-default">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-red-100 transition-colors">
                            <FileText className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t('reports.pdf.title')}</h3>
                        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                            {t('reports.pdf.description')}
                        </p>
                        <button
                            onClick={exportPDF}
                            className="w-full py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                        >
                            <FileDown className="w-4 h-4" />
                            {t('reports.pdf.button')}
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-default">
                        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-100 transition-colors">
                            <FileText className="w-7 h-7 text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t('reports.excel.title')}</h3>
                        <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                            {t('reports.excel.description')}
                        </p>
                        <button
                            onClick={exportExcel}
                            className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <FileDown className="w-4 h-4" />
                            {t('reports.excel.button')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
