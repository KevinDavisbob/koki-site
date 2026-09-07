import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import InteractiveTools from './components/InteractiveTools.vue'
import ContentPage from './components/ContentPage.vue'
import HomeReplica from './components/HomeReplica.vue'
import BlogReplica from './components/BlogReplica.vue'
import LabReplica from './components/LabReplica.vue'
import FullLabData from './components/FullLabData.vue'
import LearningReplica from './components/LearningReplica.vue'

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('SiteHome', { template: '<div class="site-home"><slot /></div>' })
    app.component('InteractiveTools', InteractiveTools)
    app.component('ContentPage', ContentPage)
    app.component('HomeReplica', HomeReplica)
    app.component('BlogReplica', BlogReplica)
    app.component('LabReplica', LabReplica)
    app.component('FullLabData', FullLabData)
    app.component('LearningReplica', LearningReplica)
    if (typeof document !== 'undefined') {
      const apple = /Mac|iPhone|iPad|iPod/.test(navigator.platform) && CSS.supports('backdrop-filter', 'blur(1px)')
      document.documentElement.dataset.platform = apple ? 'apple-glass' : 'standard'
      const base = import.meta.env.BASE_URL.replace(/\/$/, '')
      const staticPath = (href: string) => {
        if (!href.startsWith('/') || href.startsWith('//') || href.startsWith('#')) return href
        const path = base && !href.startsWith(`${base}/`) ? `${base}${href}` : href
        return path.endsWith('/') || path.includes('.') ? path : `${path}.html`
      }
      const rewriteLinks = () => document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
        const href = link.getAttribute('href')
        if (href) link.setAttribute('href', staticPath(href))
      })
      rewriteLinks()
      document.addEventListener('click', (event) => {
        const target = event.target
        if (!(target instanceof Element)) return
        const link = target.closest<HTMLAnchorElement>('a[href]')
        if (!link) return
        const href = link.getAttribute('href')
        if (!href) return
        const normalized = staticPath(href)
        if (normalized !== href) {
          event.preventDefault()
          window.location.assign(normalized)
        }
      }, true)
      window.addEventListener('scroll', () => document.documentElement.style.setProperty('--reading-progress', `${Math.min(100, (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)) * 100)}%`), { passive: true })
    }
  },
}

export default theme
