// ============================================================
// 双指针面试题 - TypeScript 解题合集
// 双指针核心思想：利用两个指针协同遍历，将 O(n^2) 降为 O(n)
// 常见模式：对撞指针（左右相向）、快慢指针（同向不同速）、滑动窗口
// ============================================================

// ============================================================
// 1. 两数之和
// LeetCode 1. Two Sum
// 核心思路：排序后使用对撞指针，或使用哈希表一次遍历
// 时间复杂度：O(n)（哈希表）/ O(n log n)（排序 + 双指针）
// 空间复杂度：O(n)（哈希表）/ O(log n)（排序）
// ============================================================

// 方法1：哈希表（推荐）- 一次遍历，查找 complement
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>(); // 值 -> 索引
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// 方法2：排序 + 对撞指针（返回数值而非索引）
function twoSumSorted(nums: number[], target: number): number[] {
  const sorted = nums.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left].val + sorted[right].val;
    if (sum === target) {
      return [sorted[left].idx, sorted[right].idx];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  return [];
}

// 方法3：暴力枚举 — O(n^2)，仅作对比
function twoSumBruteForce(nums: number[], target: number): number[] {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// ============================================================
// 2. 验证回文串
// LeetCode 125. Valid Palindrome
// 核心思路：对撞指针从两端向中间移动，跳过非字母数字字符
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：对撞指针（推荐）- 原地判断，跳过非字母数字
function isPalindrome(s: string): boolean {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    // 跳过非字母数字字符
    while (left < right && !isAlphaNumeric(s[left])) left++;
    while (left < right && !isAlphaNumeric(s[right])) right--;
    if (left < right && s[left].toLowerCase() !== s[right].toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}

function isAlphaNumeric(char: string): boolean {
  return /[a-zA-Z0-9]/.test(char);
}

// 方法2：正则过滤 + 反转比较
function isPalindromeRegex(s: string): boolean {
  const filtered = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return filtered === filtered.split("").reverse().join("");
}

// 方法3：正则过滤 + 对撞指针（结合方法1和2的优点）
function isPalindromeFiltered(s: string): boolean {
  const filtered = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = filtered.length - 1;
  while (left < right) {
    if (filtered[left] !== filtered[right]) return false;
    left++;
    right--;
  }
  return true;
}

// ============================================================
// 3. 移动零
// LeetCode 283. Move Zeroes
// 核心思路：快慢指针，慢指针指向下一个非零元素应放置的位置
// 时间复杂度：O(n)
// 空间复杂度：O(1)，原地操作
// ============================================================

// 方法1：快慢指针（推荐）- 一次遍历，交换非零元素到前面
function moveZeroes(nums: number[]): void {
  let slow = 0; // 慢指针：下一个非零元素应放的位置
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
}

// 方法2：先覆盖后补零 — 避免非零元素与自身的无效交换
function moveZeroesOverwrite(nums: number[]): void {
  let slow = 0;
  // 先将所有非零元素前移
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  // 末尾补零
  for (let i = slow; i < nums.length; i++) {
    nums[i] = 0;
  }
}

// 方法3：两次遍历计数 — 先数零的个数再操作
function moveZeroesCount(nums: number[]): void {
  let zeroCount = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      zeroCount++;
    } else if (zeroCount > 0) {
      nums[i - zeroCount] = nums[i];
      nums[i] = 0;
    }
  }
}

// ============================================================
// 4. 判断子序列
// LeetCode 392. Is Subsequence
// 核心思路：双指针分别遍历 s 和 t，匹配则推进 s 的指针
// 时间复杂度：O(n)，n 为 t 的长度
// 空间复杂度：O(1)
// ============================================================

// 方法1：双指针（推荐）- 贪心匹配
function isSubsequence(s: string, t: string): boolean {
  let i = 0; // s 的指针
  let j = 0; // t 的指针
  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) {
      i++;
    }
    j++;
  }
  return i === s.length;
}

// 方法2：迭代器 — 利用 for...of 遍历 t
function isSubsequenceIterator(s: string, t: string): boolean {
  let i = 0;
  for (const char of t) {
    if (i < s.length && s[i] === char) i++;
  }
  return i === s.length;
}

