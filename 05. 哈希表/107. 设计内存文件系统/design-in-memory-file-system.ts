// ============================================================
// 107. 设计内存文件系统
// ============================================================
// LeetCode 588. Design In-Memory File System
// 设计一个内存文件系统，支持 ls、mkdir、addContentToFile、readContentFromFile。
// 时间复杂度：ls/mkdir O(m)，m 为路径长度；读写文件 O(L)，L 为内容长度

class FileSystem {
  // 文件系统节点：目录用 Map 存子节点，文件用 content 存内容
  private root: Dir;

  constructor() {
    this.root = new Dir();
  }

  // 路径解析：将 "/a/b/c" 拆分为 ["a", "b", "c"]
  private parsePath(path: string): string[] {
    if (path === "/") return [];
    return path.slice(1).split("/");
  }

  // ls：若为文件返回 [文件名]；若为目录返回排序后的子项
  ls(path: string): string[] {
    const parts = this.parsePath(path);
    let cur: Dir | File = this.root;
    for (const name of parts) {
      // 目录中查找子节点
      cur = (cur as Dir).children.get(name)!;
    }
    if (cur instanceof Dir) {
      // 目录：返回排序后的所有子项
      return Array.from(cur.children.keys()).sort();
    } else {
      // 文件：返回文件名
      return [parts[parts.length - 1]];
    }
  }

  // mkdir：创建目录（含中间目录）
  mkdir(path: string): void {
    const parts = this.parsePath(path);
    let cur = this.root;
    for (const name of parts) {
      if (!cur.children.has(name)) {
        cur.children.set(name, new Dir());
      }
      cur = cur.children.get(name) as Dir;
    }
  }

  // addContentToFile：向文件追加内容，文件不存在则创建
  addContentToFile(filePath: string, content: string): void {
    const parts = this.parsePath(filePath);
    let cur = this.root;
    // 先定位到父目录
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur.children.get(parts[i]) as Dir;
    }
    const fileName = parts[parts.length - 1];
    if (!cur.children.has(fileName)) {
      cur.children.set(fileName, new File(""));
    }
    const file = cur.children.get(fileName) as File;
    file.content += content;
  }

  // readContentFromFile：读取文件内容
  readContentFromFile(filePath: string): string {
    const parts = this.parsePath(filePath);
    let cur: Dir | File = this.root;
    for (const name of parts) {
      cur = (cur as Dir).children.get(name)!;
    }
    return (cur as File).content;
  }
}

// 目录节点
class Dir {
  children = new Map<string, Dir | File>();
}

// 文件节点
class File {
  constructor(public content: string) {}
}

// ============================================================
// 测试
// ============================================================
console.log("===== 107. 设计内存文件系统 =====");
const fs = new FileSystem();
console.log(fs.ls("/")); // 期望: []
fs.mkdir("/a/b/c");
fs.mkdir("/a/b/d");
console.log(fs.ls("/a/b")); // 期望: ["c", "d"]
fs.addContentToFile("/a/b/c/file", "hello");
console.log(fs.readContentFromFile("/a/b/c/file")); // 期望: "hello"
fs.addContentToFile("/a/b/c/file", " world");
console.log(fs.readContentFromFile("/a/b/c/file")); // 期望: "hello world"
console.log(fs.ls("/a/b/c")); // 期望: ["file"]

export {};
