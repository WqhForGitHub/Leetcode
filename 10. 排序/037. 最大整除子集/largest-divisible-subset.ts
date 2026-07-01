// ============================================================
// 037. 最大整除子集
// ============================================================
// LeetCode 368. Largest Divisible Subset
// 找出集合中最大的整除子集：子集中任意两元素 a,b 满足 a%b==0 或 b%a==0。

// 方法1：排序 + DP 求长度（O(n²) 时间，O(n) 空间）
// 排序后，dp[i] = 以 nums[i] 结尾的最大整除子集长度。
// 由于有序，nums[i] >= nums[j]，只需判断 nums[i] % nums[j] == 0。
function largestDivisibleSubsetLength(nums: number[]): number {
  if (nums.length === 0) return 0;
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const dp: number[] = new Array(n).fill(1);
  let best = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] % nums[j] === 0) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
    best = Math.max(best, dp[i]);
  }
  return best;
}

// 方法2：排序 + DP + parent 指针重建子集（O(n²) 时间，O(n) 空间）
// 记录每个状态的前驱，最后从最大长度位置回溯得到完整子集。
function largestDivisibleSubset(nums: number[]): number[] {
  if (nums.length === 0) return [];
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const dp: number[] = new Array(n).fill(1);
  const parent: number[] = new Array(n).fill(-1);
  let maxSize = 1;
  let maxIdx = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] % nums[j] === 0 && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        parent[i] = j;
      }
    }
    if (dp[i] > maxSize) {
      maxSize = dp[i];
      maxIdx = i;
    }
  }
  // 从 maxIdx 回溯重建子集
  const result: number[] = [];
  let cur = maxIdx;
  while (cur !== -1) {
    result.push(nums[cur]);
    cur = parent[cur];
  }
  return result.reverse();
}

// ============================================================
// 测试
// ============================================================
console.log("===== 037. 最大整除子集 =====");

// 验证子集是否为合法整除子集
function isValidSubset(subset: number[]): boolean {
  const s = [...subset].sort((a, b) => a - b);
  for (let i = 0; i < s.length; i++) {
    for (let j = i + 1; j < s.length; j++) {
      if (s[j] % s[i] !== 0) return false;
    }
  }
  return true;
}

console.log("长度 [1,2,3]:", largestDivisibleSubsetLength([1, 2, 3])); // 期望 2
console.log("长度 [1,2,4,8]:", largestDivisibleSubsetLength([1, 2, 4, 8])); // 期望 4

const s1 = largestDivisibleSubset([1, 2, 3]);
console.log("子集 [1,2,3]:", s1, "(合法:", isValidSubset(s1) + ")"); // 期望 [1,2] 或 [1,3]

const s2 = largestDivisibleSubset([1, 2, 4, 8]);
console.log("子集 [1,2,4,8]:", s2, "(合法:", isValidSubset(s2) + ")"); // 期望 [1,2,4,8]

export {};
