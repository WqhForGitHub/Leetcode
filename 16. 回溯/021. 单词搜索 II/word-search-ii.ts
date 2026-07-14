// ============================================================
// 021. 单词搜索 II
// ============================================================
// LeetCode 212. Word Search II
// 给定 m×n 字符网格和单词列表，找出所有在网格中出现的单词。单词由相邻格子组成（上下左右），不能重复使用格子。
// 时间复杂度：O(M * N * 4^L)，M×N 为网格大小，L 为最长单词长度，空间复杂度：O(W * L) Trie 大小

// Trie 节点定义
class TrieNode {
  children: Map<string, TrieNode>;
  word: string | null;

  constructor() {
    this.children = new Map();
    this.word = null; // 如果是单词结尾，存储完整单词
  }
}

// 方法1：Trie + DFS 回溯 (推荐)
// 将所有单词插入 Trie，然后从每个格子出发进行 DFS，沿 Trie 匹配
// 时间复杂度 O(M * N * 4^L), 空间复杂度 O(W * L)
function findWords(board: string[][], words: string[]): string[] {
  // 构建 Trie
  const root: TrieNode = new TrieNode();
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

  const result: string[] = [];
  const rows: number = board.length;
  const cols: number = board[0].length;
  const directions: number[][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  function dfs(row: number, col: number, node: TrieNode): void {
    // 越界检查
    if (row < 0 || row >= rows || col < 0 || col >= cols) return;

    const ch: string = board[row][col];
    // 如果当前字符不在 Trie 中，直接返回
    if (!node.children.has(ch)) return;

    const nextNode: TrieNode = node.children.get(ch)!;

    // 如果找到一个完整单词，加入结果
    if (nextNode.word !== null) {
      result.push(nextNode.word);
      nextNode.word = null; // 避免重复添加
    }

    // 标记已访问
    board[row][col] = "#";

    // 向四个方向搜索
    for (const [dr, dc] of directions) {
      dfs(row + dr, col + dc, nextNode);
    }

    // 恢复
    board[row][col] = ch;

    // 剪枝：如果 nextNode 是叶子节点，从 Trie 中移除以加速后续搜索
    if (nextNode.children.size === 0) {
      node.children.delete(ch);
    }
  }

  // 从每个格子出发搜索
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dfs(i, j, root);
    }
  }

  return result;
}

// 方法2：逐词搜索（朴素）
// 对每个单词，在网格中进行 DFS 搜索
// 时间复杂度 O(W * M * N * 4^L), 空间复杂度 O(L) 递归栈
function findWords2(board: string[][], words: string[]): string[] {
  const result: string[] = [];
  const rows: number = board.length;
  const cols: number = board[0].length;
  const directions: number[][] = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  // 搜索单个单词是否在网格中
  function exist(word: string): boolean {
    function dfs(row: number, col: number, index: number): boolean {
      if (index === word.length) return true;
      if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
      if (board[row][col] !== word[index]) return false;

      const temp: string = board[row][col];
      board[row][col] = "#";

      for (const [dr, dc] of directions) {
        if (dfs(row + dr, col + dc, index + 1)) {
          board[row][col] = temp;
          return true;
        }
      }

      board[row][col] = temp;
      return false;
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (board[i][j] === word[0] && dfs(i, j, 0)) {
          return true;
        }
      }
    }
    return false;
  }

  // 去重后逐个搜索
  const uniqueWords: string[] = [...new Set(words)];
  for (const word of uniqueWords) {
    if (exist(word)) {
      result.push(word);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 单词搜索 II =====");
const board1: string[][] = [
  ["o", "a", "a", "n"],
  ["e", "t", "a", "e"],
  ["i", "h", "k", "r"],
  ["i", "f", "l", "v"],
];
console.log(findWords(board1, ["oath", "pea", "eat", "rain"])); // 期望结果: ["eat","oath"]
console.log(findWords2(board1, ["oath", "pea", "eat", "rain"])); // 期望结果: ["eat","oath"]

const board2: string[][] = [
  ["a", "b"],
  ["c", "d"],
];
console.log(findWords(board2, ["abdc"])); // 期望结果: ["abdc"]
console.log(findWords2(board2, ["abdc"])); // 期望结果: ["abdc"]

export {};
