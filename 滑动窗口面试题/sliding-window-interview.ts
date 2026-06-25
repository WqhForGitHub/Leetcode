// ============================================================
// 滑动窗口面试题 - TypeScript 解题合集
// ============================================================

// ============================================================
// 1. 无重复字符的最长子串
// LeetCode 3. Longest Substring Without Repeating Characters
// 核心思路：用滑动窗口维护无重复字符的子串，右指针扩展窗口，
//           遇到重复字符时左指针收缩，用哈希表记录字符最新位置
// 时间复杂度：O(n)，每个字符最多被左右指针各访问一次
// 空间复杂度：O(min(m, n))，m 为字符集大小
// ============================================================

// 方法1：滑动窗口 + Map 记录下标（推荐）- 左指针直接跳跃
function lengthOfLongestSubstring(s: string): number {
  const charIndex = new Map<string, number>(); // 字符 -> 最新下标
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    // 如果字符已在窗口内，左指针直接跳到重复字符的下一个位置
    if (charIndex.has(char) && charIndex.get(char)! >= left) {
      left = charIndex.get(char)! + 1;
    }
    charIndex.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法2：滑动窗口 + Set 维护窗口内字符
function lengthOfLongestSubstringSet(s: string): number {
  const charSet = new Set<string>();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // 不断收缩左边界，直到窗口内无重复字符
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法3：数组代替 Map（仅限 ASCII 字符）- 性能更优
function lengthOfLongestSubstringArray(s: string): number {
  // 用数组记录字符最新出现的位置，-1 表示未出现
  const index = new Array(128).fill(-1);
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const code = s.charCodeAt(right);
    if (index[code] >= left) {
      left = index[code] + 1;
    }
    index[code] = right;
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法4：暴力枚举所有子串 — O(n^2)，仅作对比
function lengthOfLongestSubstringBruteForce(s: string): number {
  let maxLen = 0;

  for (let i = 0; i < s.length; i++) {
    const seen = new Set<string>();
    for (let j = i; j < s.length; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      maxLen = Math.max(maxLen, j - i + 1);
    }
  }

  return maxLen;
}

// ============================================================
// 2. 长度最小的子数组
// LeetCode 209. Minimum Size Subarray Sum
// 核心思路：用滑动窗口维护子数组和，右指针扩展，
//           当窗口内和 >= target 时，尝试收缩左指针以找更短子数组
// 时间复杂度：O(n)，每个元素最多被左右指针各访问一次
// 空间复杂度：O(1)
// ============================================================

// 方法1：滑动窗口（推荐）- 右指针扩展，左指针收缩
function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];

    // 当窗口内和 >= target 时，尝试收缩左边界
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}

// 方法2：前缀和 + 二分查找 — O(n log n)
// 利用前缀和单调性，对每个起点二分查找满足条件的最小终点
function minSubArrayLenBinarySearch(target: number, nums: number[]): number {
  const n = nums.length;
  // 构建前缀和数组，prefix[i] 表示 nums[0..i-1] 的和
  const prefix = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    prefix[i] = prefix[i - 1] + nums[i - 1];
  }

  let minLen = Infinity;

  for (let i = 0; i < n; i++) {
    // 在 prefix[i+1..n] 中找第一个 >= prefix[i] + target 的值
    const need = prefix[i] + target;
    let lo = i + 1,
      hi = n;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (prefix[mid] >= need) {
        minLen = Math.min(minLen, mid - i);
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
  }

  return minLen === Infinity ? 0 : minLen;
}

// 方法3：暴力枚举 — O(n^2)，仅作对比
function minSubArrayLenBruteForce(target: number, nums: number[]): number {
  let minLen = Infinity;

  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum >= target) {
        minLen = Math.min(minLen, j - i + 1);
        break; // 找到以 i 开头的最短子数组，无需继续
      }
    }
  }

  return minLen === Infinity ? 0 : minLen;
}

// ============================================================
// 3. 替换后的最长重复字符
// LeetCode 424. Longest Repeating Character Replacement
// 核心思路：滑动窗口维护子串，窗口内最多有 k 个非主要字符时可替换，
//           窗口长度 - 窗口内最多字符个数 > k 时收缩左指针
// 时间复杂度：O(n)，每个字符最多被左右指针各访问一次
// 空间复杂度：O(1)，仅用 26 大小的数组
// ============================================================

