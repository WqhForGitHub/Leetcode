// ============================================================
// 023. 拼接最大数
// ============================================================
// LeetCode 321. Create Maximum Number
// 从两个数组中按相对顺序共取 k 个数，使拼接后数字最大。

// ------------------------------------------------------------
// 方法1：单调栈 + 合并
// ------------------------------------------------------------
// 枚举从 nums1 取 i 个、nums2 取 k-i 个的最大子序列（单调栈），
// 再把两个子序列按字典序合并成最大。时间 O(k*(m+n))。
function maxNumber(nums1: number[], nums2: number[], k: number): number[] {
  const m = nums1.length;
  const n = nums2.length;
  let result: number[] = [];
  for (let i = Math.max(0, k - n); i <= Math.min(k, m); i++) {
    const sub1 = maxSubsequence(nums1, i);
    const sub2 = maxSubsequence(nums2, k - i);
    const merged = merge(sub1, sub2);
    if (compare(merged, 0, result, 0) > 0) {
      result = merged;
    }
  }
  return result;
}

// 单调栈：从 nums 中取 k 个，保持相对顺序使数字最大
// 维护单调递减栈，允许删除 (n-k) 个较小元素。
function maxSubsequence(nums: number[], k: number): number[] {
  const stack: number[] = [];
  let toRemove = nums.length - k;
  for (const num of nums) {
    while (toRemove > 0 && stack.length > 0 && stack[stack.length - 1] < num) {
      stack.pop();
      toRemove--;
    }
    stack.push(num);
  }
  return stack.slice(0, k);
}

// 合并两个子序列为最大（按字典序取较大者）
function merge(a: number[], b: number[]): number[] {
  const result: number[] = [];
  let i = 0,
    j = 0;
  while (i < a.length || j < b.length) {
    if (compare(a, i, b, j) > 0) {
      result.push(a[i++]);
    } else {
      result.push(b[j++]);
    }
  }
  return result;
}

// 比较 a[i..] 和 b[j..] 的字典序：>0 表示 a 大
function compare(a: number[], i: number, b: number[], j: number): number {
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) return a[i] - b[j];
    i++;
    j++;
  }
  return a.length - i - (b.length - j);
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", maxNumber([3, 4, 6, 5], [9, 1, 2, 5, 8, 3], 5), "期望: [9,8,6,5,3]");
  console.log("测试2:", maxNumber([6, 7], [6, 0, 4], 5), "期望: [6,7,6,0,4]");
  console.log("测试3:", maxNumber([3, 9], [8, 9], 3), "期望: [9,8,9]");
}

test();

export {};
