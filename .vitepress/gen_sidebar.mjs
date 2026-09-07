import fs from 'node:fs'
import path from 'node:path'

/**
 * 根据 docs 下的目录结构生成 VitePress sidebar items。
 * pathname 使用站点 URL 路径，例如 /blog 或 /en/blog。
 */
const ROOT_DIR = path.resolve(process.cwd(), 'docs')
const WHITE_LIST = new Set(['index.md', '.vitepress', 'node_modules', '.idea', 'assets'])

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

function visibleEntries(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !WHITE_LIST.has(entry.name) && (entry.isDirectory() || entry.name.endsWith('.md')))
    .sort((a, b) => naturalSort(a.name, b.name))
}

function getList(dir, pathname, isRoot = false) {
  return visibleEntries(dir).flatMap((entry) => {
    const absolutePath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      const items = getList(absolutePath, `${pathname}/${entry.name}`)
      if (!items.length) return []
      return [{ text: entry.name, items, collapsible: isRoot, collapsed: false }]
    }

    const slug = entry.name.slice(0, -'.md'.length)
    return [{ text: slug, link: `${pathname}/${slug}` }]
  })
}

/**
 * @param {string} pathname 站点 URL 路径，例如 /blog 或 /en/blog
 * @returns {Array<{text: string, items?: Array, link?: string, collapsible?: boolean, collapsed?: boolean}>}
 */
export function set_sidebar(pathname) {
  const normalized = `/${pathname.replace(/^\/+|\/+$/g, '')}`
  const relativePath = normalized.slice(1)
  return getList(path.join(ROOT_DIR, relativePath), normalized, true)
}
