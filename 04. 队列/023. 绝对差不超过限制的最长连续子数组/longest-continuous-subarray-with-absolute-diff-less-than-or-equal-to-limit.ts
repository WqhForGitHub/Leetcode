// ============================================================
// 023. 绝对差不超过限制的最长连续子数组
// ============================================================
// LeetCode 1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit
// 返回最长连续子数组的长度，使得子数组内任意两元素差的绝对值不超过 limit。

// ------------------------------------------------------------
// 方法1：两个单调双端队列
// ------------------------------------------------------------
// 用一个单调递减队列维护窗口最大值，一个单调递增队列维护最小值。
// 当 max - min > limit 时左指针右移。
// 时间 O(n)，空间 O(n)。
function longestSubarray1(nums: number[], limit: number): number {
  const maxDeque: number[] = []; // 单调递减，队首最大
  const minDeque: number[] = []; // 单调递增，队首最小
  let left = 0;
  let result = 0;
  for (let right = 0; right < nums.length; right++) {
    while (
      maxDeque.length > 0 &&
      nums[maxDeque[maxDeque.length - 1]] <= nums[right]
    ) {
      maxDeque.pop();
    }
    maxDeque.push(right);
    while (
      minDeque.length > 0 &&
      nums[minDeque[minDeque.length - 1]] >= nums[right]
    ) {
      minDeque.pop();
    }
    minDeque.push(right);
    // 收缩窗口
    while (nums[maxDeque[0]] - nums[minDeque[0]] > limit) {
      left++;
      while (maxDeque[0] < left) maxDeque.shift();
      while (minDeque[0] < left) minDeque.shift();
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：有序集合（TreeMap 模拟）
// ------------------------------------------------------------
// 用排序数组维护窗口内元素，每次二分插入/删除，检查 max-min。
// 时间 O(n log n)，空间 O(n)。
function longestSubarray2(nums: number[], limit: number): number {
  const sorted: number[] = [];
  let left = 0;
  let result = 0;

  const insert = (val: number) => {
    let lo = 0;
    let hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    sorted.splice(lo, 0, val);
  };

  const remove = (val: number) => {
    const idx = sorted.indexOf(val);
    sorted.splice(idx, 1);
  };

  for (let right = 0; right < nums.length; right++) {
    insert(nums[right]);
    while (sorted[sorted.length - 1] - sorted[0] > limit) {
      remove(nums[left++]);
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", longestSubarray1([8, 2, 4, 7], 4), "期望: 2");
  console.log("测试2:", longestSubarray1([10, 1, 2, 4, 7, 2], 5), "期望: 4");
  console.log(
    "测试3:",
    longestSubarray1([4, 2, 2, 2, 4, 4, 2, 2], 0),
    "期望: 3",
  );
  console.log("测试4:", longestSubarray2([8, 2, 4, 7], 4), "期望: 2");
  console.log("测试5:", longestSubarray2([10, 1, 2, 4, 7, 2], 5), "期望: 4");
}

test();

export {};
