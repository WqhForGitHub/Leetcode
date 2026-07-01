// ============================================================
// 110. 使数组唯一的最小增量
// ============================================================
// LeetCode 945. Minimum Increment to Make Array Unique
// 每次操作可使某个元素 +1，求使数组所有元素互不相同的最小操作次数。

// 方法1：排序 + 贪心（推荐，O(n log n) 时间，O(log n) 空间）
// 排序后，每个数至少要比前一个唯一值大 1，差额即所需增量。
function minIncrementForUnique(nums: number[]): number {
  nums.sort((a, b) => a - b);
  let moves = 0;
  let next = nums[0];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < next) {
      moves += next - nums[i];
      next = next + 1;
    } else {
      next = nums[i] + 1;
    }
  }
  return moves;
}

// 方法2：计数排序（O(n + max) 时间，O(max) 空间）
// 统计每个值频次，把多余的值逐级往后推到下一个空位。
function minIncrementForUniqueCount(nums: number[]): number {
  if (nums.length === 0) return 0;
  let max = 0;
  for (const x of nums) if (x > max) max = x;
  // 大小需覆盖可能被推到的最大位置
  const count = new Array<number>(max + nums.length + 1).fill(0);
  for (const x of nums) count[x]++;
  let moves = 0;
  for (let v = 0; v < count.length; v++) {
    if (count[v] > 1) {
      const extra = count[v] - 1;
      moves += extra;
      count[v + 1] += extra;
    }
  }
  return moves;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 110. 使数组唯一的最小增量 =====");
console.log("排序贪心:", minIncrementForUnique([1, 2, 2])); // 期望 1
console.log("排序贪心:", minIncrementForUnique([3, 2, 1, 2, 1, 7])); // 期望 6
console.log("计数:", minIncrementForUniqueCount([1, 2, 2])); // 期望 1
console.log("计数:", minIncrementForUniqueCount([3, 2, 1, 2, 1, 7])); // 期望 6

export {};
