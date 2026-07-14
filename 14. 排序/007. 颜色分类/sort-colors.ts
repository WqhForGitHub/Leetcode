// ============================================================
// 007. 颜色分类
// ============================================================
// LeetCode 75. Sort Colors
// 给定包含红、白、蓝（0、1、2）的数组，原地对其进行排序，使相同颜色相邻。

// 方法1：荷兰国旗问题 / 三指针（推荐，时间 O(n)，单趟扫描，空间 O(1)）
function sortColors(nums: number[]): void {
  let low = 0; // 指向下一个 0 应放的位置
  let mid = 0; // 当前扫描位置
  let high = nums.length - 1; // 指向下一个 2 应放的位置

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      // nums[mid] === 2
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
      // 注意：mid 不动，因为交换过来的元素尚未判断
    }
  }
}

// 方法2：计数排序（时间 O(n)，两趟扫描，空间 O(1)）
function sortColors2(nums: number[]): void {
  let count0 = 0;
  let count1 = 0;
  let count2 = 0;

  for (const num of nums) {
    if (num === 0) count0++;
    else if (num === 1) count1++;
    else count2++;
  }

  let i = 0;
  while (count0-- > 0) nums[i++] = 0;
  while (count1-- > 0) nums[i++] = 1;
  while (count2-- > 0) nums[i++] = 2;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 007. 颜色分类 =====");
const test1 = [2, 0, 2, 1, 1, 0];
sortColors(test1);
console.log("方法1:", test1); // 期望: [0,0,1,1,2,2]

const test2 = [2, 0, 1];
sortColors(test2);
console.log("方法1:", test2); // 期望: [0,1,2]

const test3 = [2, 0, 2, 1, 1, 0];
sortColors2(test3);
console.log("方法2:", test3); // 期望: [0,0,1,1,2,2]

export {};