// 方法3：预处理 + 二分查找 — 适用于大量 s 查询同一 t 的场景
// 预处理 O(|t|)，每次查询 O(|s| * log|t|)
function isSubsequenceBinarySearch(s: string, t: string): boolean {
  // 预处理：记录每个字符在 t 中出现的所有索引
  const charIndices = new Map<string, number[]>();
  for (let i = 0; i < t.length; i++) {
    if (!charIndices.has(t[i])) {
      charIndices.set(t[i], []);
    }
    charIndices.get(t[i])!.push(i);
  }

  // 对 s 中每个字符，在对应索引列表中二分查找大于 prev 的最小索引
  let prev = -1;
  for (const char of s) {
    if (!charIndices.has(char)) return false;
    const indices = charIndices.get(char)!;
    // 二分查找第一个大于 prev 的索引
    let left = 0;
    let right = indices.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (indices[mid] > prev) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }
    if (left === indices.length) return false;
    prev = indices[left];
  }
  return true;
}

// ============================================================
// 5. 合并两个有序数组
// LeetCode 88. Merge Sorted Array
// 核心思路：逆向双指针，从后往前填充避免覆盖
// 时间复杂度：O(m + n)
// 空间复杂度：O(1)，原地合并
// ============================================================

// 方法1：逆向双指针（推荐）- 从末尾比较填充，避免覆盖 nums1 前部
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let p1 = m - 1; // nums1 有效元素末尾
  let p2 = n - 1; // nums2 末尾
  let tail = m + n - 1; // 合并后末尾

  while (p1 >= 0 || p2 >= 0) {
    if (p1 === -1) {
      nums1[tail] = nums2[p2];
      p2--;
    } else if (p2 === -1) {
      nums1[tail] = nums1[p1];
      p1--;
    } else if (nums1[p1] > nums2[p2]) {
      nums1[tail] = nums1[p1];
      p1--;
    } else {
      nums1[tail] = nums2[p2];
      p2--;
    }
    tail--;
  }
}

// 方法2：正向双指针 + 辅助数组 — 需要额外空间
function mergeWithExtra(nums1: number[], m: number, nums2: number[], n: number): void {
  const copy = nums1.slice(0, m); // 复制 nums1 有效部分
  let p1 = 0;
  let p2 = 0;
  let cur = 0;

  while (p1 < m && p2 < n) {
    if (copy[p1] <= nums2[p2]) {
      nums1[cur++] = copy[p1++];
    } else {
      nums1[cur++] = nums2[p2++];
    }
  }
  while (p1 < m) nums1[cur++] = copy[p1++];
  while (p2 < n) nums1[cur++] = nums2[p2++];
}

// 方法3：合并后排序 — 最简单但效率低
function mergeSort(nums1: number[], m: number, nums2: number[], n: number): void {
  for (let i = 0; i < n; i++) {
    nums1[m + i] = nums2[i];
  }
  nums1.sort((a, b) => a - b);
}

// ============================================================
// 6. 删除排序数组中的重复项
// LeetCode 26. Remove Duplicates from Sorted Array
// 核心思路：快慢指针，慢指针指向唯一元素的末尾
// 时间复杂度：O(n)
// 空间复杂度：O(1)，原地操作
// ============================================================

// 方法1：快慢指针（推荐）- 慢指针记录不重复元素的位置
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 1; // 慢指针：下一个不重复元素应放的位置
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[fast - 1]) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  return slow;
}

// 方法2：快慢指针 — 与前一个不重复元素比较
function removeDuplicatesV2(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}

// 方法3：允许重复两次的变体 — LeetCode 80
function removeDuplicatesAllowTwo(nums: number[]): number {
  if (nums.length <= 2) return nums.length;
  let slow = 2;
  for (let fast = 2; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow - 2]) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  return slow;
}

// ============================================================
// 7. 最长连续不重复子序列
// LeetCode 3. Longest Substring Without Repeating Characters
// 核心思路：滑动窗口 + 哈希集合，右指针扩展窗口，遇到重复则左指针收缩
// 时间复杂度：O(n)
// 空间复杂度：O(min(n, charset))，字符集大小
// ============================================================

