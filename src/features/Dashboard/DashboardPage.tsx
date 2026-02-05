import { useStore } from '../../lib/store';
import { useTranslation } from 'react-i18next';
import {
    Users,
    BookOpen,
    GraduationCap,
    AlertCircle,
    TrendingUp,
    ArrowRight,
    Clock,
    Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
    const { t } = useTranslation();
    const subjects = useStore(state => state.db.subjects);
    const students = useStore(state => state.db.students);
    const grades = useStore(state => state.db.grades);

    // Calculate Metrics
    const totalStudents = students.length;
    const totalSubjects = subjects.length;

    // Calculate Average Grade (rough approximation)
    const gradesWithTotal = grades.filter(g => g.total !== null && g.total !== undefined);
    const averageGrade = gradesWithTotal.length > 0
        ? (gradesWithTotal.reduce((acc, curr) => acc + (curr.total || 0), 0) / gradesWithTotal.length).toFixed(1)
        : '-';

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('dashboard.title')}</h1>
                <p className="text-slate-500 mt-2 text-lg">{t('dashboard.welcome')}</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{totalStudents}</div>
                    <div className="text-sm text-slate-500">{t('dashboard.metrics.total_students')}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">Active</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{totalSubjects}</div>
                    <div className="text-sm text-slate-500">{t('dashboard.metrics.active_courses')}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+2.4%</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{averageGrade}%</div>
                    <div className="text-sm text-slate-500">{t('dashboard.metrics.avg_performance')}</div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded">Pending</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">3</div>
                    <div className="text-sm text-slate-500">{t('dashboard.metrics.pending')}</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {t('dashboard.quick_actions')}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/grades" className="block p-5 bg-white border border-slate-200 hover:border-blue-400 rounded-xl shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-2">
                                <GraduationCap className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <h4 className="font-bold text-slate-900">{t('dashboard.enter_grades')}</h4>
                            <p className="text-sm text-slate-500 mt-1">{t('dashboard.enter_grades_desc')}</p>
                        </Link>

                        <Link to="/absences" className="block p-5 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center justify-between mb-2">
                                <Calendar className="w-6 h-6 text-indigo-500 group-hover:scale-110 transition-transform" />
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <h4 className="font-bold text-slate-900">{t('dashboard.mark_attendance')}</h4>
                            <p className="text-sm text-slate-500 mt-1">{t('dashboard.mark_attendance_desc')}</p>
                        </Link>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{t('dashboard.course_overview')}</h3>
                        {subjects.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                No courses created yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {subjects.map(subject => (
                                    <div key={subject.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm text-xs">
                                                {subject.code}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{subject.name_en}</h4>
                                                <p className="text-xs text-slate-500">{subject.name_ar}</p>
                                            </div>
                                        </div>
                                        <Link to={`/grades?subject=${subject.id}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors">
                                            {t('dashboard.view_class')}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Panel / Notifications */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800">{t('dashboard.status.title')}</h3>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
                        <h4 className="font-bold text-lg mb-2">{t('dashboard.status.db_status')}</h4>
                        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-6">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            {t('dashboard.status.online')}
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm text-slate-400 border-b border-white/10 pb-2">
                                <span>{t('dashboard.status.storage')}</span>
                                <span className="text-white">1.2 MB</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-400 border-b border-white/10 pb-2">
                                <span>{t('dashboard.status.backup')}</span>
                                <span className="text-white">Just now</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-400 pb-2">
                                <span>{t('dashboard.status.version')}</span>
                                <span className="text-white">v0.1.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
