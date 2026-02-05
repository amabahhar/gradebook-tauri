import { useState } from 'react';
import { Subject } from '../../lib/types';
import { useStore } from '../../lib/store';
import { X } from 'lucide-react';

interface SubjectFormProps {
    onClose: () => void;
    initialData?: Subject;
}

export function SubjectForm({ onClose, initialData }: SubjectFormProps) {
    const addSubject = useStore(state => state.addSubject);
    const updateSubject = useStore(state => state.updateSubject);

    const [formData, setFormData] = useState<Subject>(initialData || {
        id: crypto.randomUUID(),
        code: '',
        name_en: '',
        name_ar: '',
        max_exam1: 20,
        max_exam2: 20,
        max_coursework: 20,
        max_final_exam: 40,
        coursework_categories: []
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            updateSubject(formData);
        } else {
            addSubject(formData);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">{initialData ? 'Edit Subject' : 'New Subject'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
                        <input
                            type="text"
                            required
                            value={formData.code}
                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. MATH101"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name (English)</label>
                            <input
                                type="text"
                                required
                                dir="ltr"
                                value={formData.name_en}
                                onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name (Arabic)</label>
                            <input
                                type="text"
                                required
                                dir="rtl"
                                value={formData.name_ar}
                                onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-2">
                        <h3 className="text-sm font-semibold text-slate-900 mb-3">Grade Distribution</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'max_exam1', label: 'Exam 1' },
                                { key: 'max_exam2', label: 'Exam 2' },
                                { key: 'max_coursework', label: 'Coursework' },
                                { key: 'max_final_exam', label: 'Final Exam' }
                            ].map(f => (
                                <div key={f.key}>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">{f.label}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={formData[f.key as keyof Subject] as number}
                                        onChange={e => setFormData({ ...formData, [f.key]: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 text-right text-xs text-slate-500">
                            Total: {Number(formData.max_exam1 + formData.max_exam2 + formData.max_coursework + formData.max_final_exam)} pts
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
                        >
                            {initialData ? 'Save Changes' : 'Create Subject'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
