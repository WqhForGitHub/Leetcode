// ============================================================
// 146. 划分字母区间
// ============================================================
// LeetCode 763. Partition Labels
// 将字符串划分为尽可能多的片段，使每个字母只出现在一个片段中，返回各片段长度。
// 时间复杂度：O(n)，空间复杂度：O(1)

function partitionLabels(s: string): number[] {
  // 哈希表：每个字母最后出现的位置
  const last = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    last.set(s[i], i);
  }

  const result: number[] = [];
  let start = 0;
  let end = 0;
  for (let i = 0; i < s.length; i++) {
    // 当前片段的右边界 = max(当前字母的最后位置)
    end = Math.max(end, last.get(s[i])!);
    if (i === end) {
      // 到达片段末尾
      result.push(end - start + 1);
      start = end + 1;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 146. 划分字母区间 =====");
console.log(partitionLabels("ababcbacadefegdehijhklij")); // 期望: [9, 7, 8]
console.log(partitionLabels("eccbbbbdec")); // 期望: [10]

export {};
