// ============================================================
// Trie 字典树面试题 - TypeScript 解题合集
// ============================================================

// -------------------- Trie 节点定义 --------------------
class TrieNode {
  children: Map<string, TrieNode>;
  isEnd: boolean;

  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

// -------------------- 01 Trie 节点定义（二进制） --------------------
class BitTrieNode {
  children: (BitTrieNode | null)[]; // children[0] 和 children[1]

  constructor() {
    this.children = [null, null];
  }
}

// ============================================================
// 1. 字符串集合维护
// LeetCode 208. Implement Trie (Prefix Tree)
// 核心思路：用树形结构高效存储和检索字符串集合，支持插入、查找、前缀查找
// 时间复杂度：插入/查找 O(L)，L 为字符串长度
// 空间复杂度：O(N * L)，N 为字符串数量，L 为平均长度
// ============================================================

// 方法1：标准 Trie 实现（推荐）- Map 存储子节点
class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  // 插入字符串
  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEnd = true;
  }

  // 查找完整字符串
  search(word: string): boolean {
    const node = this.searchNode(word);
    return node !== null && node.isEnd;
  }

  // 查找是否有以 prefix 为前缀的字符串
  startsWith(prefix: string): boolean {
    return this.searchNode(prefix) !== null;
  }

  // 辅助：沿路径查找节点
  private searchNode(word: string): TrieNode | null {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char)!;
    }
    return node;
  }
}

// 方法2：数组存储子节点（仅限小写字母 a-z）
class TrieArray {
  private root: TrieNodeArray;

  constructor() {
    this.root = new TrieNodeArray();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      const idx = char.charCodeAt(0) - 97; // 'a' = 97
      if (!node.children[idx]) {
        node.children[idx] = new TrieNodeArray();
      }
      node = node.children[idx]!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    const node = this.searchNode(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.searchNode(prefix) !== null;
  }

  private searchNode(word: string): TrieNodeArray | null {
    let node = this.root;
    for (const char of word) {
      const idx = char.charCodeAt(0) - 97;
      if (!node.children[idx]) return null;
      node = node.children[idx]!;
    }
    return node;
  }
}

class TrieNodeArray {
  children: (TrieNodeArray | null)[];
  isEnd: boolean;

  constructor() {
    this.children = new Array(26).fill(null);
    this.isEnd = false;
  }
}

// 方法3：删除操作扩展 — 支持从 Trie 中删除单词
class TrieWithDelete {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.isEnd = true;
  }

  search(word: string): boolean {
    const node = this.searchNode(word);
    return node !== null && node.isEnd;
  }

  startsWith(prefix: string): boolean {
    return this.searchNode(prefix) !== null;
  }

  // 删除单词：先找到末尾节点，自底向上回溯删除不再需要的节点
  delete(word: string): boolean {
    return this.deleteHelper(this.root, word, 0);
  }

  private deleteHelper(node: TrieNode, word: string, depth: number): boolean {
    if (depth === word.length) {
      if (!node.isEnd) return false; // 单词不存在
      node.isEnd = false;
      // 如果该节点没有子节点，可以安全删除
      return node.children.size === 0;
    }

    const char = word[depth];
    const child = node.children.get(char);
    if (!child) return false; // 单词不存在

    const shouldDeleteChild = this.deleteHelper(child, word, depth + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);
      // 当前节点也可删除的条件：不是单词结尾且无其他子节点
      return node.children.size === 0 && !node.isEnd;
    }

    return false;
  }

  private searchNode(word: string): TrieNode | null {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char)!;
    }
    return node;
  }
}

// ============================================================
// 2. 最大异或对
// AcWing 143. 最大异或对 / LeetCode 421. Maximum XOR of Two Numbers in an Array
// 核心思路：将每个数按二进制位插入 01 Trie，查询时尽量走相反位以最大化异或值
// 时间复杂度：O(n * B)，n 为数组长度，B 为位数（31）
// 空间复杂度：O(n * B)
// ============================================================

// 方法1：01 Trie（推荐）- 从高位到低位逐位插入和查询
function findMaximumXOR(nums: number[]): number {
  if (nums.length < 2) return 0;

  const root = new BitTrieNode();
  let maxXOR = 0;

  // 将 num 的每一位插入 01 Trie（从最高位到最低位）
  const insert = (num: number): void => {
    let node = root;
    for (let i = 30; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!node.children[bit]) {
        node.children[bit] = new BitTrieNode();
      }
      node = node.children[bit]!;
    }
  };

  // 查询与 num 异或值最大的数
  const query = (num: number): number => {
    let node = root;
    let xorVal = 0;
    for (let i = 30; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const oppositeBit = 1 - bit; // 尽量走相反方向
      if (node.children[oppositeBit]) {
        xorVal = (xorVal << 1) | 1; // 该位异或结果为 1
        node = node.children[oppositeBit]!;
      } else {
        xorVal = xorVal << 1; // 该位异或结果为 0
        node = node.children[bit]!;
      }
    }
    return xorVal;
  };

  // 先插入第一个数，然后逐个查询并插入
  insert(nums[0]);
  for (let i = 1; i < nums.length; i++) {
    maxXOR = Math.max(maxXOR, query(nums[i]));
    insert(nums[i]);
  }

  return maxXOR;
}

