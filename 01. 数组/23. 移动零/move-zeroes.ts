// ============================================================
// 23. 移动零
// ============================================================
// LeetCode 283. Move Zeroes
// 给定数组 nums，将所有 0 移动到末尾，同时保持非零元素的相对顺序。原地操作。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：双指针-快慢指针（推荐）
function moveZeroes(nums: number[]): void {
  let slow = 0; // 指向下一个非零元素应放置的位置
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  // 将剩余位置填 0
  for (let i = slow; i < nums.length; i++) {
    nums[i] = 0;
  }
}

// 方法2：双指针-交换法
function moveZeroesSwap(nums: number[]): void {
  let slow = 0; // 指向下一个非零元素应放置的位置
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== 0) {
      // 交换 nums[slow] 和 nums[fast]
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 23. 移动零 =====");
const test1 = [0, 1, 0, 3, 12];
moveZeroes(test1);
console.log("描述:", test1); // 期望结果: [1, 3, 12, 0, 0]

const test2 = [0, 1, 0, 3, 12];
moveZeroesSwap(test2);
console.log("描述:", test2); // 期望结果: [1, 3, 12, 0, 0]

const test3 = [0];
moveZeroes(test3);
console.log("描述:", test3); // 期望结果: [0]

export {};
