import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function SettingsPage() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{t('sidebar.settings')}</h1>
                <p className="text-slate-500 mt-2 text-lg">Manage system preferences.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
                <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                        <Globe className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Language / اللغة</h3>
                        <p className="text-slate-500 mb-6">Select your preferred interface language.</p>

                        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${i18n.language === 'en'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => changeLanguage('ar')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all font-sans ${i18n.language === 'ar'
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                العربية
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
