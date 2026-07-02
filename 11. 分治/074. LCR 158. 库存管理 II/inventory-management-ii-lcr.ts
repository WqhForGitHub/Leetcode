// ============================================================
// 074. LCR 158. 库存管理 II
// ============================================================
// LeetCode 169. Majority Element
// 给定一个大小为 n 的数组 nums，返回其中的多数元素。
// 多数元素是指在数组中出现次数大于 n/2 的元素。可以假设数组非空且总是存在多数元素。
// 时间复杂度：O(n), 空间复杂度：O(1)

// 方法1：Boyer-Moore 摩尔投票（推荐）
// 维护候选人和计数，遇到相同则+1，不同则-1，归零时换候选人
// 时间复杂度 O(n)，空间复杂度 O(1)
function majorityElementVoting(nums: number[]): number {
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

// 方法2：分治
// 将数组对半分，分别求左右多数元素，若相同即为整体多数，否则比较两者出现次数
// 时间复杂度 O(n log n)，空间复杂度 O(log n) 递归栈
function majorityElementDnC(nums: number[]): number {
  function countInRange(num: number, lo: number, hi: number): number {
    let count: number = 0;
    for (let i: number = lo; i <= hi; i++) {
      if (nums[i] === num) {
        count++;
      }
    }
    return count;
  }

  function majorityRec(lo: number, hi: number): number {
    if (lo === hi) {
      return nums[lo];
    }
    const mid: number = lo + Math.floor((hi - lo) / 2);
    const leftMaj: number = majorityRec(lo, mid);
    const rightMaj: number = majorityRec(mid + 1, hi);
    if (leftMaj === rightMaj) {
      return leftMaj;
    }
    const leftCount: number = countInRange(leftMaj, lo, hi);
    const rightCount: number = countInRange(rightMaj, lo, hi);
    return leftCount > rightCount ? leftMaj : rightMaj;
  }

  return majorityRec(0, nums.length - 1);
}

// 方法3：哈希表统计
// 用哈希表统计每个元素出现次数，返回出现次数最多的
// 时间复杂度 O(n)，空间复杂度 O(n)
function majorityElementHash(nums: number[]): number {
  const countMap: Map<number, number> = new Map();
  const half: number = Math.floor(nums.length / 2);
  for (const num of nums) {
    const c: number = (countMap.get(num) ?? 0) + 1;
    if (c > half) {
      return num;
    }
    countMap.set(num, c);
  }
  return nums[0];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 074. LCR 158. 库存管理 II =====");
console.log(majorityElementVoting([3, 2, 3])); // 期望结果: 3
console.log(majorityElementVoting([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2
console.log(majorityElementVoting([1])); // 期望结果: 1
console.log("--- 方法2测试 ---");
console.log(majorityElementDnC([3, 2, 3])); // 期望结果: 3
console.log(majorityElementDnC([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2
console.log("--- 方法3测试 ---");
console.log(majorityElementHash([3, 2, 3])); // 期望结果: 3
console.log(majorityElementHash([2, 2, 1, 1, 1, 2, 2])); // 期望结果: 2

export {};