// 方法2：01 Trie + 先全部插入再查询
function findMaximumXORAllInsert(nums: number[]): number {
  if (nums.length < 2) return 0;

  const root = new BitTrieNode();

  const insert = (num: number): void => {
    let node = root;
    for (let i = 30; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!node.children[bit]) {
        node.children[bit] = new BitTrieNode();
      }
      node = node.children[bit]!;
    }
  };

  const query = (num: number): number => {
    let node = root;
    let xorVal = 0;
    for (let i = 30; i >= 0; i--) {
      const bit = (num >> i) & 1;
      const oppositeBit = 1 - bit;
      if (node.children[oppositeBit]) {
        xorVal = (xorVal << 1) | 1;
        node = node.children[oppositeBit]!;
      } else {
        xorVal = xorVal << 1;
        node = node.children[bit]!;
      }
    }
    return xorVal;
  };

  // 全部插入
  for (const num of nums) {
    insert(num);
  }

  // 逐个查询最大异或值
  let maxXOR = 0;
  for (const num of nums) {
    maxXOR = Math.max(maxXOR, query(num));
  }

  return maxXOR;
}

// 方法3：位运算 + 哈希集合贪心 — 逐位确定最大异或值的每一位
function findMaximumXORBitwise(nums: number[]): number {
  let maxXOR = 0;
  let mask = 0;

  // 从最高位到最低位，逐位尝试置 1
  for (let i = 30; i >= 0; i--) {
    mask = mask | (1 << i);
    const prefixes = new Set<number>();

    // 收集所有数的高位前缀
    for (const num of nums) {
      prefixes.add(num & mask);
    }

    // 尝试在当前位置 1
    const candidate = maxXOR | (1 << i);

    // 检查是否存在两个前缀异或等于 candidate
    for (const prefix of prefixes) {
      if (prefixes.has(prefix ^ candidate)) {
        maxXOR = candidate;
        break;
      }
    }
  }

  return maxXOR;
}

// 方法4：暴力枚举 — O(n^2)，仅作对比
function findMaximumXORBruteForce(nums: number[]): number {
  let maxXOR = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      maxXOR = Math.max(maxXOR, nums[i] ^ nums[j]);
    }
  }
  return maxXOR;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 字符串集合维护（Trie） =====");

// 方法1：标准 Trie
const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple")); // true
console.log(trie.search("app")); // false
console.log(trie.startsWith("app")); // true
trie.insert("app");
console.log(trie.search("app")); // true

// 方法2：数组 Trie
const trieArr = new TrieArray();
trieArr.insert("hello");
trieArr.insert("world");
console.log(trieArr.search("hello")); // true
console.log(trieArr.search("hell")); // false
console.log(trieArr.startsWith("hell")); // true
console.log(trieArr.search("world")); // true

// 方法3：带删除的 Trie
const trieDel = new TrieWithDelete();
trieDel.insert("abc");
trieDel.insert("ab");
trieDel.insert("abcd");
console.log(trieDel.search("abc")); // true
console.log(trieDel.search("ab")); // true
trieDel.delete("abc");
console.log(trieDel.search("abc")); // false
console.log(trieDel.search("ab")); // true（"ab" 不受影响）
console.log(trieDel.search("abcd")); // true（"abcd" 不受影响）
trieDel.delete("ab");
console.log(trieDel.search("ab")); // false
console.log(trieDel.startsWith("ab")); // true（"abcd" 仍以 "ab" 为前缀）

console.log("\n===== 2. 最大异或对 =====");
console.log(findMaximumXOR([3, 10, 5, 25, 2, 8])); // 28（25 ^ 5 = 28）
console.log(findMaximumXOR([0])); // 0
console.log(findMaximumXOR([2, 4])); // 6（2 ^ 4 = 6）
console.log(findMaximumXOR([8, 10, 2])); // 10（8 ^ 2 = 10）

console.log(findMaximumXORAllInsert([3, 10, 5, 25, 2, 8])); // 28
console.log(findMaximumXORBitwise([3, 10, 5, 25, 2, 8])); // 28
console.log(findMaximumXORBruteForce([3, 10, 5, 25, 2, 8])); // 28

export {};
