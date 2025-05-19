import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
export default defineUserConfig({
  lang: 'zh-CN',
  title: 'My Blog',
  description: '这是我的第一个 VuePress 站点',
  base: '/vuepress/',
  theme: defaultTheme({
    logo: '/images/logo.png',
    navbar: [
      '/',
      {
        text: '资源',
        link: '/posts/resource/',
      },
      {
        text: 'Spring',
        link: '/posts/spring/',
      },
      {
        text: '文章',
        link: '/article/',
      },
      {
        text: '目录',
        link: '/category/',
      },
      {
        text: '标签',
        link: '/tag/',
      },
      {
        text: 'Timeline',
        link: '/timeline/',
      },
    ],
    sidebar: {
      '/posts/resource/': ['/posts/resource/'],
      '/posts/spring/': [
          {
            text: 'Spring',
            link: '/posts/spring/',
          },
          {
            text: 'Spring Framework',
            prefix: '/posts/spring/',
            collapsible: true,
            children: [
                'spring-framework',
                'spring-framework-ioc',
                'spring-framework-ioc-impi',
            ],
          },
          {
            text: 'Spring Boot',
            prefix: '/posts/spring/',
            children: ['spring-boot'],
            collapsible: true,
          }
      ]
    },
    sidebarDepth: 1,
  }),

  plugins: [
    blogPlugin({
      // Only files under posts are articles
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('posts/') : false,

      // Getting article info
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || '',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt:
          // Support manually set excerpt through frontmatter
          typeof frontmatter.excerpt === 'string'
            ? frontmatter.excerpt
            : data?.excerpt || '',
      }),

      // Generate excerpt for all pages excerpt those users choose to disable
      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home &&
        frontmatter.excerpt !== false &&
        typeof frontmatter.excerpt !== 'string',

      category: [
        {
          key: 'category',
          getter: (page) => page.frontmatter.category || [],
          layout: 'Category',
          itemLayout: 'Category',
          frontmatter: () => ({
            title: 'Categories',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Category ${name}`,
            sidebar: false,
          }),
        },
        {
          key: 'tag',
          getter: (page) => page.frontmatter.tag || [],
          layout: 'Tag',
          itemLayout: 'Tag',
          frontmatter: () => ({
            title: 'Tags',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Tag ${name}`,
            sidebar: false,
          }),
        },
      ],

      type: [
        {
          key: 'article',
          // Remove archive articles
          filter: (page) => !page.frontmatter.archive,
          layout: 'Article',
          frontmatter: () => ({
            title: 'Articles',
            sidebar: false,
          }),
          // Sort pages with time and sticky
          sorter: (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky

            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky) return -1

            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1

            if (!pageB.frontmatter.date) return 1
            if (!pageA.frontmatter.date) return -1

            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            )
          },
        },
        {
          key: 'timeline',
          // Only article with date should be added to timeline
          filter: (page) => page.frontmatter.date instanceof Date,
          // Sort pages with time
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          layout: 'Timeline',
          frontmatter: () => ({
            title: 'Timeline',
            sidebar: false,
          }),
        },
      ],
      hotReload: true,
    }),
    mdEnhancePlugin({
      chartjs: true,
      echarts: true,
      flowchart: true,
      markmap: true,
      mermaid: true,
      plantuml: true,
    }),
    backToTopPlugin(),
  ],
  bundler: viteBundler(),
})
