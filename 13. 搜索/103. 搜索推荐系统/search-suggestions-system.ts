// ============================================================
// 103. 搜索推荐系统
// ============================================================
// LeetCode 1268. Search Suggestions System
// 每输入一个字符，返回最多3个词典中以当前前缀开头的词。

// 方法1：排序 + 二分查找
function suggestedProducts(products: string[], searchWord: string): string[][] {
  products.sort();
  const result: string[][] = [];
  let prefix = "";
  for (const ch of searchWord) {
    prefix += ch;
    // 二分找第一个 >= prefix 的位置
    let lo = 0;
    let hi = products.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (products[mid] < prefix) lo = mid + 1;
      else hi = mid;
    }
    const suggestions: string[] = [];
    for (let i = lo; i < Math.min(lo + 3, products.length); i++) {
      if (products[i].startsWith(prefix)) {
        suggestions.push(products[i]);
      } else {
        break;
      }
    }
    result.push(suggestions);
  }
  return result;
}

// 方法2：Trie 前缀树
class TrieNode1268 {
  children: Map<string, TrieNode1268>;
  suggestions: string[];
  constructor() {
    this.children = new Map();
    this.suggestions = [];
  }
}

function suggestedProductsTrie(products: string[], searchWord: string): string[][] {
  const root = new TrieNode1268();
  products.sort();
  // 构建 Trie
  for (const product of products) {
    let node = root;
    for (const ch of product) {
      if (!node.children.has(ch)) {
        node.children.set(ch, new TrieNode1268());
      }
      node = node.children.get(ch)!;
      if (node.suggestions.length < 3) {
        node.suggestions.push(product);
      }
    }
  }
  // 搜索
  const result: string[][] = [];
  let node = root;
  for (const ch of searchWord) {
    if (node && node.children.has(ch)) {
      node = node.children.get(ch)!;
      result.push([...node.suggestions]);
    } else {
      node = null;
      result.push([]);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 103. 搜索推荐系统 =====");
console.log(
  "二分 ['mobile','mouse','moneypot','monitor','mousepad'],'mouse':",
  JSON.stringify(
    suggestedProducts(["mobile", "mouse", "moneypot", "monitor", "mousepad"], "mouse"),
  ),
);
// [["mobile","moneypot","monitor"],["mobile","moneypot","monitor"],["mouse","mousepad"],["mouse","mousepad"],["mouse","mousepad"]]
console.log(
  "Trie ['havana'],'havana':",
  JSON.stringify(suggestedProductsTrie(["havana"], "havana")),
);

export {};
