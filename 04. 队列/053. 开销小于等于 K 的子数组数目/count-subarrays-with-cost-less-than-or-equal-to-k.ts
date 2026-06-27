// ============================================================
// 053. 开销小于等于 K 的子数组数目
// ============================================================
// LeetCode 周赛题. 开销小于等于 K 的子数组数目
// 子数组的开销 = 子数组和 + 子数组中最大元素值，统计开销 <= K 的子数组数目。

// ------------------------------------------------------------
// 方法1：双指针 + 单调队列
// ------------------------------------------------------------
// 用单调队列维护窗口最大值，滑动窗口统计合法子数组。
// 时间 O(n)，空间 O(n)。
function countSubarraysWithCost1(nums: number[], k: number): number {
  const n = nums.length;
  const maxDeque: number[] = [];
  let sum = 0;
  let left = 0;
  let result = 0;
  for (let right = 0; right < n; right++) {
    sum += nums[right];
    while (
      maxDeque.length > 0 &&
      nums[maxDeque[maxDeque.length - 1]] <= nums[right]
    ) {
      maxDeque.pop();
    }
    maxDeque.push(right);
    while (left <= right) {
      while (maxDeque[0] < left) maxDeque.shift();
      const maxVal = nums[maxDeque[0]];
      const cost = sum + maxVal;
      if (cost <= k) break;
      sum -= nums[left];
      left++;
    }
    result += right - left + 1;
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：枚举最大值 + 单调栈
// ------------------------------------------------------------
// 用单调栈找到每个元素作为最大值的左右边界，分段统计。
// 时间 O(n log n)，空间 O(n)。
function countSubarraysWithCost2(nums: number[], k: number): number {
  const n = nums.length;
  // 前缀和
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
  }
  // 单调栈找左右边界
  const left: number[] = new Array(n).fill(-1);
  const right: number[] = new Array(n).fill(n);
  const stack: number[] = [];
  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      right[stack.pop()!] = i;
    }
    if (stack.length > 0) left[i] = stack[stack.length - 1];
    stack.push(i);
  }
  let result = 0;
  for (let i = 0; i < n; i++) {
    // nums[i] 是 [left[i]+1, right[i]-1] 范围内的最大值
    // 对每个子数组 [l, r]，开销 = sum + nums[i]
    // 枚举左端点
    for (let l = left[i] + 1; l <= i; l++) {
      for (let r = i; r < right[i]; r++) {
        const subSum = prefix[r + 1] - prefix[l];
        if (subSum + nums[i] <= k) result++;
      }
    }
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", countSubarraysWithCost1([1, 2, 3], 5), "期望: 4");
  console.log("测试2:", countSubarraysWithCost1([2, 1, 2], 5), "期望: 3");
  console.log("测试3:", countSubarraysWithCost2([1, 2, 3], 5), "期望: 4");
}

test();

export {};
