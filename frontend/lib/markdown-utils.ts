// 마크다운 파일을 읽어오는 유틸리티 함수

import fs from 'fs'
import path from 'path'

// 서버 사이드에서 마크다운 파일 읽기
export async function readMarkdownFile(filePath: string): Promise<string> {
  try {
    const fullPath = path.resolve(process.cwd(), filePath)
    const fileContent = await fs.promises.readFile(fullPath, 'utf8')
    return fileContent
  } catch (error) {
    console.error(`Error reading markdown file: ${filePath}`, error)
    return `# Error reading file: ${filePath}`
  }
}

// 클라이언트 사이드에서 마크다운 파일 가져오기
export async function fetchMarkdownFile(filePath: string): Promise<string> {
  try {
    const response = await fetch(filePath)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
    }
    return await response.text()
  } catch (error) {
    console.error(`Error fetching markdown file: ${filePath}`, error)
    return `# Error fetching file: ${filePath}`
  }
}

// 서버 컴포넌트에서 segment.md 불러오기
export async function getSegmentMarkdown(): Promise<string> {
  return await readMarkdownFile('frontend/segment.md')
}

// 서버 컴포넌트에서 sequence.md 불러오기
export async function getSequenceMarkdown(): Promise<string> {
  return await readMarkdownFile('frontend/sequence.md')
}
