// ============================================================
// 009. 多数元素
// ============================================================
// LeetCode 169. Majority Element
// 给定一个大小为 n 的数组 nums，返回其中的多数元素。
// 多数元素是指在数组中出现次数大于 n/2 的元素。
// 时间复杂度：O(n), 空间复杂度：O(1)

// 方法1：Boyer-Moore 投票算法（推荐）
// 维护候选人和计数，相同则+1不同则-1，归零时换候选人
// 多数元素出现次数过半，最终一定是候选人
// 时间复杂度 O(n)，空间复杂度 O(1)
function majorityElement(nums: number[]): number {
  let candidate: number = nums[0];
  let count: number = 0;
  for (const num of nums) {
    if (count === 0) {
      candidate = num;
    }
    count += num === candidate ? 1 : -1;
  }
  return candidate;
}

// 方法2：分治法
// 将数组分成左右两半，分别求多数元素：
// - 若左右多数相同，即为整体多数
// - 若不同，统计两个候选在当前区间的出现次数，取较多者
// 时间复杂度 O(n log n)，空间复杂度 O(log n)
function majorityElementDivideConquer(nums: number[]): number {
  // 统计 num 在 nums[left..right] 中的出现次数
  function countInRange(num: number, left: number, right: number): number {
    let count: number = 0;
    for (let i: number = left; i <= right; i++) {
      if (nums[i] === num) count++;
    }
    return count;
  }

  // 返回 nums[left..right] 的多数元素
  function divide(left: number, right: number): number {
    // 基线：单元素区间，多数就是它本身
    if (left === right) return nums[left];

    const mid: number = left + Math.floor((right - left) / 2);
    const leftMajor: number = divide(left, mid);
    const rightMajor: number = divide(mid + 1, right);

    // 若两半多数相同，直接返回
    if (leftMajor === rightMajor) return leftMajor;

    // 否则统计两个候选在当前区间的出现次数
    const leftCount: number = countInRange(leftMajor, left, right);
    const rightCount: number = countInRange(rightMajor, left, right);

    return leftCount > rightCount ? leftMajor : rightMajor;
  }

  return divide(0, nums.length - 1);
}

// 方法3：哈希表计数
// 用哈希表统计每个元素出现次数，返回超过 n/2 的元素
// 时间复杂度 O(n)，空间复杂度 O(n)
function majorityElementHash(nums: number[]): number {
  const counts: Map<number, number> = new Map<number, number>();
  const majority: number = Math.floor(nums.length / 2);
  for (const num of nums) {
    const newCount: number = (counts.get(num) ?? 0) + 1;
    counts.set(num, newCount);
    if (newCount > majority) {
      return num;
    }
  }
  return -1; // 不会执行到（题目保证存在多数元素）
}

// ============================================================
// 测试
// ============================================================
console.log("===== 009. 多数元素 =====");
console.log(majorityElement([3, 2, 3])); // 期望结果: 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2
console.log(majorityElement([1])); // 期望结果: 1
console.log("--- 方法2测试 ---");
console.log(majorityElementDivideConquer([3, 2, 3])); // 期望结果: 3
console.log(majorityElementDivideConquer([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2
console.log(majorityElementDivideConquer([1])); // 期望结果: 1
console.log("--- 方法3测试 ---");
console.log(majorityElementHash([3, 2, 3])); // 期望结果: 3
console.log(majorityElementHash([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2

export {};
