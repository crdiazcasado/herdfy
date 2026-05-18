import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18nNavigation'

export default async function Footer() {
  const t = await getTranslations('footer')

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">

          <div className="flex items-center gap-2 text-center md:text-left">
            <div>
              <div className="font-bold text-gray-900">Herdfy</div>
              <div className="text-sm text-gray-600">{t('tagline')}</div>
            </div>
          </div>

          {/* Links legales */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <Link href="/privacidad" className="hover:text-gray-700 hover:underline">{t('privacy')}</Link>
            <Link href="/cookies" className="hover:text-gray-700 hover:underline">{t('cookies')}</Link>
            <Link href="/terminos" className="hover:text-gray-700 hover:underline">{t('terms')}</Link>
            <Link href="/aviso-legal" className="hover:text-gray-700 hover:underline">{t('legal')}</Link>
          </div>

          <div className="text-sm text-gray-400 text-center">
            {t('copyright')}
          </div>

        </div>
      </div>
    </footer>
  )
}
