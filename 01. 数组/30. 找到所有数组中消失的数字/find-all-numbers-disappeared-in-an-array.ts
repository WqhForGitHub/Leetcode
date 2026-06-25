// ============================================================
// 30. 找到所有数组中消失的数字
// ============================================================
// LeetCode 448. Find All Numbers Disappeared in an Array
// 给定 n 个整数的数组，每个元素在 [1, n] 范围内，找出 [1, n] 中未出现的数字。
// 要求 O(n) 时间 O(1) 额外空间。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：原地标记-取负（推荐）
function findDisappearedNumbers(nums: number[]): number[] {
  const result: number[] = [];
  // 第一遍：把每个值当作下标，将对应位置元素取负
  for (let i = 0; i < nums.length; i++) {
    const index = Math.abs(nums[i]) - 1;
    if (nums[index] > 0) {
      nums[index] = -nums[index];
    }
  }
  // 第二遍：仍为正数的位置，其下标+1 即为缺失的数字
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      result.push(i + 1);
    }
  }
  return result;
}

// 方法2：原地交换
function findDisappearedNumbersSwap(nums: number[]): number[] {
  const result: number[] = [];
  // 将每个数字交换到它"应该所在"的位置（值 x 放到下标 x-1）
  for (let i = 0; i < nums.length; i++) {
    while (nums[i] !== i + 1 && nums[i] !== nums[nums[i] - 1]) {
      const targetIndex = nums[i] - 1;
      [nums[i], nums[targetIndex]] = [nums[targetIndex], nums[i]];
    }
  }
  // 下标+1 与值不相等的位置，说明缺失该数字
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
      result.push(i + 1);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 30. 找到所有数组中消失的数字 =====");
console.log("描述:", findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // 期望结果: [5, 6]
console.log("描述:", findDisappearedNumbers([1, 1])); // 期望结果: [2]
console.log("描述:", findDisappearedNumbersSwap([4, 3, 2, 7, 8, 2, 3, 1])); // 期望结果: [5, 6]
console.log("描述:", findDisappearedNumbersSwap([1, 1])); // 期望结果: [2]

export {};
