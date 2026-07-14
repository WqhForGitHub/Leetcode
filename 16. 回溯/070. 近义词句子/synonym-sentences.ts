// ============================================================
// 070. 近义词句子
// ============================================================
// LeetCode 1258. Synonymous Sentences
// 给定近义词对 (双向且传递) 和一个句子，返回所有可能的同义句（字典序）。
// 时间复杂度：O(S * P^W * W log W)，S 为句子词数，P 为同义词组平均大小，W 为可替换单词数

// 方法1：并查集 + 回溯 (推荐)
// 用并查集分组同义词，对每个单词枚举其同义词组中所有词做笛卡尔积
// 时间复杂度 O(S * P^W * W log W), 空间复杂度 O(S)
function generateSentences(synonyms: string[][], text: string): string[] {
  // 并查集
  const parent: Map<string, string> = new Map();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root) as string;
    // 路径压缩
    let cur = x;
    while (parent.get(cur) !== root) {
      const next = parent.get(cur) as string;
      parent.set(cur, root);
      cur = next;
    }
    return root;
  };
  const union = (a: string, b: string): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };

  // 初始化并查集
  for (const [a, b] of synonyms) {
    union(a, b);
  }

  // 收集每个根对应的同义词组
  const groups: Map<string, string[]> = new Map();
  for (const key of parent.keys()) {
    const root = find(key);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(key);
  }
  // 每组排序
  for (const arr of groups.values()) arr.sort();

  // 解析句子
  const words = text.split(" ");
  const result: string[] = [];
  const cur: string[] = [];

  const backtrack = (idx: number): void => {
    if (idx === words.length) {
      result.push(cur.join(" "));
      return;
    }
    const w = words[idx];
    if (parent.has(w)) {
      // 用同义词组中的每个词替换
      const root = find(w);
      for (const syn of groups.get(root)!) {
        cur.push(syn);
        backtrack(idx + 1);
        cur.pop();
      }
    } else {
      // 没有同义词，直接使用原词
      cur.push(w);
      backtrack(idx + 1);
      cur.pop();
    }
  };

  backtrack(0);
  // 结果已天然有序（每组词有序，且按字典序展开），但保险起见再排序去重
  return Array.from(new Set(result)).sort();
}

// 方法2：DFS + 哈希表
// 用 Map<string, Set<string>> 直接维护每个词的可达同义词集合，BFS/DFS 扩展
// 时间复杂度 O(S * P^W * W log W), 空间复杂度 O(S)
function generateSentences2(synonyms: string[][], text: string): string[] {
  // 邻接表
  const adj: Map<string, Set<string>> = new Map();
  const addEdge = (a: string, b: string): void => {
    if (!adj.has(a)) adj.set(a, new Set());
    if (!adj.has(b)) adj.set(b, new Set());
    adj.get(a)!.add(b);
    adj.get(b)!.add(a);
  };
  for (const [a, b] of synonyms) addEdge(a, b);

  // 对每个单词求其所在的同义词组（通过 BFS）
  const getSynonyms = (w: string): string[] => {
    if (!adj.has(w)) return [w];
    const visited: Set<string> = new Set();
    const queue: string[] = [w];
    visited.add(w);
    while (queue.length) {
      const cur = queue.shift()!;
      for (const next of adj.get(cur)!) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    return Array.from(visited).sort();
  };

  const words = text.split(" ");
  const result: string[] = [];
  const cur: string[] = [];

  const backtrack = (idx: number): void => {
    if (idx === words.length) {
      result.push(cur.join(" "));
      return;
    }
    const syns = getSynonyms(words[idx]);
    for (const syn of syns) {
      cur.push(syn);
      backtrack(idx + 1);
      cur.pop();
    }
  };

  backtrack(0);
  return Array.from(new Set(result)).sort();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 070. 近义词句子 =====");
console.log(
  generateSentences(
    [
      ["happy", "joy"],
      ["sad", "sorrow"],
      ["joy", "cheerful"],
    ],
    "I am happy today but was sad yesterday",
  ),
);
// 期望结果:
// ["I am cheerful today but was sad yesterday",
//  "I am cheerful today but was sorrow yesterday",
//  "I am happy today but was sad yesterday",
//  "I am happy today but was sorrow yesterday",
//  "I am joy today but was sad yesterday",
//  "I am joy today but was sorrow yesterday"]

console.log(
  generateSentences2(
    [
      ["happy", "joy"],
      ["sad", "sorrow"],
      ["joy", "cheerful"],
    ],
    "I am happy today but was sad yesterday",
  ),
);

export {};
