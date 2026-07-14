// ============================================================
// 034. 实现 Trie (前缀树)
// ============================================================
// LeetCode 208. Implement Trie (Prefix Tree)
// 实现前缀树的 insert/search/startsWith。Trie 节点用 Map 存子节点。
// 时间复杂度：insert O(m)，search O(m)，startsWith O(m)，m 为字符串长度
// 空间复杂度：O(字符集大小 * 节点数)

/**
 * Trie 节点定义
 * 使用 Map 存储子节点，isEnd 标记是否为单词结尾
 */
class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEnd: boolean = false;
}

/**
 * 前缀树实现
 */
class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /** 插入一个单词到 Trie 中 */
  insert(word: string): void {
    let node = this.root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch)!;
    }
    node.isEnd = true;
  }

  /** 搜索完整单词是否存在于 Trie 中 */
  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEnd;
  }

  /** 判断是否存在以 prefix 为前缀的单词 */
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  /** 辅助方法：根据给定字符串找到对应节点 */
  private findNode(str: string): TrieNode | null {
    let node = this.root;
    for (const ch of str) {
      if (!node.children.has(ch)) {
        return null;
      }
      node = node.children.get(ch)!;
    }
    return node;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 034. 实现 Trie (前缀树) =====");
// 测试 1: 基本插入与搜索
const trie1 = new Trie();
trie1.insert("apple");
console.log(trie1.search("apple")); // 期望输出: true
console.log(trie1.search("app")); // 期望输出: false
console.log(trie1.startsWith("app")); // 期望输出: true

// 测试 2: 插入前缀后搜索
trie1.insert("app");
console.log(trie1.search("app")); // 期望输出: true

// 测试 3: 空前缀
const trie2 = new Trie();
console.log(trie2.startsWith("")); // 期望输出: true
console.log(trie2.search("")); // 期望输出: false

// 测试 4: 多个单词
const trie3 = new Trie();
trie3.insert("banana");
trie3.insert("band");
trie3.insert("bandana");
console.log(trie3.search("band")); // 期望输出: true
console.log(trie3.search("ban")); // 期望输出: false
console.log(trie3.startsWith("ban")); // 期望输出: true

export {};