// 方法1：滑动窗口 + 频次数组（推荐）
function characterReplacement(s: string, k: number): number {
  const count = new Array(26).fill(0); // 记录窗口内各字符出现次数
  let left = 0;
  let maxCount = 0; // 窗口内出现最多次的字符的次数
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const idx = s.charCodeAt(right) - 65; // 'A' = 65
    count[idx]++;
    maxCount = Math.max(maxCount, count[idx]);

    // 窗口长度 - 最多字符个数 > k，说明需要替换的字符超过 k 个，收缩
    while (right - left + 1 - maxCount > k) {
      count[s.charCodeAt(left) - 65]--;
      left++;
      // 注意：maxCount 可能变小，但不影响正确性
      // 因为只有更大的 maxCount 才能更新 maxLen，小的 maxCount 不影响最终结果
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法2：滑动窗口 + 每次收缩后重新计算 maxCount — 更直观但略慢
function characterReplacementRecalc(s: string, k: number): number {
  const count = new Array(26).fill(0);
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    count[s.charCodeAt(right) - 65]++;

    // 窗口内需要替换的字符数 = 窗口长度 - 最多字符出现次数
    while (right - left + 1 - Math.max(...count) > k) {
      count[s.charCodeAt(left) - 65]--;
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法3：滑动窗口 + Map 记录频次 — 适用于任意字符集
function characterReplacementMap(s: string, k: number): number {
  const count = new Map<string, number>();
  let left = 0;
  let maxCount = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    count.set(char, (count.get(char) ?? 0) + 1);
    maxCount = Math.max(maxCount, count.get(char)!);

    while (right - left + 1 - maxCount > k) {
      const leftChar = s[left];
      count.set(leftChar, count.get(leftChar)! - 1);
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法4：枚举目标字符 — 对每个大写字母分别做滑动窗口
function characterReplacementEnumerate(s: string, k: number): number {
  let maxLen = 0;

  for (let c = 0; c < 26; c++) {
    const target = String.fromCharCode(65 + c); // 'A' + c
    let left = 0;
    let replaceCount = 0; // 窗口中非 target 字符的个数

    for (let right = 0; right < s.length; right++) {
      if (s[right] !== target) replaceCount++;

      while (replaceCount > k) {
        if (s[left] !== target) replaceCount--;
        left++;
      }

      maxLen = Math.max(maxLen, right - left + 1);
    }
  }

  return maxLen;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 无重复字符的最长子串 =====");
console.log(lengthOfLongestSubstring("abcabcbb")); // 3（"abc"）
console.log(lengthOfLongestSubstring("bbbbb")); // 1（"b"）
console.log(lengthOfLongestSubstring("pwwkew")); // 3（"wke"）
console.log(lengthOfLongestSubstring("")); // 0
console.log(lengthOfLongestSubstring("au")); // 2

console.log(lengthOfLongestSubstringSet("abcabcbb")); // 3
console.log(lengthOfLongestSubstringArray("pwwkew")); // 3
console.log(lengthOfLongestSubstringBruteForce("abcabcbb")); // 3

console.log("\n===== 2. 长度最小的子数组 =====");
console.log(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])); // 2（[4,3]）
console.log(minSubArrayLen(4, [1, 4, 4])); // 1（[4]）
console.log(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1])); // 0
console.log(minSubArrayLen(15, [1, 2, 3, 4, 5])); // 5（[1,2,3,4,5]）

console.log(minSubArrayLenBinarySearch(7, [2, 3, 1, 2, 4, 3])); // 2
console.log(minSubArrayLenBruteForce(7, [2, 3, 1, 2, 4, 3])); // 2

console.log("\n===== 3. 替换后的最长重复字符 =====");
console.log(characterReplacement("ABAB", 2)); // 4（替换两个 A 或两个 B）
console.log(characterReplacement("AABABBA", 1)); // 4（替换中间的 A 得到 "AABBBBA"）
console.log(characterReplacement("AAAA", 2)); // 4
console.log(characterReplacement("ABCDE", 1)); // 2

console.log(characterReplacementRecalc("AABABBA", 1)); // 4
console.log(characterReplacementMap("ABAB", 2)); // 4
console.log(characterReplacementEnumerate("AABABBA", 1)); // 4

export {};
