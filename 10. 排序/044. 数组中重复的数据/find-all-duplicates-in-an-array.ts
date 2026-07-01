// ============================================================
// 044. 数组中重复的数据
// ============================================================
// LeetCode 442. Find All Duplicates in an Array
// 长度为 n 的数组，元素在 [1, n] 范围内，每个元素出现一次或两次。
// 找出所有出现两次的元素。要求 O(n) 时间，O(1) 额外空间。

// 方法1：下标取负标记（推荐，O(n) 时间，O(1) 空间）
// 遍历数组，用 |num|-1 作为下标，将该位置取负表示该数已出现过。
// 若该位置已为负，说明该数第二次出现，加入结果。
function findDuplicates_negation(nums: number[]): number[] {
  const result: number[] = [];

  for (const num of nums) {
    const idx = Math.abs(num) - 1;
    if (nums[idx] < 0) {
      // 该位置已被标记为负，说明 |num| 是第二次出现
      result.push(Math.abs(num));
    } else {
      nums[idx] = -nums[idx];
    }
  }

  // 恢复原数组（可选，便于复用）
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) nums[i] = -nums[i];
  }

  return result;
}

// 方法2：循环交换到正确位置（O(n) 时间，O(1) 空间）
// 把每个数交换到下标 num-1 的位置。若目标位置已是该数，说明重复。
function findDuplicates_cyclicSort(nums: number[]): number[] {
  const result: number[] = [];
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    // 当前位置的数不在正确位置时，尝试交换
    while (nums[i] !== i + 1) {
      const val = nums[i];
      const targetIdx = val - 1;
      // 目标位置已经是 val，说明 val 重复
      if (nums[targetIdx] === val) {
        break;
      }
      // 交换
      [nums[i], nums[targetIdx]] = [nums[targetIdx], nums[i]];
    }
  }

  // 交换完成后，未在正确位置的数即为重复数
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      result.push(nums[i]);
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 数组中重复的数据 =====");
console.log("取负标记 [4,3,2,7,8,2,3,1]:", findDuplicates_negation([4, 3, 2, 7, 8, 2, 3, 1])); // 期望: [2,3]（顺序可能不同）
console.log("取负标记 [1,1,2]:", findDuplicates_negation([1, 1, 2])); // 期望: [1]
console.log("取负标记 [1]:", findDuplicates_negation([1])); // 期望: []

console.log("循环交换 [4,3,2,7,8,2,3,1]:", findDuplicates_cyclicSort([4, 3, 2, 7, 8, 2, 3, 1])); // 期望: [2,3]
console.log("循环交换 [1,1,2]:", findDuplicates_cyclicSort([1, 1, 2])); // 期望: [1]
console.log("循环交换 [1]:", findDuplicates_cyclicSort([1])); // 期望: []

export {};
