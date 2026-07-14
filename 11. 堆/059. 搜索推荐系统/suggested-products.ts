// ============================================================
// 059. 搜索推荐系统
// ============================================================
// LeetCode 1268. Search Suggestions System
// 给定产品数组和搜索词，返回每个前缀对应的最多 3 个产品（按字典序）。
// 时间复杂度：O(N log N + M log M)，空间复杂度：O(N)

// 方法1：排序 + 双指针
function suggestedProducts(products: string[], searchWord: string): string[][] {
  products.sort();
  const result: string[][] = [];
  let lo = 0;
  let hi = products.length - 1;
  for (let i = 0; i < searchWord.length; i++) {
    const ch = searchWord[i];
    while (lo <= hi && (products[lo].length <= i || products[lo][i] !== ch)) lo++;
    while (lo <= hi && (products[hi].length <= i || products[hi][i] !== ch)) hi--;
    const arr: string[] = [];
    for (let j = lo; j < lo + 3 && j <= hi; j++) arr.push(products[j]);
    result.push(arr);
  }
  return result;
}

// 方法2：Trie + 最小堆
function suggestedProductsTrie(products: string[], searchWord: string): string[][] {
  class TrieNode {
    children: Map<string, TrieNode> = new Map();
    suggestions: string[] = []; // 最小堆（按字典序）维护 3 个
  }
  const root = new TrieNode();
  const productsSorted = products.slice().sort();
  const insert = (word: string): void => {
    let node = root;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch)!;
      if (node.suggestions.length < 3) node.suggestions.push(word);
    }
  };
  for (const p of productsSorted) insert(p);
  const result: string[][] = [];
  let node: TrieNode | null = root;
  for (const ch of searchWord) {
    if (node === null || !node.children.has(ch)) {
      node = null;
      result.push([]);
    } else {
      node = node.children.get(ch)!;
      result.push(node.suggestions.slice());
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 059. 搜索推荐系统 =====");
console.log(
  "双指针:",
  JSON.stringify(
    suggestedProducts(["mobile", "mouse", "moneypot", "monitor", "mousepad"], "mouse"),
  ),
);
// 期望 [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]

export {};
