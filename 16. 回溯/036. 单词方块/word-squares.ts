// ============================================================
// 036. 单词方块
// ============================================================
// LeetCode 425. Word Squares
// 给定一组不重复等长单词，构建单词方块：第i行等于第i列。返回所有单词方块。
// 时间复杂度：O(N * L * 26^L), 空间复杂度：O(N * L)

// Trie节点定义
class TrieNode {
  children: Map<string, TrieNode>;
  word: string | null;

  constructor() {
    this.children = new Map<string, TrieNode>();
    this.word = null;
  }
}

// 方法1：回溯+Trie前缀搜索 (推荐)
// 构建Trie，回溯构建每一行。第i行的前i个字符由前i行的第i列确定。
// 时间复杂度 O(N * L * 26^L), 空间复杂度 O(N * L)
function wordSquares(words: string[]): string[][] {
  const n: number = words[0].length;
  const root: TrieNode = new TrieNode();

  // 构建Trie
  for (const word of words) {
    let node: TrieNode = root;
    for (const ch of word) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch)!;
    }
    node.word = word;
  }

  // 在Trie中搜索所有以prefix开头的单词
  function searchWithPrefix(prefix: string): string[] {
    let node: TrieNode = root;
    for (const ch of prefix) {
      if (!node.children.has(ch)) return [];
      node = node.children.get(ch)!;
    }
    const result: string[] = [];
    // DFS收集所有以当前节点为根的单词
    function dfs(node: TrieNode): void {
      if (node.word !== null) {
        result.push(node.word);
      }
      for (const child of node.children.values()) {
        dfs(child);
      }
    }
    dfs(node);
    return result;
  }

  const result: string[][] = [];
  const square: string[] = [];

  // 回溯构建单词方块
  function backtrack(): void {
    if (square.length === n) {
      result.push([...square]);
      return;
    }

    // 构建第square.length行的前缀：前square.length行的第square.length列
    let prefix: string = "";
    for (let i: number = 0; i < square.length; i++) {
      prefix += square[i][square.length];
    }

    // 搜索所有匹配前缀的单词
    const candidates: string[] = searchWithPrefix(prefix);
    for (const word of candidates) {
      square.push(word);
      backtrack();
      square.pop();
    }
  }

  // 从每个单词开始构建
  for (const word of words) {
    square.push(word);
    backtrack();
    square.pop();
  }

  return result;
}

// 方法2：回溯+前缀哈希表
// 用哈希表存储前缀到单词列表的映射，替代Trie
// 时间复杂度 O(N * L * 26^L), 空间复杂度 O(N * L)
function wordSquares2(words: string[]): string[][] {
  const n: number = words[0].length;

  // 构建前缀到单词列表的映射
  const prefixMap: Map<string, string[]> = new Map();
  for (const word of words) {
    for (let i: number = 0; i <= n; i++) {
      const prefix: string = word.substring(0, i);
      if (!prefixMap.has(prefix)) {
        prefixMap.set(prefix, []);
      }
      prefixMap.get(prefix)!.push(word);
    }
  }

  const result: string[][] = [];
  const square: string[] = [];

  function backtrack(): void {
    if (square.length === n) {
      result.push([...square]);
      return;
    }

    // 构建前缀
    let prefix: string = "";
    for (let i: number = 0; i < square.length; i++) {
      prefix += square[i][square.length];
    }

    // 从哈希表获取匹配的单词
    const candidates: string[] = prefixMap.get(prefix) || [];
    for (const word of candidates) {
      square.push(word);
      backtrack();
      square.pop();
    }
  }

  for (const word of words) {
    square.push(word);
    backtrack();
    square.pop();
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 036. 单词方块 =====");
console.log(wordSquares(["area", "lead", "wall", "lady", "ball"]));
// 期望结果: [["wall","area","lead","lady"],["ball","area","lead","lady"]]
console.log(wordSquares2(["area", "lead", "wall", "lady", "ball"]));
// 期望结果: 同上
console.log(wordSquares(["ab", "ba"]));
// 期望结果: [["ab","ba"],["ba","ab"]]

export {};
