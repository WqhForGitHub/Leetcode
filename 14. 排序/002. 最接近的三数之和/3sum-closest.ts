// ============================================================
// 002. 最接近的三数之和
// ============================================================
// LeetCode 16. 3Sum Closest
// 给定数组 nums 和目标值 target，找出和最接近 target 的三个整数，返回它们的和。

// 方法1：排序 + 双指针（推荐，时间 O(n^2)，空间 O(log n) 排序栈）
function threeSumClosest(nums: number[], target: number): number {
  const n = nums.length;
  nums.sort((a, b) => a - b);

  let bestSum = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < n - 2; i++) {
    // 跳过重复的固定元素以减少计算
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = n - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      // 更接近则更新
      if (Math.abs(sum - target) < Math.abs(bestSum - target)) {
        bestSum = sum;
      }

      if (sum === target) {
        return target;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }

  return bestSum;
}

// 方法2：暴力枚举（时间 O(n^3)，空间 O(1)）
function threeSumClosest2(nums: number[], target: number): number {
  const n = nums.length;
  let bestSum = nums[0] + nums[1] + nums[2];

  for (let i = 0; i < n - 2; i++) {
    for (let j = i + 1; j < n - 1; j++) {
      for (let k = j + 1; k < n; k++) {
        const sum = nums[i] + nums[j] + nums[k];
        if (Math.abs(sum - target) < Math.abs(bestSum - target)) {
          bestSum = sum;
        }
      }
    }
  }

  return bestSum;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 002. 最接近的三数之和 =====");
console.log("方法1:", threeSumClosest([-1, 2, 1, -4], 1)); // 期望: 2
console.log("方法1:", threeSumClosest([0, 0, 0], 1)); // 期望: 0
console.log("方法2:", threeSumClosest2([-1, 2, 1, -4], 1)); // 期望: 2
console.log("方法2:", threeSumClosest2([0, 0, 0], 1)); // 期望: 0

export {};
