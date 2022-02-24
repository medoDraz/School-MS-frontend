// import defaultSettings from '@/settings'
import i18n from '@/lang'

export default function getPageTitle(pageTitle) {
  const title = i18n.t('accountant_admin')
  const hasKey = i18n.te(`${pageTitle}`)
  if (hasKey) {
    const pageName = i18n.t(`${pageTitle}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}
