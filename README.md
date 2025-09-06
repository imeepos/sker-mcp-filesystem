# Sker MCP 文件系统插件

一个基于 TypeScript 开发的 Sker MCP 文件系统插件，使用依赖注入和装饰器模式提供全面的文件系统操作功能。

## 功能特性

### 🛠️ 工具 (Tools)

- **list-directory** - 列出指定目录下的文件和子目录，支持递归模式和隐藏文件显示
- **read-file** - 读取文件内容，支持多种编码格式
- **write-file** - 写入文件内容，支持自动创建目录结构
- **create-directory** - 创建目录，支持递归创建
- **delete-file** - 删除文件
- **delete-directory** - 删除目录，支持递归删除
- **copy-file** - 复制文件，支持覆盖控制和自动创建目标目录
- **move-file** - 移动或重命名文件
- **get-file-stats** - 获取文件或目录的详细信息，包括权限、时间戳等
- **search-files** - 搜索文件，支持文件名模式匹配和内容搜索

### 📄 资源 (Resources)

- **filesystem://info** - 插件信息和状态
- **filesystem://file/{path}** - 通过路径访问文件内容的模板资源（支持 MIME 类型自动识别）

## 技术特性

- 🎯 **TypeScript 开发** - 类型安全的完整实现
- 💉 **依赖注入** - 使用 @sker/di 的依赖注入容器
- 🏗️ **装饰器模式** - 使用 @Tool 和 @Resource 装饰器
- 📝 **Zod 验证** - 输入参数类型验证和自动文档生成
- 🛡️ **错误处理** - 完善的异常处理和错误信息返回
- 🔍 **MIME 类型识别** - 支持多种文件类型的 MIME 类型自动识别

## 安装

### 通过源码安装

```bash
# 克隆仓库
git clone git@github.com:imeepos/sker-mcp-filesystem.git

# 安装依赖
cd sker-mcp-filesystem
pnpm install

# 构建项目
pnpm run build

# 安装到 Sker 插件目录
cp -r . ~/.sker/plugins/sker-mcp-filesystem
```

## 配置

插件支持以下配置选项：

```json
{
  "allowedDirectories": [],
  "maxFileSize": 10485760,
  "enableWrite": true,
  "enableDelete": false,
  "searchDepthLimit": 10
}
```

### 配置选项说明

- **allowedDirectories** (数组): 允许访问的目录列表，空数组表示无限制
- **maxFileSize** (数字): 最大文件大小限制（字节），默认 10MB
- **enableWrite** (布尔): 是否启用写入操作，默认启用
- **enableDelete** (布尔): 是否启用删除操作，默认禁用
- **searchDepthLimit** (数字): 搜索深度限制，默认 10 层

## 使用示例

### 列出目录

```javascript
// 列出当前目录（基本用法）
{
  "tool": "list-directory",
  "arguments": {
    "dirPath": ".",
    "showHidden": false,
    "recursive": false
  }
}

// 递归列出子目录
{
  "tool": "list-directory", 
  "arguments": {
    "dirPath": "./src",
    "showHidden": true,
    "recursive": true
  }
}
```

### 读取文件

```javascript
// 读取文本文件
{
  "tool": "read-file",
  "arguments": {
    "filePath": "./package.json",
    "encoding": "utf8"
  }
}
```

### 写入文件

```javascript
// 写入文件（自动创建目录）
{
  "tool": "write-file",
  "arguments": {
    "filePath": "./output/result.txt",
    "content": "Hello, World!",
    "encoding": "utf8",
    "createDirectories": true
  }
}
```

### 搜索文件

```javascript
// 按文件名模式搜索
{
  "tool": "search-files",
  "arguments": {
    "directory": "./src",
    "pattern": "*.ts",
    "maxDepth": 5
  }
}

// 按内容搜索
{
  "tool": "search-files",
  "arguments": {
    "directory": "./",
    "pattern": "*.js",
    "content": "import",
    "maxDepth": 3
  }
}
```

### 文件操作

