// ============================================================
// 129. 使数组中所有元素都等于零
// ============================================================
// LeetCode 2772. Make All Array Elements Equal to Zero
// 可以选择一个连续子数组全部减1，或者将非零元素减1（从某个位置开始）。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：贪心 + 差分思想
function checkArray(nums: number[], k: number): boolean {
  const n = nums.length;
  const diff: number[] = new Array(n + 1).fill(0);
  let cur = 0;
  for (let i = 0; i < n; i++) {
    cur += diff[i];
    const val = nums[i] + cur;
    if (val < 0) return false;
    if (val > 0) {
      if (i + k > n) return false;
      cur -= val;
      diff[i + k] += val;
    }
  }
  return true;
}

// 方法2：差分数组验证
function checkArrayDiff(nums: number[], k: number): boolean {
  const n = nums.length;
  const ops: number[] = new Array(n + 1).fill(0);
  let prefix = 0;
  for (let i = 0; i < n; i++) {
    prefix += ops[i];
    const target = nums[i] + prefix;
    if (target < 0) return false;
    if (target === 0) continue;
    if (i + k > n) return false;
    prefix -= target;
    ops[i + k] += target;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 129. 使数组中所有元素都等于零 =====");
console.log("贪心:", checkArray([2, 2, 3, 1, 1, 0], 3)); // 期望 true
console.log("差分:", checkArrayDiff([1, 3, 1, 1], 2)); // 期望 false

export {};
