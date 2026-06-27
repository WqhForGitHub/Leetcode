// ============================================================
// 047. 统计 K 次操作以内得到非递减子数组的数目
// ============================================================
// LeetCode 周赛题. 统计 K 次操作以内得到非递减子数组的数目
// 每次操作可将一个元素加 1，统计在最多 K 次操作内能变为非递减的子数组数目。

// ------------------------------------------------------------
// 方法1：单调栈 + 贡献法
// ------------------------------------------------------------
// 对于每个右端点，用单调栈维护左侧最近的小于当前元素的位置，
// 计算使 [left, right] 非递减所需的最少操作数。
// 时间 O(n^2) 最坏，空间 O(n)。
function countNonDecreasingSubarrays1(nums: number[], k: number): number {
  const n = nums.length;
  let result = 0;
  for (let right = 0; right < n; right++) {
    let maxVal = nums[right];
    let ops = 0;
    for (let left = right - 1; left >= 0; left--) {
      if (nums[left] < maxVal) {
        ops += maxVal - nums[left];
      } else {
        maxVal = nums[left];
      }
      if (ops <= k) {
        result++;
      } else {
        break;
      }
    }
  }
  return result + n; // 加上所有长度为 1 的子数组
}

// ------------------------------------------------------------
// 方法2：双端队列 + 滑动窗口
// ------------------------------------------------------------
// 用单调递减双端队列维护窗口内最大值，双指针滑动窗口统计合法子数组。
// 时间 O(n)，空间 O(n)。
function countNonDecreasingSubarrays2(nums: number[], k: number): number {
  const n = nums.length;
  let result = 0;
  let left = 0;
  let ops = 0;
  // 单调递减队列存下标，维护窗口内最大值序列
  const deque: number[] = [];

  for (let right = 0; right < n; right++) {
    // 新元素 nums[right] 进入窗口
    while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[right]) {
      const mid = deque.pop()!;
      const prev = deque.length > 0 ? deque[deque.length - 1] : left - 1;
      ops += (nums[right] - nums[mid]) * (mid - prev);
    }
    deque.push(right);

    // 收缩窗口直到 ops <= k
    while (ops > k) {
      // 移除左端元素
      if (deque[0] === left) {
        const front = deque.shift()!;
        const next = deque.length > 0 ? deque[0] : right;
        ops -= (nums[front] - nums[left]) * (next - front);
      } else {
        ops -= nums[deque[0]] - nums[left];
      }
      left++;
    }
    result += right - left + 1;
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", countNonDecreasingSubarrays1([5, 2, 2], 1), "期望: 5");
  console.log("测试2:", countNonDecreasingSubarrays1([1, 2, 3], 0), "期望: 6");
  console.log("测试3:", countNonDecreasingSubarrays2([5, 2, 2], 1), "期望: 5");
  console.log("测试4:", countNonDecreasingSubarrays2([1, 2, 3], 0), "期望: 6");
}

test();

export {};
