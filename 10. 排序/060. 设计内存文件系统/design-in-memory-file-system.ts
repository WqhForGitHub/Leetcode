// ============================================================
// 060. 设计内存文件系统
// ============================================================
// LeetCode 588. Design In-Memory File System
// 设计一个内存文件系统，支持：
//   - ls(path): 若是文件，返回只含该文件名的列表；若是目录，返回所有文件/子目录名（按字典序）。
//   - mkdir(path): 创建目录（路径可能多级，需要递归创建）。
//   - addContentToFile(filePath, content): 向文件追加内容，文件不存在则创建。
//   - readContentFromFile(filePath): 返回文件内容。

// 方法1：类 Trie 树结构（Map 存子节点）（推荐）
// 节点分两类：目录（含 children Map）与文件（含 content 字符串）。
// 文件也可以有 children（用于 ls 时判断类型），保持结构统一。

class FSNode {
  isFile: boolean;
  content: string;
  children: Map<string, FSNode>;

  constructor() {
    this.isFile = false;
    this.content = "";
    this.children = new Map();
  }
}

class FileSystem {
  private root: FSNode;

  constructor() {
    this.root = new FSNode();
  }

  /** 沿路径找到目标节点（不创建），返回 null 表示路径不存在 */
  private navigate(path: string): FSNode | null {
    if (path === "/") return this.root;
    const parts = path.split("/").filter((p) => p.length > 0);
    let curr = this.root;
    for (const part of parts) {
      const next = curr.children.get(part);
      if (!next) return null;
      curr = next;
    }
    return curr;
  }

  /** 沿路径找到或创建中间目录节点，返回最终节点 */
  private navigateOrCreate(path: string): FSNode {
    const parts = path.split("/").filter((p) => p.length > 0);
    let curr = this.root;
    for (const part of parts) {
      if (!curr.children.has(part)) {
        curr.children.set(part, new FSNode());
      }
      curr = curr.children.get(part)!;
    }
    return curr;
  }

  ls(path: string): string[] {
    const node = this.navigate(path);
    if (node === null) return [];
    if (node.isFile) {
      // 文件：返回只含文件名的列表
      const parts = path.split("/").filter((p) => p.length > 0);
      return [parts[parts.length - 1]];
    }
    // 目录：返回所有子节点名并按字典序排序
    return Array.from(node.children.keys()).sort();
  }

  mkdir(path: string): void {
    this.navigateOrCreate(path);
  }

  addContentToFile(filePath: string, content: string): void {
    const node = this.navigateOrCreate(filePath);
    node.isFile = true;
    node.content += content;
  }

  readContentFromFile(filePath: string): string {
    const node = this.navigate(filePath);
    return node !== null ? node.content : "";
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 060. 设计内存文件系统 =====");

const fs = new FileSystem();
console.log("ls('/'):", JSON.stringify(fs.ls("/"))); // 期望 []
fs.mkdir("/a/b/c");
fs.addContentToFile("/a/b/c/d", "hello");
console.log("ls('/a/b'):", JSON.stringify(fs.ls("/a/b"))); // 期望 ["c"]
console.log("ls('/a/b/c/d'):", JSON.stringify(fs.ls("/a/b/c/d"))); // 期望 ["d"]
console.log("readContent('/a/b/c/d'):", JSON.stringify(fs.readContentFromFile("/a/b/c/d"))); // 期望 "hello"
fs.addContentToFile("/a/b/c/d", " world");
console.log("readContent after append:", JSON.stringify(fs.readContentFromFile("/a/b/c/d"))); // 期望 "hello world"
fs.mkdir("/a/b/e");
console.log("ls('/a/b') after mkdir e:", JSON.stringify(fs.ls("/a/b"))); // 期望 ["c","e"]

export {};
