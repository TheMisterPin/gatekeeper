import type { ReactElement, ReactNode } from "react"

function collectText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(collectText).join("")
  if (typeof node === "object" && "props" in (node as Record<string, unknown>)) {
    const element = node as ReactElement
    return collectText(element.props.children)
  }
  return ""
}

export function findElementsByType(node: ReactNode, type: string): ReactElement[] {
  const results: ReactElement[] = []

  function walk(current: ReactNode) {
    if (current == null || typeof current === "boolean") return
    if (Array.isArray(current)) {
      current.forEach(walk)
      return
    }

    if (typeof current === "object" && "type" in (current as Record<string, unknown>)) {
      const element = current as ReactElement
      if (element.type === type) {
        results.push(element)
      }
      walk(element.props?.children)
    }
  }

  walk(node)
  return results
}

export function findButtonByLabel(root: ReactNode, label: string): ReactElement | undefined {
  const buttons = findElementsByType(root, "button")
  return buttons.find((button) => collectText(button.props.children) === label)
}

export function extractTextContent(node: ReactNode): string {
  return collectText(node)
}
