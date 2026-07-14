// ============================================================
// 080. 找到字符串中所有字母异位词
// ============================================================
// LeetCode 438. Find All Anagrams in a String
// 找 s 中所有 p 的字母异位词的起始索引
// 思路：滑动窗口 + 哈希表计数，维护窗口大小等于 p.length，比较频次数组
// 时间复杂度：O(n)，空间复杂度：O(字母数)

function findAnagrams(s: string, p: string): number[] {
  const result: number[] = [];
  if (s.length < p.length) return result;

  // p 的字符频次
  const pCount: number[] = new Array(26).fill(0);
  // 滑动窗口字符频次
  const sCount: number[] = new Array(26).fill(0);

  // 初始化 p 频次和 s 第一个窗口
  for (let i = 0; i < p.length; i++) {
    pCount[p.charCodeAt(i) - 97]++;
    sCount[s.charCodeAt(i) - 97]++;
  }

  // 比较两个频次数组是否相同
  const same = (a: number[], b: number[]): boolean => {
    for (let i = 0; i < 26; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  if (same(pCount, sCount)) result.push(0);

  // 滑动窗口右移
  for (let i = p.length; i < s.length; i++) {
    // 右端字符进入窗口
    sCount[s.charCodeAt(i) - 97]++;
    // 左端字符离开窗口
    sCount[s.charCodeAt(i - p.length) - 97]--;
    if (same(pCount, sCount)) result.push(i - p.length + 1);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 080. 找到字符串中所有字母异位词 =====");
console.log(findAnagrams("cbaebabacd", "abc")); // 期望输出: [0, 6]
console.log(findAnagrams("abab", "ab")); // 期望输出: [0, 1, 2]
console.log(findAnagrams("baa", "aa")); // 期望输出: [1]

export {};
