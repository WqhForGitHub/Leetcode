// ============================================================
// 151. 搜索推荐系统
// ============================================================
// LeetCode 1268. Search Suggestions System
// 给定产品数组 products 和搜索词 searchWord，对每个前缀返回字典序前 3 个匹配产品。

// 方法1：排序 + 二分查找（推荐，O(n log n + m * log n)）
// 先对 products 排序，对每个前缀用二分找到第一个 >= 前缀的位置，
// 从该位置向后取最多 3 个以该前缀开头的产品。
function suggestedProducts(products: string[], searchWord: string): string[][] {
  products.sort();
  const result: string[][] = [];
  let prefix: string = "";
  for (const ch of searchWord) {
    prefix += ch;
    // 二分找第一个 >= prefix 的下标
    let lo: number = 0;
    let hi: number = products.length;
    while (lo < hi) {
      const mid: number = (lo + hi) >> 1;
      if (products[mid] < prefix) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    const matches: string[] = [];
    for (let i = lo; i < products.length && matches.length < 3; i++) {
      if (products[i].startsWith(prefix)) {
        matches.push(products[i]);
      } else {
        break;
      }
    }
    result.push(matches);
  }
  return result;
}

// 方法2：字典树 Trie（O(n * L + m * 26)）
// 每个节点维护前 3 个字典序最小的产品。先排序后插入可保证 suggestions 有序。
class TrieNode {
  children: Map<string, TrieNode> = new Map<string, TrieNode>();
  suggestions: string[] = [];
}

function suggestedProducts2(products: string[], searchWord: string): string[][] {
  products.sort();
  const root: TrieNode = new TrieNode();
  for (const p of products) {
    let node: TrieNode = root;
    for (const ch of p) {
      let child: TrieNode | undefined = node.children.get(ch);
      if (child === undefined) {
        child = new TrieNode();
        node.children.set(ch, child);
      }
      node = child;
      if (node.suggestions.length < 3) {
        node.suggestions.push(p);
      }
    }
  }

  const result: string[][] = [];
  let node: TrieNode | null = root;
  for (const ch of searchWord) {
    if (node !== null) {
      const child: TrieNode | undefined = node.children.get(ch);
      if (child !== undefined) {
        node = child;
        result.push([...node.suggestions]);
        continue;
      }
      node = null;
    }
    result.push([]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 151. 搜索推荐系统 =====");
console.log(
  "方法1:",
  JSON.stringify(
    suggestedProducts(["mobile", "mouse", "moneypot", "monitor", "mousepad"], "mouse"),
  ),
); // 期望: [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]
console.log("方法1:", JSON.stringify(suggestedProducts(["havana"], "havana"))); // 期望: [["havana"],["havana"],["havana"],["havana"],["havana"],["havana"]]
console.log(
  "方法2:",
  JSON.stringify(
    suggestedProducts2(["mobile", "mouse", "moneypot", "monitor", "mousepad"], "mouse"),
  ),
); // 期望: 同上

export {};
