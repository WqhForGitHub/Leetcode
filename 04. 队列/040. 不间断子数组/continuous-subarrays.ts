// ============================================================
// 040. 不间断子数组
// ============================================================
// LeetCode 2762. Continuous Subarrays
// 统计子数组数目，使得子数组中任意两元素的绝对差不超过 2。

// ------------------------------------------------------------
// 方法1：两个单调双端队列 + 滑动窗口
// ------------------------------------------------------------
// 用单调递减队列维护窗口最大值，单调递增队列维护最小值。
// 当 max - min > 2 时收缩左端。
// 时间 O(n)，空间 O(n)。
function continuousSubarrays1(nums: number[]): number {
  const maxDeque: number[] = [];
  const minDeque: number[] = [];
  let left = 0;
  let result = 0;
  for (let right = 0; right < nums.length; right++) {
    while (maxDeque.length > 0 && nums[maxDeque[maxDeque.length - 1]] <= nums[right]) {
      maxDeque.pop();
    }
    maxDeque.push(right);
    while (minDeque.length > 0 && nums[minDeque[minDeque.length - 1]] >= nums[right]) {
      minDeque.pop();
    }
    minDeque.push(right);
    while (nums[maxDeque[0]] - nums[minDeque[0]] > 2) {
      left++;
      while (maxDeque[0] < left) maxDeque.shift();
      while (minDeque[0] < left) minDeque.shift();
    }
    result += right - left + 1;
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：TreeMap 风格（有序数组模拟）
// ------------------------------------------------------------
// 用排序数组维护窗口内元素及其频次，检查 max - min <= 2。
// 时间 O(n log n)，空间 O(n)。
function continuousSubarrays2(nums: number[]): number {
  let left = 0;
  let result = 0;
  const sorted: Map<number, number> = new Map();
  for (let right = 0; right < nums.length; right++) {
    sorted.set(nums[right], (sorted.get(nums[right]) || 0) + 1);
    while (sorted.size > 0) {
      const keys = [...sorted.keys()].sort((a, b) => a - b);
      if (keys[keys.length - 1] - keys[0] > 2) {
        const oldCount = sorted.get(nums[left])! - 1;
        if (oldCount === 0) sorted.delete(nums[left]);
        else sorted.set(nums[left], oldCount);
        left++;
      } else {
        break;
      }
    }
    result += right - left + 1;
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", continuousSubarrays1([5, 4, 2, 4]), "期望: 8");
  console.log("测试2:", continuousSubarrays1([1, 2, 3]), "期望: 6");
  console.log("测试3:", continuousSubarrays2([5, 4, 2, 4]), "期望: 8");
  console.log("测试4:", continuousSubarrays2([1, 2, 3]), "期望: 6");
}

test();

export {};
