import 'reflect-metadata';
import { z } from 'zod';
import { promises as fs } from 'fs';
import path from 'path';
import { Tool, Resource, Input } from '@sker/mcp';
import { Injectable } from '@sker/di';

@Injectable({providedIn: 'auto'})
class FileSystemService {
  
  @Tool({
    name: 'list-directory',
    description: '列出指定目录下的文件和子目录'
  })
  async listDirectory(
    @Input(z.string().default('.').describe('要列出的目录路径')) dirPath: string = '.',
    @Input(z.boolean().default(false).describe('是否显示隐藏文件')) showHidden: boolean = false,
    @Input(z.boolean().default(false).describe('是否递归列出子目录')) recursive: boolean = false
  ) {
    try {
      const results = await this.listDirectoryRecursive(dirPath, showHidden, recursive, 0);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(results, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法列出目录 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'read-file',
    description: '读取文件内容'
  })
  async readFile(
    @Input(z.string().describe('要读取的文件路径')) filePath: string,
    @Input(z.string().default('utf8').describe('文件编码格式')) encoding: string = 'utf8'
  ) {
    try {
      const content = await fs.readFile(filePath, encoding as BufferEncoding);
      const stats = await fs.stat(filePath);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            path: filePath,
            content: content,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            encoding: encoding
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法读取文件 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'write-file',
    description: '写入文件内容'
  })
  async writeFile(
    @Input(z.string().describe('要写入的文件路径')) filePath: string,
    @Input(z.string().describe('文件内容')) content: string,
    @Input(z.string().default('utf8').describe('文件编码格式')) encoding: string = 'utf8',
    @Input(z.boolean().default(true).describe('是否自动创建目录')) createDirectories: boolean = true
  ) {
    try {
      if (createDirectories) {
        const dir = path.dirname(filePath);
        await fs.mkdir(dir, { recursive: true });
      }
      
      await fs.writeFile(filePath, content, encoding as BufferEncoding);
      const stats = await fs.stat(filePath);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: '文件写入成功',
            path: filePath,
            size: stats.size,
            modified: stats.mtime.toISOString()
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法写入文件 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'create-directory',
    description: '创建目录'
  })
  async createDirectory(
    @Input(z.string().describe('要创建的目录路径')) dirPath: string,
    @Input(z.boolean().default(true).describe('是否递归创建父目录')) recursive: boolean = true
  ) {
    try {
      await fs.mkdir(dirPath, { recursive });
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: '目录创建成功',
            path: dirPath
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法创建目录 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'delete-file',
    description: '删除文件'
  })
  async deleteFile(
    @Input(z.string().describe('要删除的文件路径')) filePath: string
  ) {
    try {
      await fs.unlink(filePath);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: '文件删除成功',
            path: filePath
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法删除文件 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'delete-directory',
    description: '删除目录'
  })
  async deleteDirectory(
    @Input(z.string().describe('要删除的目录路径')) dirPath: string,
    @Input(z.boolean().default(false).describe('是否递归删除目录内容')) recursive: boolean = false
  ) {
    try {
      await fs.rmdir(dirPath, { recursive });
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: '目录删除成功',
            path: dirPath
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法删除目录 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'copy-file',
    description: '复制文件'
  })
  async copyFile(
    @Input(z.string().describe('源文件路径')) source: string,
    @Input(z.string().describe('目标文件路径')) destination: string,
    @Input(z.boolean().default(false).describe('是否覆盖已存在的文件')) overwrite: boolean = false
  ) {
    try {
      if (!overwrite) {
        try {
          await fs.access(destination);
          throw new Error('目标文件已存在');
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
          }
        }
      }
      
      const dir = path.dirname(destination);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.copyFile(source, destination);
      const stats = await fs.stat(destination);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: '文件复制成功',
            source: source,
            destination: destination,
            size: stats.size
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法复制文件 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'move-file',
    description: '移动或重命名文件'
  })
  async moveFile(
    @Input(z.string().describe('源文件路径')) source: string,
    @Input(z.string().describe('目标文件路径')) destination: string,
    @Input(z.boolean().default(false).describe('是否覆盖已存在的文件')) overwrite: boolean = false
  ) {
    try {
      if (!overwrite) {
        try {
          await fs.access(destination);
          throw new Error('目标文件已存在');
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
          }
        }
      }
      
      const dir = path.dirname(destination);
      await fs.mkdir(dir, { recursive: true });
      
      await fs.rename(source, destination);
      const stats = await fs.stat(destination);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            message: '文件移动成功',
            source: source,
            destination: destination,
            size: stats.size
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法移动文件 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'get-file-stats',
    description: '获取文件或目录的详细信息'
  })
  async getFileStats(
    @Input(z.string().describe('文件或目录路径')) filePath: string
  ) {
    try {
      const stats = await fs.stat(filePath);
      const absolutePath = path.resolve(filePath);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            path: absolutePath,
            type: stats.isDirectory() ? 'directory' : 'file',
            size: stats.size,
            created: stats.birthtime.toISOString(),
            modified: stats.mtime.toISOString(),
            accessed: stats.atime.toISOString(),
            permissions: stats.mode.toString(8),
            isReadable: !!(stats.mode & parseInt('444', 8)),
            isWritable: !!(stats.mode & parseInt('222', 8)),
            isExecutable: !!(stats.mode & parseInt('111', 8))
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 无法获取文件信息 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Tool({
    name: 'search-files',
    description: '搜索文件'
  })
  async searchFiles(
    @Input(z.string().describe('搜索的根目录')) directory: string,
    @Input(z.string().describe('文件名匹配模式（支持通配符）')) pattern: string,
    @Input(z.string().optional().describe('文件内容搜索关键词')) content?: string,
    @Input(z.number().default(10).describe('最大搜索深度')) maxDepth: number = 10
  ) {
    try {
      const results = await this.searchFilesRecursive(directory, pattern, content, maxDepth, 0);
      
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            searchResults: results,
            total: results.length
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `错误: 搜索失败 - ${(error as Error).message}`
        }],
        isError: true
      };
    }
  }

  @Resource({
    uri: 'filesystem://info',
    name: 'filesystem-info',
    description: '文件系统插件信息'
  })
  async getPluginInfo() {
    return {
      contents: [{
        uri: 'filesystem://info',
        mimeType: 'application/json',
        text: JSON.stringify({
          name: 'Sker MCP Filesystem Plugin',
          version: '1.0.0',
          description: '提供全面的文件系统操作功能',
          features: [
            'list-directory',
            'read-file',
            'write-file',
            'create-directory',
            'delete-file',
            'delete-directory',
            'copy-file',
            'move-file',
            'get-file-stats',
            'search-files'
          ],
          status: 'active',
          author: 'Sker Team'
        }, null, 2)
      }]
    };
  }

  @Resource({
    uri: 'filesystem://file/{path}',
    name: 'file-content',
    title: '文件内容',
    description: '通过路径访问文件内容',
    isTemplate: true
  })
  async getFileContentResource(request: any) {
    try {
      const url = new URL(request.params.uri);
      const filePath = decodeURIComponent(url.pathname.replace('/file/', ''));
      
      const content = await fs.readFile(filePath, 'utf-8');
      const stats = await fs.stat(filePath);
      
      return {
        contents: [{
          uri: request.params.uri,
          mimeType: this.getMimeType(filePath),
          text: content,
          size: stats.size
        }]
      };
    } catch (error) {
      throw new Error(`无法读取文件: ${(error as Error).message}`);
    }
  }

  // Helper methods
  private async listDirectoryRecursive(
    dirPath: string, 
    showHidden: boolean, 
    recursive: boolean, 
    depth: number
  ): Promise<any[]> {
    const items: any[] = [];
    const entries = await fs.readdir(dirPath);
    
    for (const entry of entries) {
      if (!showHidden && entry.startsWith('.')) {
        continue;
      }
      
      const fullPath = path.join(dirPath, entry);
      const stats = await fs.stat(fullPath);
      
      const item = {
        name: entry,
        path: fullPath,
        type: stats.isDirectory() ? 'directory' : 'file',
        size: stats.size,
        modified: stats.mtime.toISOString(),
        permissions: stats.mode.toString(8)
      };
      
      if (recursive && stats.isDirectory() && depth < 5) {
        try {
          (item as any).children = await this.listDirectoryRecursive(fullPath, showHidden, true, depth + 1);
        } catch (error) {
          (item as any).error = `无法访问: ${(error as Error).message}`;
        }
      }
      
      items.push(item);
    }
    
    return items;
  }

  private async searchFilesRecursive(
    directory: string, 
    pattern: string, 
    contentPattern?: string, 
    maxDepth: number = 10, 
    currentDepth: number = 0
  ): Promise<any[]> {
    if (currentDepth >= maxDepth) {
      return [];
    }
    
    const results: any[] = [];
    const entries = await fs.readdir(directory);
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry);
      
      try {
        const stats = await fs.stat(fullPath);
        
        if (stats.isDirectory()) {
          const subResults = await this.searchFilesRecursive(
            fullPath, pattern, contentPattern, maxDepth, currentDepth + 1
          );
          results.push(...subResults);
        } else if (stats.isFile()) {
          const nameMatches = this.matchPattern(entry, pattern);
          let contentMatches = true;
          
          if (contentPattern && nameMatches) {
            try {
              const fileContent = await fs.readFile(fullPath, 'utf8');
              contentMatches = fileContent.toLowerCase().includes(contentPattern.toLowerCase());
            } catch (error) {
              contentMatches = false;
            }
          }
          
          if (nameMatches && contentMatches) {
            results.push({
              name: entry,
              path: fullPath,
              size: stats.size,
              modified: stats.mtime.toISOString()
            });
          }
        }
      } catch (error) {
        continue;
      }
    }
    
    return results;
  }

  private matchPattern(filename: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(filename);
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.txt': 'text/plain',
      '.json': 'application/json',
      '.js': 'application/javascript',
      '.ts': 'application/typescript',
      '.jsx': 'application/javascript',
      '.tsx': 'application/typescript',
      '.md': 'text/markdown',
      '.html': 'text/html',
      '.htm': 'text/html',
      '.css': 'text/css',
      '.xml': 'application/xml',
      '.yml': 'text/yaml',
      '.yaml': 'text/yaml',
      '.py': 'text/x-python',
      '.java': 'text/x-java',
      '.cpp': 'text/x-c++src',
      '.c': 'text/x-csrc',
      '.h': 'text/x-chdr',
      '.go': 'text/x-go',
      '.rs': 'text/x-rust',
      '.php': 'text/x-php',
      '.rb': 'text/x-ruby',
      '.sql': 'text/x-sql',
      '.sh': 'text/x-shellscript',
      '.bat': 'text/x-msdos-batch',
      '.ps1': 'text/x-powershell'
    };
    return mimeTypes[ext] || 'text/plain';
  }
}

// Plugin main object
const plugin = {
  name: 'sker-mcp-filesystem',
  version: '1.0.0',
  description: 'Sker MCP 文件系统插件 - 提供全面的文件和目录操作功能',
  author: 'Sker Team',
  
  services: [FileSystemService],
  
  configSchema: z.object({
    allowedDirectories: z.array(z.string()).default([]).describe('允许访问的目录列表（空数组表示无限制）'),
    maxFileSize: z.number().default(10 * 1024 * 1024).describe('最大文件大小限制（字节）'),
    enableWrite: z.boolean().default(true).describe('是否启用写入操作'),
    enableDelete: z.boolean().default(false).describe('是否启用删除操作'),
    searchDepthLimit: z.number().default(10).describe('搜索深度限制')
  }),
  
  hooks: {
    async onLoad() {
      // 插件加载完成 - 移除 console.log 避免污染 MCP stdio
    },
    
    async onUnload() {
      // 插件卸载完成 - 移除 console.log 避免污染 MCP stdio
    }
  }
};

export default plugin;