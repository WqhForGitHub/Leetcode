// ============================================================
// 139. 单词矩阵
// ============================================================
// 面试金典 CCI 17.25. 单词矩阵
// 给定一组单词，找出最大的 k×k 单词方阵：第 i 行与第 i 列相同，
// 且所有行和列都是字典中的有效单词。返回该方阵或空数组。
// 时间复杂度：O(N * L * k), 空间复杂度：O(N*L)，N 单词数，L 单词长度

// 方法1：回溯+Trie(按行填充) (推荐)
// 关键性质：若每行单词的前缀满足对称约束（行 i 的前 i 个字符等于
// 各已放置行第 i 列字符拼接），则列自动等于对应行，必为有效单词。
// 用 Trie 快速查询某前缀的所有单词，按行回溯。
// 时间复杂度 O(N*L*k), 空间复杂度 O(N*L)

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  // 经过此节点前缀的所有单词（保持插入顺序）
  words: string[] = [];
}

function buildTrie(words: string[]): TrieNode {
  const root: TrieNode = new TrieNode();
  for (const w of words) {
    let node: TrieNode = root;
    root.words.push(w);
    for (const ch of w) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode());
      }
      node = node.children.get(ch) as TrieNode;
      node.words.push(w);
    }
  }
  return root;
}

function wordRectangle(words: string[]): string[] {
  // 按长度分组
  const byLen: Map<number, string[]> = new Map();
  let maxLen: number = 0;
  for (const w of words) {
    const len: number = w.length;
    if (!byLen.has(len)) byLen.set(len, []);
    (byLen.get(len) as string[]).push(w);
    if (len > maxLen) maxLen = len;
  }
  // 为每个长度建 Trie
  const tries: Map<number, TrieNode> = new Map();
  for (const [len, ws] of byLen) {
    tries.set(len, buildTrie(ws));
  }

  // 从最大长度向下尝试，找到的第一个即为最大方阵
  for (let k: number = maxLen; k >= 1; k--) {
    if (!byLen.has(k)) continue;
    const trie: TrieNode = tries.get(k) as TrieNode;
    const square: string[] = [];

    const build = (row: number): boolean => {
      if (row === k) return true;
      // 计算强制前缀：各行第 row 列字符拼接
      let prefix: string = "";
      for (let j: number = 0; j < row; j++) {
        prefix += square[j][row];
      }
      // 在 Trie 中定位前缀节点
      let node: TrieNode | null = trie;
      for (const ch of prefix) {
        if (node === null) break;
        node = node.children.get(ch) ?? null;
      }
      if (node === null) return false;
      // 候选单词：所有以 prefix 开头的长度 k 单词
      const candidates: string[] = node.words;
      for (const cand of candidates) {
        square.push(cand);
        if (build(row + 1)) return true;
        square.pop();
      }
      return false;
    };

    if (build(0)) {
      return square;
    }
  }
  return [];
}

// 方法2：回溯+前缀哈希
// 用哈希表 prefixMap[len][prefix] 直接保存每个前缀对应的单词列表，
// 回溯时按前缀查询候选单词。
// 时间复杂度 O(N*L*k), 空间复杂度 O(N*L)
function wordRectangleHash(words: string[]): string[] {
  const byLen: Map<number, string[]> = new Map();
  let maxLen: number = 0;
  for (const w of words) {
    const len: number = w.length;
    if (!byLen.has(len)) byLen.set(len, []);
    (byLen.get(len) as string[]).push(w);
    if (len > maxLen) maxLen = len;
  }
  // 为每个长度构建前缀 -> 单词列表 的映射
  const prefixMap: Map<number, Map<string, string[]>> = new Map();
  for (const [len, ws] of byLen) {
    const pm: Map<string, string[]> = new Map();
    pm.set("", ws); // 空前缀对应全部单词
    for (const w of ws) {
      let pre: string = "";
      for (let i: number = 0; i < w.length; i++) {
        pre += w[i];
        if (!pm.has(pre)) pm.set(pre, []);
        (pm.get(pre) as string[]).push(w);
      }
    }
    prefixMap.set(len, pm);
  }

  for (let k: number = maxLen; k >= 1; k--) {
    if (!byLen.has(k)) continue;
    const pm: Map<string, string[]> = prefixMap.get(k) as Map<string, string[]>;
    const square: string[] = [];

    const build = (row: number): boolean => {
      if (row === k) return true;
      // 强制前缀
      let prefix: string = "";
      for (let j: number = 0; j < row; j++) {
        prefix += square[j][row];
      }
      const candidates: string[] = pm.get(prefix) ?? [];
      for (const cand of candidates) {
        square.push(cand);
        if (build(row + 1)) return true;
        square.pop();
      }
      return false;
    };

    if (build(0)) {
      return square;
    }
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 139. 单词矩阵 =====");
console.log(wordRectangle(["area", "lead", "wall", "lady", "ball", "row", "oar", "ear"]));
// 期望结果: ["wall","area","lead","lady"] (4×4 单词方阵)
console.log(wordRectangleHash(["area", "lead", "wall", "lady", "ball", "row", "oar", "ear"]));
// 期望结果: ["wall","area","lead","lady"]
console.log(wordRectangle(["a", "b", "c"]));
// 期望结果: ["a"] (1×1, 任一单字符单词)
console.log(wordRectangle(["abc", "def"]));
// 期望结果: [] (无法构成方阵)

export {};
