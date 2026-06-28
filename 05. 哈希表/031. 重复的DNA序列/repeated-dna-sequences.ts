// ============================================================
// 031. 重复的DNA序列
// ============================================================
// LeetCode 187. Repeated DNA Sequences
// 找所有出现超过一次的10字母DNA子串。哈希表计数。
// 时间复杂度：O(n)，空间复杂度：O(n)

/**
 * 使用滑动窗口 + 哈希表计数
 * 遍历所有长度为 10 的子串，用哈希表记录出现次数
 * 收集所有出现次数大于 1 的子串
 */
function findRepeatedDnaSequences(s: string): string[] {
  const result: string[] = [];
  const countMap = new Map<string, number>();
  const windowSize = 10;

  // 滑动窗口遍历所有长度为 10 的子串
  for (let i = 0; i <= s.length - windowSize; i++) {
    const sub = s.slice(i, i + windowSize);
    const count = (countMap.get(sub) ?? 0) + 1;
    countMap.set(sub, count);
    // 当恰好出现第二次时加入结果，避免重复
    if (count === 2) {
      result.push(sub);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 重复的DNA序列 =====");
// 测试 1: 正常情况，包含两个重复序列
console.log(findRepeatedDnaSequences("AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"));
// 期望输出: ["AAAAACCCCC","CCCCCAAAAA"]

// 测试 2: 无重复序列
console.log(findRepeatedDnaSequences("AAAAAAAAAAAAA"));
// 期望输出: ["AAAAAAAAAA"]

// 测试 3: 长度不足 10
console.log(findRepeatedDnaSequences("ACGT"));
// 期望输出: []

// 测试 4: 单个字符重复
console.log(findRepeatedDnaSequences("AAAAAAAAAAA"));
// 期望输出: ["AAAAAAAAAA"]

export {};
