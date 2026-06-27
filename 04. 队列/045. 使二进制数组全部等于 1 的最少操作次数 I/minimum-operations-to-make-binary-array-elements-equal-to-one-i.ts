// ============================================================
// 045. 使二进制数组全部等于 1 的最少操作次数 I
// ============================================================
// LeetCode 3191. Minimum Operations to Make Binary Array Elements Equal to One I
// 每次操作可以选择 3 个连续元素翻转，求使数组全部变为 1 的最少操作次数。

// ------------------------------------------------------------
// 方法1：贪心 + 差分数组
// ------------------------------------------------------------
// 从左到右遍历，遇到 0 就翻转以该位置开头的 3 个元素。
// 用差分数组记录翻转状态。
// 时间 O(n)，空间 O(n)。
function minOperations1(nums: number[]): number {
  const n = nums.length;
  const flip: number[] = new Array(n + 1).fill(0);
  let flipCount = 0;
  let result = 0;
  for (let i = 0; i < n; i++) {
    flipCount += flip[i];
    const cur = (nums[i] + flipCount) % 2;
    if (cur === 0) {
      if (i + 2 >= n) return -1;
      result++;
      flipCount++;
      flip[i + 3]--;
    }
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：贪心 + 直接翻转
// ------------------------------------------------------------
// 直接修改数组值，遇到 0 翻转后续 3 个元素。
// 时间 O(n)，空间 O(1)。
function minOperations2(nums: number[]): number {
  const n = nums.length;
  let result = 0;
  const arr = [...nums];
  for (let i = 0; i < n - 2; i++) {
    if (arr[i] === 0) {
      arr[i] ^= 1;
      arr[i + 1] ^= 1;
      arr[i + 2] ^= 1;
      result++;
    }
  }
  return arr[n - 2] === 1 && arr[n - 1] === 1 ? result : -1;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", minOperations1([0, 1, 1, 1, 0, 0]), "期望: 3");
  console.log("测试2:", minOperations1([0, 1, 1, 1]), "期望: -1");
  console.log("测试3:", minOperations2([0, 1, 1, 1, 0, 0]), "期望: 3");
  console.log("测试4:", minOperations2([0, 1, 1, 1]), "期望: -1");
}

test();

export {};
