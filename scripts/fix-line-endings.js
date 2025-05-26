#!/usr/bin/env node

/**
 * 修复行尾符问题的脚本
 * 将所有文本文件的行尾符统一为 LF
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

// 需要处理的文件扩展名
const textExtensions = [
  '.md', '.js', '.ts', '.vue', '.json', '.yaml', '.yml',
  '.html', '.css', '.scss', '.less', '.txt', '.gitignore',
  '.gitattributes', '.editorconfig'
]

// 需要忽略的目录
const ignoreDirs = [
  'node_modules', '.git', '.vitepress/dist', '.vitepress/cache',
  '.obsidian', '.temp', '.netlify'
]

/**
 * 检查是否应该忽略该路径
 */
function shouldIgnore(filePath) {
  const relativePath = path.relative(rootDir, filePath)
  return ignoreDirs.some(dir => relativePath.startsWith(dir))
}

/**
 * 检查是否是文本文件
 */
function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return textExtensions.includes(ext)
}

/**
 * 修复文件的行尾符
 */
function fixLineEndings(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    // 将所有类型的行尾符统一为 LF
    const fixedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8')
      console.log(`✅ 修复: ${path.relative(rootDir, filePath)}`)
      return true
    }
    return false
  } catch (error) {
    console.error(`❌ 错误处理文件 ${filePath}:`, error.message)
    return false
  }
}

/**
 * 递归处理目录
 */
function processDirectory(dirPath) {
  let fixedCount = 0
  
  try {
    const items = fs.readdirSync(dirPath)
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item)
      
      if (shouldIgnore(itemPath)) {
        continue
      }
      
      const stat = fs.statSync(itemPath)
      
      if (stat.isDirectory()) {
        fixedCount += processDirectory(itemPath)
      } else if (stat.isFile() && isTextFile(itemPath)) {
        if (fixLineEndings(itemPath)) {
          fixedCount++
        }
      }
    }
  } catch (error) {
    console.error(`❌ 错误处理目录 ${dirPath}:`, error.message)
  }
  
  return fixedCount
}

/**
 * 主函数
 */
function main() {
  console.log('🔧 开始修复行尾符问题...')
  console.log(`📁 处理目录: ${rootDir}`)
  console.log('📝 处理的文件类型:', textExtensions.join(', '))
  console.log('🚫 忽略的目录:', ignoreDirs.join(', '))
  console.log('')
  
  const startTime = Date.now()
  const fixedCount = processDirectory(rootDir)
  const endTime = Date.now()
  
  console.log('')
  console.log(`✨ 完成！修复了 ${fixedCount} 个文件`)
  console.log(`⏱️  耗时: ${endTime - startTime}ms`)
  
  if (fixedCount > 0) {
    console.log('')
    console.log('📋 接下来的步骤:')
    console.log('1. git add .')
    console.log('2. git commit -m "fix: 统一行尾符为 LF"')
    console.log('3. git push')
  }
}

// 运行脚本
main()
