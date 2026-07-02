// ============================================================
// 021. 至少有 K 个重复字符的最长子串
// ============================================================
// LeetCode 395. Longest Substring with At Least K Repeating Characters
// 找到给定字符串中最长子串的长度，要求子串中每个字符出现的次数都不少于 k。
// 时间复杂度：O(n * |Σ|)，空间复杂度：O(|Σ|)

// 方法1：分治递归（推荐）
// 思路：统计每个字符出现次数，把出现次数 < k 的字符作为"分割点"，
//       因为这些字符不可能出现在最终答案中。按这些字符切分字符串，
//       对每一段递归求解，取最大值。若整段没有 < k 的字符，则整段即为答案。
function longestSubstring(s: string, k: number): number {
  return divide(s, 0, s.length - 1, k);
}

function divide(s: string, left: number, right: number, k: number): number {
  if (right - left + 1 < k) return 0;

  // 统计当前区间每个字符出现次数
  const count = new Map<string, number>();
  for (let i = left; i <= right; i++) {
    const ch = s[i];
    count.set(ch, (count.get(ch) ?? 0) + 1);
  }

  // 寻找第一个出现次数 < k 的字符作为分割点
  for (let i = left; i <= right; i++) {
    const c = count.get(s[i])!;
    if (c < k) {
      // 以 s[i] 为分割点，分别递归左右两边
      const leftPart = divide(s, left, i - 1, k);
      const rightPart = divide(s, i + 1, right, k);
      return Math.max(leftPart, rightPart);
    }
  }

  // 整段所有字符出现次数都 >= k
  return right - left + 1;
}

// 方法2：滑动窗口 + 限制不同字符个数（O(|Σ| * n)）
// 思路：枚举窗口内允许出现的不同字符个数 t（1 到 26），
//       对每个 t 用滑动窗口维护恰好包含 t 个不同字符的窗口，
//       并统计每个字符出现次数，若所有字符都 >= k 则更新答案。
function longestSubstringSliding(s: string, k: number): number {
  let maxLen = 0;
  const maxUnique = new Set<string>(s.split("")).size;

  for (let t = 1; t <= maxUnique; t++) {
    const count = new Map<string, number>();
    let left = 0;
    let unique = 0; // 当前窗口不同字符数
    let atLeastK = 0; // 当前窗口出现次数 >= k 的字符数

    for (let right = 0; right < s.length; right++) {
      const chR = s[right];
      const cntR = count.get(chR) ?? 0;
      if (cntR === 0) unique++;
      count.set(chR, cntR + 1);
      if (cntR + 1 === k) atLeastK++;

      // 当不同字符数超过 t，收缩左边界
      while (unique > t) {
        const chL = s[left];
        const cntL = count.get(chL)!;
        if (cntL === k) atLeastK--;
        count.set(chL, cntL - 1);
        if (cntL - 1 === 0) unique--;
        left++;
      }

      // 窗口恰好包含 t 个不同字符，且都 >= k
      if (unique === t && atLeastK === t) {
        maxLen = Math.max(maxLen, right - left + 1);
      }
    }
  }

  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 021. 至少有 K 个重复字符的最长子串 =====");
console.log("分治 aaabb, k=3:", longestSubstring("aaabb", 3)); // 期望: 3
console.log("分治 ababbc, k=2:", longestSubstring("ababbc", 2)); // 期望: 5
console.log("分治 ababacb, k=3:", longestSubstring("ababacb", 3)); // 期望: 0
console.log("滑窗 aaabb, k=3:", longestSubstringSliding("aaabb", 3)); // 期望: 3
console.log("滑窗 ababbc, k=2:", longestSubstringSliding("ababbc", 2)); // 期望: 5
console.log("滑窗 ababacb, k=3:", longestSubstringSliding("ababacb", 3)); // 期望: 0

export {};
