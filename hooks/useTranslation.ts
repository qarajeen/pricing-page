import { translations } from '../i18n/translations';
import type { Language } from '../types';

export const useTranslation = (language: Language) => {
    const t = (key: string): any => {
        const keys = key.split('.');
        
        const getValue = (lang: Language) => {
            let result: any = translations[lang];
            for (const k of keys) {
                if (result === undefined || result === null) return undefined;
                result = result[k];
            }
            return result;
        };

        let result = getValue(language);

        // If translation not found in current language, fall back to English
        if (result === undefined) {
            result = getValue('en');
        }

        return result || key;
    };
    return { t };
};
