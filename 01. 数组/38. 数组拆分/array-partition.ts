// ============================================================
// 38. 数组拆分
// ============================================================
// LeetCode 561. Array Partition
// 给定 2n 个整数的数组，将它们分成 n 对 (a1,b1),(a2,b2),...，求 min(ai,bi) 的总和最大值。
// 时间复杂度：O(n log n)，空间复杂度：O(1)

// 方法1：排序后取偶数位（推荐）
function arrayPairSum(nums: number[]): number {
  // 升序排序后，相邻两数配对 (nums[0],nums[1]),(nums[2],nums[3]),...
  // 每对取较小值即偶数位元素
  // 这样能保证较小的数尽可能不被"浪费"在更大的数上
  nums.sort((a, b) => a - b);

  let sum = 0;
  // 取所有偶数索引位置的元素累加
  for (let i = 0; i < nums.length; i += 2) {
    sum += nums[i];
  }

  return sum;
}

// 方法2：计数排序-利用值域优化（值范围 [-10000, 10000]）
function arrayPairSumCounting(nums: number[]): number {
  // 计数数组，索引偏移 10000 以处理负数
  const count = new Array(20001).fill(0);
  for (const num of nums) {
    count[num + 10000]++;
  }

  let sum = 0;
  let isFirstInPair = true; // 当前数是否为对中的第一个（较小者）

  // 按值从小到大遍历计数数组
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      if (isFirstInPair) {
        // 还原原值并累加
        sum += i - 10000;
      }
      isFirstInPair = !isFirstInPair;
      count[i]--;
    }
  }

  return sum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 38. 数组拆分 =====");
console.log("描述:", arrayPairSum([1, 4, 3, 2])); // 期望结果: 4
console.log("描述:", arrayPairSum([6, 2, 6, 5, 1, 2])); // 期望结果: 9
console.log("描述:", arrayPairSumCounting([1, 4, 3, 2])); // 期望结果: 4
console.log("描述:", arrayPairSumCounting([6, 2, 6, 5, 1, 2])); // 期望结果: 9

export {};
