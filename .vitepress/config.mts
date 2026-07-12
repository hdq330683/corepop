import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

// ===== 自动扫描目录生成侧边栏 =====
function generateSidebar(folder: string, label: string) {
  const dir = path.resolve(__dirname, '..', folder)
  if (!fs.existsSync(dir)) return [{ text: label, collapsed: false, items: [] }]

  const items: { text: string; link: string; sort: number }[] = []

  fs.readdirSync(dir)
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .forEach(file => {
      const filePath = path.join(dir, file)
      const content = fs.readFileSync(filePath, 'utf-8')

      // 从 frontmatter 提取 title 和 sort
      let title = file.replace('.md', '')
      let sort = 9999

      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
      if (fmMatch) {
        const fm = fmMatch[1]
        const titleMatch = fm.match(/^title:\s*"?(.+?)"?$/m)
        if (titleMatch) title = titleMatch[1].trim()
        const sortMatch = fm.match(/^sort:\s*(\d+)/m)
        if (sortMatch) sort = parseInt(sortMatch[1])
      } else {
        // 无 frontmatter，从第一个 # 标题提取
        const h1Match = content.match(/^#\s+(.+)$/m)
        if (h1Match) title = h1Match[1].trim()
      }

      items.push({
        text: title,
        link: `/${folder}/${file.replace('.md', '')}`,
        sort,
      })
    })

  // 按 sort 排序
  items.sort((a, b) => a.sort - b.sort)

  return [
    {
      text: label,
      collapsed: false,
      items: [
        { text: '概述', link: `/${folder}/` },
        ...items.map(i => ({ text: i.text, link: i.link })),
      ],
    },
  ]
}

// ===== 待替换的占位域名 =====
const SITE_DOMAIN = 'https://corepop.cn'

export default defineConfig({
  lang: 'zh-CN',
  title: 'CorePop',
  description: '硬核内容 · 自由表达 — 个人知识分享平台',
  lastUpdated: true,

  vite: {
    build: { emptyOutDir: false }
  },

  sitemap: {
    hostname: SITE_DOMAIN
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:site_name', content: 'CorePop' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: `${SITE_DOMAIN}/images/og-default.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=5' }],
  ],

  themeConfig: {
    logo: '/images/logo.png',
    siteTitle: 'CorePop',

    nav: [
      { text: '首页', link: '/' },
      { text: '作品', link: '/works/' },
      { text: '资料', link: '/guides/' },
      { text: '思考', link: '/articles/' },
      { text: '实践', link: '/ai-experience/' },
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/works/':        generateSidebar('works', '工作复盘'),
      '/guides/':       generateSidebar('guides', '资料整理'),
      '/articles/':     generateSidebar('articles', '深度思考'),
      '/ai-experience/': generateSidebar('ai-experience', '工具实践'),
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文章',
                buttonAriaLabel: '搜索文章'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/你的用户名/hudongquan-lawyer' }
    ],

    footer: {
      message: '硬核内容 · 自由表达',
      copyright: 'Copyright © 2025 CorePop | <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备2025XXXXXX号</a>'
    },

    outline: {
      label: '本页目录',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdatedText: '最后更新',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
  },

  // 动态 OG 标签
  transformPageData(pageData, ctx) {
    const title = pageData.frontmatter.title || pageData.title
    const description = pageData.frontmatter.description || ctx.siteConfig.site.description
    const image = pageData.frontmatter.coverImage || `${SITE_DOMAIN}/images/og-default.png`
    const url = `${SITE_DOMAIN}/${pageData.relativePath.replace(/\.md$/, '')}`

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'twitter:title', content: title }],
      ['meta', { property: 'twitter:description', content: description }],
      ['meta', { property: 'twitter:image', content: image }],
    )
  },
})
