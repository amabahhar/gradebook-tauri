import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    GraduationCap,
    Calendar,
    FileText,
    Settings,
    School,
    Globe
} from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../../lib/store';

export function Sidebar() {
    const { t, i18n } = useTranslation();

    const navItems = [
        { to: '/', label: t('sidebar.dashboard'), icon: LayoutDashboard },
        { to: '/subjects', label: t('sidebar.courses'), icon: BookOpen },
        { to: '/students', label: t('sidebar.students'), icon: Users },
        { to: '/grades', label: t('sidebar.grades'), icon: GraduationCap },
        { to: '/absences', label: t('sidebar.attendance'), icon: Calendar },
        { to: '/reports', label: t('sidebar.reports'), icon: FileText },
    ];

    return (
        <aside className="w-[260px] bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen shrink-0 font-sans transition-all duration-300 z-50">
            {/* Institution Header */}
            <div className="h-20 flex items-center gap-3 px-6 border-b border-white/5 mx-2 mb-2">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center shrink-0 border border-white/10">
                    <School className="text-white w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <span className="text-white font-bold text-sm tracking-wide">{t('sidebar.institution')}</span>
                    <span className="text-xs text-slate-500 font-medium">{t('sidebar.role')}</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                <div className="px-3 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-80">
                    {t('sidebar.menu')}
                </div>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                            isActive
                                ? "bg-white/10 text-white shadow-inner"
                                : "hover:bg-white/5 hover:text-white text-slate-400"
                        )}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={clsx(
                                    "absolute left-0 rtl:left-auto rtl:right-0 w-1 h-6 rounded-r-full rtl:rounded-r-none rtl:rounded-l-full transition-all duration-300",
                                    isActive ? "bg-indigo-500 opacity-100" : "opacity-0"
                                )} />
                                <item.icon className={clsx("w-4 h-4 transition-colors", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300")} />
                                <span>{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}

                <div className="px-3 mt-8 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-80">
                    {t('sidebar.system')}
                </div>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => clsx(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                        isActive
                            ? "bg-white/10 text-white"
                            : "hover:bg-white/5 hover:text-white text-slate-400"
                    )}
                >
                    <Settings className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
                    <span>{t('sidebar.settings')}</span>
                </NavLink>
            </nav>

            {/* User / Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm space-y-4">
                {/* Language Toggle */}
                <button
                    onClick={() => {
                        const newLang = i18n.language === 'en' ? 'ar' : 'en';
                        i18n.changeLanguage(newLang);
                        useStore.getState().updateSettings({ default_language: newLang });
                        document.dir = newLang === 'ar' ? 'rtl' : 'ltr';
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('sidebar.language_label', 'Language')}</span>
                    </div>
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded uppercase border border-indigo-500/30">
                        {i18n.language}
                    </span>
                </button>

                <div className="flex items-center gap-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">John Doe</div>
                        <div className="text-xs text-slate-500 truncate">john.doe@university.edu</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