// 方法1：滑动窗口 + Set（推荐）- 右指针扩展，左指针收缩
function lengthOfLongestSubstring(s: string): number {
  const charSet = new Set<string>();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    // 如果当前字符已在窗口中，左指针收缩直到移除重复字符
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法2：滑动窗口 + Map 优化 — 直接跳转左指针，无需逐个收缩
function lengthOfLongestSubstringMap(s: string): number {
  const charIndex = new Map<string, number>(); // 字符 -> 最新索引
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    if (charIndex.has(s[right]) && charIndex.get(s[right])! >= left) {
      // 左指针直接跳到重复字符的下一个位置
      left = charIndex.get(s[right])! + 1;
    }
    charIndex.set(s[right], right);
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法3：数组代替 Map（仅限 ASCII 字符集）— 更快的常数因子
function lengthOfLongestSubstringArray(s: string): number {
  const lastSeen = new Array(128).fill(-1); // ASCII 字符最后出现的位置
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const code = s.charCodeAt(right);
    if (lastSeen[code] >= left) {
      left = lastSeen[code] + 1;
    }
    lastSeen[code] = right;
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// ============================================================
// 8. 盛最多水的容器
// LeetCode 11. Container With Most Water
// 核心思路：对撞指针，短板决定水量，移动较短的一侧才可能增大面积
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：对撞指针（推荐）- 每次移动较短的一侧
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    // 当前面积 = 较短高度 * 宽度
    const currentArea = Math.min(height[left], height[right]) * (right - left);
    maxWater = Math.max(maxWater, currentArea);

    // 移动较短的一侧（贪心：移动较长侧不可能获得更大面积）
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}

// 方法2：对撞指针 — 提前跳过不可能更优的高度
function maxAreaSkip(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const w = right - left;
    maxWater = Math.max(maxWater, h * w);

    // 跳过比当前最小高度更低的柱子
    if (height[left] < height[right]) {
      while (left < right && height[left] <= h) left++;
    } else {
      while (left < right && height[right] <= h) right--;
    }
  }

  return maxWater;
}

// 方法3：暴力枚举 — O(n^2)，仅作对比
function maxAreaBruteForce(height: number[]): number {
  let maxWater = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      const area = Math.min(height[i], height[j]) * (j - i);
      maxWater = Math.max(maxWater, area);
    }
  }
  return maxWater;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 两数之和 =====");
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSum([3, 2, 4], 6)); // [1, 2]
console.log(twoSum([3, 3], 6)); // [0, 1]
console.log(twoSumSorted([2, 7, 11, 15], 9)); // [0, 1]
console.log(twoSumBruteForce([3, 2, 4], 6)); // [1, 2]

console.log("\n===== 2. 验证回文串 =====");
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome(" ")); // true
console.log(isPalindromeRegex("A man, a plan, a canal: Panama")); // true
console.log(isPalindromeFiltered("race a car")); // false

console.log("\n===== 3. 移动零 =====");
const arr1 = [0, 1, 0, 3, 12];
moveZeroes(arr1);
console.log(arr1); // [1, 3, 12, 0, 0]
const arr2 = [0, 1, 0, 3, 12];
moveZeroesOverwrite(arr2);
console.log(arr2); // [1, 3, 12, 0, 0]
const arr3 = [0, 0, 1];
moveZeroesCount(arr3);
console.log(arr3); // [1, 0, 0]

console.log("\n===== 4. 判断子序列 =====");
console.log(isSubsequence("abc", "ahbgdc")); // true
console.log(isSubsequence("axc", "ahbgdc")); // false
console.log(isSubsequenceIterator("", "ahbgdc")); // true
console.log(isSubsequenceBinarySearch("abc", "ahbgdc")); // true

console.log("\n===== 5. 合并两个有序数组 =====");
const m1 = [1, 2, 3, 0, 0, 0];
merge(m1, 3, [2, 5, 6], 3);
console.log(m1); // [1, 2, 2, 3, 5, 6]
const m2 = [1, 2, 3, 0, 0, 0];
mergeWithExtra(m2, 3, [2, 5, 6], 3);
console.log(m2); // [1, 2, 2, 3, 5, 6]
const m3 = [0];
mergeSort(m3, 0, [1], 1);
console.log(m3); // [1]

console.log("\n===== 6. 删除排序数组中的重复项 =====");
const d1 = [1, 1, 2];
console.log(removeDuplicates(d1), d1); // 2, [1, 2, ...]
const d2 = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
console.log(removeDuplicatesV2(d2), d2); // 5, [0, 1, 2, 3, 4, ...]
const d3 = [1, 1, 1, 2, 2, 3];
console.log(removeDuplicatesAllowTwo(d3), d3); // 5, [1, 1, 2, 2, 3, ...]

console.log("\n===== 7. 最长连续不重复子序列 =====");
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb")); // 1 ("b")
console.log(lengthOfLongestSubstring("pwwkew")); // 3 ("wke")
console.log(lengthOfLongestSubstringMap("")); // 0
console.log(lengthOfLongestSubstringArray("au")); // 2

console.log("\n===== 8. 盛最多水的容器 =====");
console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxArea([1, 1])); // 1
console.log(maxAreaSkip([1, 8, 6, 2, 5, 4, 8, 3, 7])); // 49
console.log(maxAreaBruteForce([4, 3, 2, 1, 4])); // 16

export {};
