// ============================================================
// 084. 根据字符出现频率排序
// ============================================================
// LeetCode 451. Sort Characters By Frequency
// 给定字符串，按字符出现频率从高到低重排
// 思路：哈希表统计字符频率，按频率降序排序后拼接
// 时间复杂度：O(n log n)，空间复杂度：O(n)

function frequencySort(s: string): string {
  // 哈希表统计每个字符频率
  const freqMap = new Map<string, number>();
  for (const ch of s) {
    freqMap.set(ch, (freqMap.get(ch) ?? 0) + 1);
  }

  // 按频率降序排序
  const sorted = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);

  // 拼接结果
  let result = "";
  for (const [ch, freq] of sorted) {
    result += ch.repeat(freq);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 084. 根据字符出现频率排序 =====");
console.log(frequencySort("tree")); // 期望输出: "eert" 或 "eetr"
console.log(frequencySort("cccaaa")); // 期望输出: "aaaccc" 或 "cccaaa"
console.log(frequencySort("Aabb")); // 期望输出: "bbAa" 或 "bbaA"
console.log(frequencySort("")); // 期望输出: ""

export {};
