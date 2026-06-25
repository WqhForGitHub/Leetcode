// ============================================================
// 03. 删除有序数组中的重复项
// ============================================================
// LeetCode 26. Remove Duplicates from Sorted Array
// 给定升序数组，原地删除重复元素，返回新长度。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：快慢双指针（推荐）
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 1; // 指向下一个待写入位置
  for (let fast = 1; fast < nums.length; fast++) {
    // 发现新元素（与前一个不同），写入 slow 位置
    if (nums[fast] !== nums[fast - 1]) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  return slow;
}

// 方法2：通用双指针（保留最多 k 个重复的变体，这里 k=1）
// 这种写法更通用，可扩展到保留 k 个重复元素的场景
function removeDuplicatesGeneral(nums: number[]): number {
  if (nums.length === 0) return 0;
  const k = 1; // 每个元素最多保留 1 个
  let slow = 0; // 下一个待写入位置
  for (let fast = 0; fast < nums.length; fast++) {
    // 前 k 个直接写入；或当前元素与倒数第 k 个不同则写入
    if (slow < k || nums[fast] !== nums[slow - k]) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  return slow;
}

// 辅助函数：截取数组前 len 个元素，用于测试展示
function sliceArr(nums: number[], len: number): number[] {
  return nums.slice(0, len);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 03. 删除有序数组中的重复项 =====");
let arr1 = [1, 1, 2];
let len1 = removeDuplicates(arr1);
console.log("快慢双指针 [1,1,2] 长度:", len1, "结果:", sliceArr(arr1, len1)); // 期望结果 长度 2, [1,2]

let arr2 = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
let len2 = removeDuplicates(arr2);
console.log("快慢双指针 长度:", len2, "结果:", sliceArr(arr2, len2)); // 期望结果 长度 5, [0,1,2,3,4]

let arr3 = [1, 1, 2];
let len3 = removeDuplicatesGeneral(arr3);
console.log("通用双指针 [1,1,2] 长度:", len3, "结果:", sliceArr(arr3, len3)); // 期望结果 长度 2, [1,2]

let arr4: number[] = [];
let len4 = removeDuplicates(arr4);
console.log("空数组 长度:", len4); // 期望结果 0

export {};
