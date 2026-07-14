// ============================================================
// 097. 尽可能使字符串相等
// ============================================================
// LeetCode 1208. Get Equal Substrings Within Budget
// 每次可改变 s 的一个字符使其等于 t 的对应字符，开销为 ASCII 差。
// 给定最大开销 maxCost，求可变成相等的最长子串长度。

// 方法1：滑动窗口
function equalSubstring(s: string, t: string, maxCost: number): number {
  const n = s.length;
  const costs = new Array(n);
  for (let i = 0; i < n; i++) {
    costs[i] = Math.abs(s.charCodeAt(i) - t.charCodeAt(i));
  }
  let left = 0;
  let currentCost = 0;
  let maxLen = 0;
  for (let right = 0; right < n; right++) {
    currentCost += costs[right];
    while (currentCost > maxCost) {
      currentCost -= costs[left++];
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}

// 方法2：前缀和 + 二分查找
function equalSubstringBinary(s: string, t: string, maxCost: number): number {
  const n = s.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + Math.abs(s.charCodeAt(i) - t.charCodeAt(i));
  }
  let maxLen = 0;
  for (let i = 0; i < n; i++) {
    // 找最大的 j 使得 prefix[j+1] - prefix[i] <= maxCost
    let lo = i;
    let hi = n - 1;
    let best = i - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (prefix[mid + 1] - prefix[i] <= maxCost) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    maxLen = Math.max(maxLen, best - i + 1);
  }
  return maxLen;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 097. 尽可能使字符串相等 =====");
console.log("滑窗 'abcd','bcdf',3:", equalSubstring("abcd", "bcdf", 3)); // 3
console.log("滑窗 'abcd','cdef',3:", equalSubstring("abcd", "cdef", 3)); // 1
console.log("滑窗 'abcd','acde',0:", equalSubstring("abcd", "acde", 0)); // 1
console.log("二分 'abcd','bcdf',3:", equalSubstringBinary("abcd", "bcdf", 3)); // 3

export {};
