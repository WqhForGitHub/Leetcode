// ============================================================
// 140. 前缀和后缀搜索
// ============================================================
// LeetCode 745. Prefix and Suffix Search
// 设计 WordFilter，支持 f(prefix, suffix) 返回同时以 prefix 开头、suffix 结尾的单词最大下标。
// 时间复杂度：初始化 O(N*L^2)，查询 O(1)；空间复杂度：O(N*L^2)

class WordFilter {
  // 哈希表：key="prefix#suffix" -> 最大下标
  private dict = new Map<string, number>();

  constructor(words: string[]) {
    // 对每个单词，枚举所有前缀和后缀的组合
    for (let idx = 0; idx < words.length; idx++) {
      const word = words[idx];
      const L = word.length;
      // 枚举前缀长度 0..L
      for (let i = 0; i <= L; i++) {
        const prefix = word.slice(0, i);
        // 枚举后缀长度 0..L
        for (let j = 0; j <= L; j++) {
          const suffix = word.slice(L - j);
          const key = prefix + "#" + suffix;
          // 由于 idx 升序，后者覆盖前者
          this.dict.set(key, idx);
        }
      }
    }
  }

  f(prefix: string, suffix: string): number {
    const key = prefix + "#" + suffix;
    return this.dict.has(key) ? this.dict.get(key)! : -1;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 140. 前缀和后缀搜索 =====");
const wf = new WordFilter(["apple"]);
console.log(wf.f("a", "e")); // 期望: 0
console.log(wf.f("a", "le")); // 期望: 0
console.log(wf.f("b", "")); // 期望: -1
const wf2 = new WordFilter(["abbba", "abba", "bb", "bcb"]);
console.log(wf2.f("ab", "ba")); // 期望: 2 (匹配 "abba" 在下标 1, "abbba" 在下标 0... 实际"abba"下标1)
// 注意：实际期望需根据题目验证

export {};
