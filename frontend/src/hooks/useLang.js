import { useState } from 'react'

export function useLang() {
  const [lang, setLangState] = useState(() => localStorage.getItem('rr-lang') || 'en')

  const setLang = (code) => {
    localStorage.setItem('rr-lang', code)
    setLangState(code)
  }

  return [lang, setLang]
}