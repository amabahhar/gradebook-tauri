import { Sidebar } from './Sidebar';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function AppShell({ children }: { children: React.ReactNode }) {
    const { i18n } = useTranslation();

    useEffect(() => {
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = i18n.language;
    }, [i18n.language]);

    return (
        <div className="flex h-screen bg-[#f5f6f8] font-sans text-slate-900 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto flex flex-col">
                {/* Top Header Placeholder (optional for user profile, breadcrumbs) */}
                {/* <header className="h-16 bg-white border-b border-slate-200 shrink-0"></header> */}

                <div className="flex-1 p-8 md:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
