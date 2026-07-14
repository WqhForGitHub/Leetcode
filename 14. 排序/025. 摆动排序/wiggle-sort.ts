// ============================================================
// 025. 摆动排序
// ============================================================
// LeetCode 280. Wiggle Sort
// 原地重排数组，使得 nums[0] <= nums[1] >= nums[2] <= nums[3]...

// 方法1：一次遍历交换（推荐，O(n) 时间，O(1) 空间）
// 思路：遍历相邻元素对，偶数下标保证 <= 右侧，奇数下标保证 >= 右侧；
// 不满足时直接交换。交换不会破坏已处理部分的关系。
function wiggleSort(nums: number[]): void {
  for (let i = 0; i < nums.length - 1; i++) {
    if (i % 2 === 0) {
      // 偶数下标：nums[i] <= nums[i + 1]
      if (nums[i] > nums[i + 1]) {
        [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
      }
    } else {
      // 奇数下标：nums[i] >= nums[i + 1]
      if (nums[i] < nums[i + 1]) {
        [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
      }
    }
  }
}

// 方法2：排序后交换相邻对（O(n log n) 时间，O(1) 空间）
// 思路：先升序排序，再从下标 1 开始，每两个元素交换一次。
function wiggleSortSorted(nums: number[]): void {
  nums.sort((a, b) => a - b);
  for (let i = 1; i < nums.length - 1; i += 2) {
    [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 025. 摆动排序 =====");

function isWiggle(nums: number[]): boolean {
  for (let i = 0; i < nums.length - 1; i++) {
    if (i % 2 === 0 && nums[i] > nums[i + 1]) return false;
    if (i % 2 === 1 && nums[i] < nums[i + 1]) return false;
  }
  return true;
}

const arr1 = [3, 5, 2, 1, 6, 4];
wiggleSort(arr1);
console.log("一次遍历交换 [3,5,2,1,6,4]:", arr1, "通过:", isWiggle(arr1)); // 期望：满足摆动条件

const arr2 = [3, 5, 2, 1, 6, 4];
wiggleSortSorted(arr2);
console.log("排序交换 [3,5,2,1,6,4]:", arr2, "通过:", isWiggle(arr2)); // 期望：满足摆动条件

const arr3 = [1, 2, 3, 4, 5];
wiggleSort(arr3);
console.log("一次遍历交换 [1,2,3,4,5]:", arr3, "通过:", isWiggle(arr3)); // 期望：满足摆动条件

export {};
