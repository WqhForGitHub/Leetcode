// ============================================================
// 121. 实现一个魔法字典
// ============================================================
// LeetCode 676. Implement Magic Dictionary
// 设计支持 buildDict 和 search 的数据结构。search 时允许将 searchWord
// 中恰好一个字符替换为另一字符，判断字典中是否存在可匹配的单词。
// 时间复杂度：buildDict O(N*L)，search O(L^2 * 26)；空间复杂度：O(N*L)

class MagicDictionary {
  // 按长度分桶：长度 -> 单词列表
  private byLen = new Map<number, string[]>();

  constructor() {}

  buildDict(dictionary: string[]): void {
    this.byLen.clear();
    for (const w of dictionary) {
      const len = w.length;
      if (!this.byLen.has(len)) {
        this.byLen.set(len, []);
      }
      this.byLen.get(len)!.push(w);
    }
  }

  search(searchWord: string): boolean {
    const len = searchWord.length;
    const candidates = this.byLen.get(len);
    if (!candidates) return false;

    // 对每个同长度单词，统计不同字符数，恰好为 1 则匹配
    for (const w of candidates) {
      let diff = 0;
      for (let i = 0; i < len; i++) {
        if (w[i] !== searchWord[i]) {
          diff++;
          if (diff > 1) break;
        }
      }
      if (diff === 1) return true;
    }
    return false;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 121. 实现一个魔法字典 =====");
const magic = new MagicDictionary();
magic.buildDict(["hello", "leetcode"]);
console.log(magic.search("hello")); // 期望: false (无差异)
console.log(magic.search("hhllo")); // 期望: true (匹配 "hello")
console.log(magic.search("hell")); // 期望: false (长度不同)
console.log(magic.search("leetcodd")); // 期望: true (匹配 "leetcode")

export {};
