// ============================================================
// 104. 字符串的排列
// ============================================================
// LeetCode 567. Permutation in String
// 给定字符串 s1 和 s2，判断 s2 是否包含 s1 的任意排列作为子串。
// 时间复杂度：O(n)，n 为 s2 长度；空间复杂度：O(1)（字母表固定 26）

// 思路：滑动窗口 + 计数数组
// 维护长度为 s1.length 的窗口，比较窗口内字符计数与 s1 是否一致
function checkInclusion(s1: string, s2: string): boolean {
  const m = s1.length;
  const n = s2.length;
  if (m > n) return false;

  // s1 字符计数
  const count = new Array(26).fill(0);
  for (const ch of s1) {
    count[ch.charCodeAt(0) - 97]++;
  }

  // 滑动窗口
  const window = new Array(26).fill(0);
  for (let i = 0; i < n; i++) {
    window[s2.charCodeAt(i) - 97]++;
    if (i >= m) {
      window[s2.charCodeAt(i - m) - 97]--;
    }
    // 比较两个计数数组
    if (i >= m - 1 && arraysEqual(count, window)) {
      return true;
    }
  }
  return false;
}

function arraysEqual(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 104. 字符串的排列 =====");
// 测试 1
console.log(checkInclusion("ab", "eidbaooo")); // 期望: true
// 测试 2
console.log(checkInclusion("ab", "eidboaoo")); // 期望: false
// 测试 3
console.log(checkInclusion("adc", "dcda")); // 期望: true

export {};
