# Sker MCP 文件系统插件

一个功能全面的 Sker MCP 文件系统插件，提供文件和目录操作的完整功能集。

## 功能特性

### 🛠️ 工具 (Tools)

- **list-directory** - 列出目录内容，支持递归和隐藏文件显示
- **read-file** - 读取文件内容，支持多种编码格式
- **write-file** - 写入文件内容，支持自动创建目录
- **create-directory** - 创建目录，支持递归创建
- **delete-file** - 删除文件
- **delete-directory** - 删除目录，支持递归删除
- **copy-file** - 复制文件，支持覆盖控制
- **move-file** - 移动或重命名文件
- **get-file-stats** - 获取文件或目录的详细信息
- **search-files** - 搜索文件，支持文件名模式和内容搜索

### 📄 资源 (Resources)

- **filesystem://info** - 插件信息和状态
- **filesystem://file/{path}** - 通过路径访问文件内容的模板资源

## 安装

1. 将插件文件放置在 Sker MCP 插件目录中：
```bash
cp -r sker-mcp-filesystem ~/.sker/plugins/
```

2. 或者使用 Sker CLI 安装：
```bash
sker plugin install ./sker-mcp-filesystem
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
// 列出当前目录
{
  "tool": "list-directory",
  "arguments": {
    "path": ".",
    "showHidden": false,
    "recursive": false
  }
}
```

### 读取文件

```javascript
// 读取文件内容
{
  "tool": "read-file",
  "arguments": {
    "path": "./package.json",
    "encoding": "utf8"
  }
}
```

### 写入文件

```javascript
// 写入文件
{
  "tool": "write-file",
  "arguments": {
    "path": "./output.txt",
    "content": "Hello, World!",
    "encoding": "utf8",
    "createDirectories": true
  }
}
```

### 搜索文件

```javascript
// 搜索所有 .js 文件
{
  "tool": "search-files",
  "arguments": {
    "directory": "./src",
    "pattern": "*.js",
    "maxDepth": 5
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

// 移动文件
{
  "tool": "move-file",
  "arguments": {
    "source": "./old-name.txt",
    "destination": "./new-name.txt",
    "overwrite": false
  }
}

// 获取文件信息
{
  "tool": "get-file-stats",
  "arguments": {
    "path": "./important-file.txt"
  }
}
```

## API 文档

### 工具详细说明

#### list-directory
列出指定目录下的文件和子目录。

**参数:**
- `path` (string) - 要列出的目录路径
- `showHidden` (boolean, 默认: false) - 是否显示隐藏文件
- `recursive` (boolean, 默认: false) - 是否递归列出子目录

**返回:**
文件和目录的详细信息数组，包含名称、路径、类型、大小、修改时间等。

#### read-file
读取文件内容。

**参数:**
- `path` (string) - 要读取的文件路径
- `encoding` (string, 默认: "utf8") - 文件编码格式

**返回:**
包含文件内容、大小、修改时间等信息的对象。

#### write-file
写入内容到文件。

**参数:**
- `path` (string) - 要写入的文件路径
- `content` (string) - 文件内容
- `encoding` (string, 默认: "utf8") - 文件编码格式
- `createDirectories` (boolean, 默认: true) - 是否自动创建目录

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

### 目录结构

```
sker-mcp-filesystem/
├── package.json          # 插件配置
├── index.js              # 插件主文件（MCP 兼容，无 stdout 输出）
├── test-plugin.js        # 原始测试脚本（含 console.log）
├── test-plugin-safe.js   # 安全测试脚本（MCP 兼容）
├── README.md             # 说明文档
└── plugin.md             # Sker MCP 开发手册
```

### 扩展功能

要添加新功能，请在 `FileSystemService` 类中：

1. 在 `getTools()` 方法中注册新工具
2. 实现对应的处理方法
3. 添加适当的输入验证和错误处理
4. 更新测试脚本

### 贡献

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