```javascript
// 复制文件
{
  "tool": "copy-file",
  "arguments": {
    "source": "./source.txt",
    "destination": "./backup/source.txt",
    "overwrite": false
  }
}

// 移动/重命名文件
{
  "tool": "move-file",
  "arguments": {
    "source": "./old-name.txt", 
    "destination": "./new-name.txt",
    "overwrite": false
  }
}

// 获取文件详细信息
{
  "tool": "get-file-stats",
  "arguments": {
    "filePath": "./important-file.txt"
  }
}

// 创建目录
{
  "tool": "create-directory",
  "arguments": {
    "dirPath": "./new/nested/directory",
    "recursive": true
  }
}
```

## API 文档

### 工具详细说明

#### list-directory
列出指定目录下的文件和子目录。

**参数:**
- `dirPath` (string, 默认: ".") - 要列出的目录路径
- `showHidden` (boolean, 默认: false) - 是否显示隐藏文件
- `recursive` (boolean, 默认: false) - 是否递归列出子目录

**返回:**
文件和目录的详细信息数组，包含名称、路径、类型、大小、修改时间、权限等。

#### read-file
读取文件内容。

**参数:**
- `filePath` (string) - 要读取的文件路径
- `encoding` (string, 默认: "utf8") - 文件编码格式

**返回:**
包含文件内容、路径、大小、修改时间、编码等信息的对象。

#### write-file
写入内容到文件。

**参数:**
- `filePath` (string) - 要写入的文件路径
- `content` (string) - 文件内容
- `encoding` (string, 默认: "utf8") - 文件编码格式  
- `createDirectories` (boolean, 默认: true) - 是否自动创建目录

**返回:**
写入成功的确认信息，包含文件路径、大小、修改时间等。

#### create-directory
创建目录。

**参数:**
- `dirPath` (string) - 要创建的目录路径
- `recursive` (boolean, 默认: true) - 是否递归创建父目录

#### delete-file
删除文件。

**参数:**
- `filePath` (string) - 要删除的文件路径

#### delete-directory
删除目录。

**参数:**
- `dirPath` (string) - 要删除的目录路径
- `recursive` (boolean, 默认: false) - 是否递归删除目录内容

#### copy-file
复制文件。

**参数:**
- `source` (string) - 源文件路径
- `destination` (string) - 目标文件路径
- `overwrite` (boolean, 默认: false) - 是否覆盖已存在的文件

#### move-file
移动或重命名文件。

**参数:**
- `source` (string) - 源文件路径
- `destination` (string) - 目标文件路径
- `overwrite` (boolean, 默认: false) - 是否覆盖已存在的文件

#### get-file-stats
获取文件或目录的详细信息。

**参数:**
- `filePath` (string) - 文件或目录路径

**返回:**
包含路径、类型、大小、时间戳、权限等详细信息。

#### search-files
搜索文件。

**参数:**
- `directory` (string) - 搜索的根目录
- `pattern` (string) - 文件名匹配模式（支持 * 和 ? 通配符）
- `content` (string, 可选) - 文件内容搜索关键词
- `maxDepth` (number, 默认: 10) - 最大搜索深度

**返回:**
匹配的文件列表，包含路径、大小、修改时间等信息。

### 资源访问

#### 插件信息
```
filesystem://info
```
返回插件的基本信息和状态。

#### 文件内容资源
```
filesystem://file/{path}
```
通过 URI 模板访问文件内容，其中 `{path}` 是编码后的文件路径。

## 安全注意事项

1. **路径验证**: 插件会验证文件路径，防止路径遍历攻击
2. **权限控制**: 可通过配置限制访问目录和禁用危险操作
3. **文件大小限制**: 防止读取过大文件导致内存溢出
4. **删除保护**: 默认禁用删除操作，需要显式启用

## 测试

⚠️ **重要**: 该插件遵循 MCP 协议，不会向 stdout 输出任何内容以避免污染 JSON-RPC 通信。

运行安全测试脚本（仅用于开发环境）：

```bash
node test-plugin-safe.js
```

