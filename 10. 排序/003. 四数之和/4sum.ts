// ============================================================
// 003. 四数之和
// ============================================================
// LeetCode 18. 4Sum
// 给定数组 nums 和目标值 target，找出所有和为 target 的不重复四元组。

// 方法1：排序 + 双指针（推荐，时间 O(n^3)，空间 O(log n) 排序栈）
function fourSum(nums: number[], target: number): number[][] {
  const result: number[][] = [];
  const n = nums.length;
  if (n < 4) return result;

  nums.sort((a, b) => a - b);

  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    // 剪枝
    if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break;
    if (nums[i] + nums[n - 3] + nums[n - 2] + nums[n - 1] < target) continue;

    for (let j = i + 1; j < n - 2; j++) {
      if (j > i + 1 && nums[j] === nums[j - 1]) continue;
      // 剪枝
      if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) break;
      if (nums[i] + nums[j] + nums[n - 2] + nums[n - 1] < target) continue;

      let left = j + 1;
      let right = n - 1;
      while (left < right) {
        const sum = nums[i] + nums[j] + nums[left] + nums[right];
        if (sum === target) {
          result.push([nums[i], nums[j], nums[left], nums[right]]);
          while (left < right && nums[left] === nums[left + 1]) left++;
          while (left < right && nums[right] === nums[right - 1]) right--;
          left++;
          right--;
        } else if (sum < target) {
          left++;
        } else {
          right--;
        }
      }
    }
  }

  return result;
}

// 方法2：通用 kSum 递归（时间 O(n^(k-1))，空间 O(k) 递归栈）
function fourSum2(nums: number[], target: number): number[][] {
  nums.sort((a, b) => a - b);

  const twoSum = (start: number, target: number): number[][] => {
    const res: number[][] = [];
    let left = start;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[left] + nums[right];
      if (sum === target) {
        res.push([nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
    return res;
  };

  const kSum = (start: number, k: number, target: number): number[][] => {
    if (k === 2) return twoSum(start, target);
    const res: number[][] = [];
    for (let i = start; i < nums.length - k + 1; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      const sub = kSum(i + 1, k - 1, target - nums[i]);
      for (const arr of sub) {
        res.push([nums[i], ...arr]);
      }
    }
    return res;
  };

  return kSum(0, 4, target);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 003. 四数之和 =====");
console.log("方法1:", fourSum([1, 0, -1, 0, -2, 2], 0)); // 期望: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
console.log("方法1:", fourSum([2, 2, 2, 2, 2], 8)); // 期望: [[2,2,2,2]]
console.log("方法2:", fourSum2([1, 0, -1, 0, -2, 2], 0)); // 期望: [[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
console.log("方法2:", fourSum2([2, 2, 2, 2, 2], 8)); // 期望: [[2,2,2,2]]

export {};
