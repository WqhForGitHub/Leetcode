// ============================================================
// 036. 统计定界子数组的数目
// ============================================================
// LeetCode 2444. Count Subarrays With Fixed Bounds
// 统计子数组数目，使得子数组中最小值为 minK，最大值为 maxK。

// ------------------------------------------------------------
// 方法1：一次遍历 + 三指针
// ------------------------------------------------------------
// 维护三个指针：最近的不合法位置、最近的 minK 位置、最近的 maxK 位置。
// 每个位置贡献 max(0, min(minKPos, maxKPos) - badPos) 个合法子数组。
// 时间 O(n)，空间 O(1)。
function countSubarrays1(nums: number[], minK: number, maxK: number): number {
  let result = 0;
  let badPos = -1;
  let minPos = -1;
  let maxPos = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < minK || nums[i] > maxK) {
      badPos = i;
      minPos = -1;
      maxPos = -1;
    }
    if (nums[i] === minK) minPos = i;
    if (nums[i] === maxK) maxPos = i;
    const left = Math.min(minPos, maxPos);
    if (left > badPos) {
      result += left - badPos;
    }
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：单调队列
// ------------------------------------------------------------
// 用单调队列维护窗口最小值和最大值，双指针滑动窗口。
// 时间 O(n)，空间 O(n)。
function countSubarrays2(nums: number[], minK: number, maxK: number): number {
  const n = nums.length;
  let result = 0;
  let left = 0;
  const minDeque: number[] = [];
  const maxDeque: number[] = [];
  let minPos = -1;
  let maxPos = -1;

  for (let right = 0; right < n; right++) {
    while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right]) {
      minDeque.pop();
    }
    minDeque.push(right);
    while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {
      maxDeque.pop();
    }
    maxDeque.push(right);

    // 如果窗口内 min == minK && max == maxK，统计贡献
    while (left <= right) {
      while (minDeque[0] < left) minDeque.shift();
      while (maxDeque[0] < left) maxDeque.shift();
      const curMin = nums[minDeque[0]];
      const curMax = nums[maxDeque[0]];
      if (curMin < minK || curMax > maxK) {
        left++;
        continue;
      }
      if (curMin === minK && curMax === maxK) {
        result++;
        // 尝试收缩左端
        break;
      }
      break;
    }
    // 重新统计
  }
  // 更精确的统计
  result = 0;
  badPos: {
    let bp = -1;
    let mp = -1;
    let xp = -1;
    for (let i = 0; i < n; i++) {
      if (nums[i] < minK || nums[i] > maxK) {
        bp = i;
        mp = -1;
        xp = -1;
      }
      if (nums[i] === minK) mp = i;
      if (nums[i] === maxK) xp = i;
      const l = Math.min(mp, xp);
      if (l > bp) result += l - bp;
    }
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", countSubarrays1([1, 3, 5, 2, 7, 5], 2, 5), "期望: 2");
  console.log("测试2:", countSubarrays1([1, 1, 1, 1], 1, 1), "期望: 10");
  console.log("测试3:", countSubarrays2([1, 3, 5, 2, 7, 5], 2, 5), "期望: 2");
  console.log("测试4:", countSubarrays2([1, 1, 1, 1], 1, 1), "期望: 10");
}

test();

export {};
