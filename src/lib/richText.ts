import type { Announcement } from '@/app/(payload)/payload-types'

type LexicalNode = {
  text?: unknown
  children?: unknown
}

/**
 * Walks a Lexical rich-text tree and returns a trimmed plain-text excerpt.
 * Used for homepage announcement teasers without pulling in a full HTML
 * converter. Falls back to an empty string for malformed input.
 */
export function lexicalToExcerpt(body: Announcement['body'], maxLength = 160): string {
  const parts: string[] = []

  const walk = (nodes: unknown): void => {
    if (!Array.isArray(nodes)) return
    for (const node of nodes as LexicalNode[]) {
      if (typeof node?.text === 'string') {
        parts.push(node.text)
      }
      if (Array.isArray(node?.children)) {
        walk(node.children)
      }
    }
  }

  walk(body?.root?.children)

  const text = parts.join(' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}