测试将验证所有功能的正确性，包括：
- 插件加载和服务实例化
- 工具和资源注册
- 文件读写操作
- 目录操作
- 搜索功能
- 错误处理

**注意**: 
- `test-plugin-safe.js` 检测 MCP 环境并在该环境下静默运行
- 原始 `test-plugin.js` 包含 console.log 输出，仅用于独立调试
- 在 MCP 服务器环境中，所有日志输出都已移除

## 开发

### 项目结构

```
sker-mcp-filesystem/
├── package.json          # 项目配置和依赖
├── tsconfig.json         # TypeScript 配置
├── src/
│   └── index.ts          # 主要实现文件（TypeScript）
├── dist/                 # 编译后的文件
│   ├── index.js          # 编译后的 JavaScript
│   └── index.d.ts        # 类型定义文件
├── README.md             # 项目文档
└── plugin.md             # Sker MCP 开发手册
```

### 核心实现

插件使用现代 TypeScript 技术栈：

- **依赖注入**: `@Injectable({providedIn: 'auto'})` 自动服务注册
- **装饰器模式**: `@Tool` 和 `@Resource` 装饰器声明功能
- **类型安全**: Zod schema 验证和 `@Input` 装饰器
- **错误处理**: 统一的错误处理和返回格式

### 添加新功能

要扩展插件功能：

1. 在 `FileSystemService` 类中添加新方法
2. 使用 `@Tool` 装饰器注册工具
3. 用 `@Input` 装饰器定义参数和验证
4. 实现业务逻辑和错误处理
5. 更新文档

示例：
```typescript
@Tool({
  name: 'my-new-tool',
  description: '新工具描述'
})
async myNewTool(
  @Input(z.string().describe('参数描述')) param: string
) {
  try {
    // 业务逻辑
    return {
      content: [{
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: 'text',
        text: `错误: ${(error as Error).message}`
      }],
      isError: true
    };
  }
}
```

### 构建和测试

```bash
# 开发环境构建
pnpm run dev    # 监视模式编译

# 生产环境构建  
pnpm run build

# 清理构建文件
pnpm run clean
```

### 贡献指南

1. Fork 这个仓库
2. 创建特性分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送到分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

欢迎提交 Issue 和 Pull Request 来改进这个插件。

## 许可证

MIT License

## 版本历史

### v1.0.0
- 初始版本
- 实现基本的文件系统操作功能
- 支持文件读写、目录操作、搜索等功能
- 完整的测试套件和文档

## 支持的文件类型

插件支持多种文件类型的 MIME 类型识别：

- 文本文件: .txt, .md, .log
- 代码文件: .js, .ts, .jsx, .tsx, .py, .java, .cpp, .go, .rs, .php, .rb
- 配置文件: .json, .xml, .yml, .yaml
- Web 文件: .html, .css
- 脚本文件: .sh, .bat, .ps1
- 数据库文件: .sql

## 故障排除

### 常见问题

1. **权限错误**: 确保插件有足够的文件系统权限
2. **路径不存在**: 检查文件路径是否正确
3. **编码问题**: 尝试使用不同的编码格式
4. **大文件处理**: 检查文件大小是否超过配置限制

### 调试

⚠️ **MCP 兼容性**: 此插件不使用 console.log 或任何 stdout 输出，以确保与 MCP 协议兼容。

启用详细日志（通过 Sker 系统）：

```bash
DEBUG=sker:plugin:filesystem sker start
```

**开发调试提示**:
- 使用 `test-plugin-safe.js` 进行本地测试
- 在 MCP 环境中，错误通过 MCP 协议返回，而非 console 输出
- 生产环境中避免任何直接的 stdout/stderr 输出

### 配置建议

对于生产环境：
- 设置 `allowedDirectories` 限制访问范围
- 禁用 `enableDelete` 防止误删除
- 调整 `maxFileSize` 根据实际需求
- 设置合理的 `searchDepthLimit` 避免深度搜索

## 更多信息

- [Sker MCP 官方文档](https://docs.sker.dev)
- [MCP 协议规范](https://modelcontextprotocol.io)
- [插件开发指南](./plugin.md)