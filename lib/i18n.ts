import * as Localization from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { storage } from './storage'

import en from '../locales/en.json'
import pl from '../locales/pl.json'
import zh from '../locales/zh.json'

const deviceLanguage = (Localization.getLocales && Localization.getLocales()[0]?.languageCode) || 'en'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    pl: { translation: pl },
    zh: { translation: zh },
  },
  lng: deviceLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

if (typeof window !== 'undefined') {
    storage.getLanguage().then((savedLanguage) => {
      if (savedLanguage) {
        i18n.changeLanguage(savedLanguage)
      }
    })
}

export default i18n