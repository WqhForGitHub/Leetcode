// ============================================================
// 04. 移除元素
// ============================================================
// LeetCode 27. Remove Element
// 原地移除数组中所有值为 val 的元素，返回新长度。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：双指针-从头扫描（推荐）
// slow 指向下一个待写入位置，fast 遍历整个数组
function removeElement(nums: number[], val: number): number {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) {
      nums[slow] = nums[fast];
      slow++;
    }
  }
  return slow;
}

// 方法2：双指针-首尾交换
// 当要删除的元素较少时更高效，避免不必要的赋值
function removeElementSwap(nums: number[], val: number): number {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    if (nums[left] === val) {
      // 用末尾元素覆盖当前元素，right 左移
      nums[left] = nums[right - 1];
      right--;
    } else {
      left++;
    }
  }
  return left;
}

// 辅助函数：截取数组前 len 个元素，用于测试展示
function sliceArr(nums: number[], len: number): number[] {
  return nums.slice(0, len);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 04. 移除元素 =====");
const arr1 = [3, 2, 2, 3];
const len1 = removeElement(arr1, 3);
console.log("从头扫描 [3,2,2,3] 移除3:", len1, "结果:", sliceArr(arr1, len1)); // 期望结果 2, [2,2]

const arr2 = [0, 1, 2, 2, 3, 0, 4, 2];
const len2 = removeElement(arr2, 2);
console.log("从头扫描 移除2:", len2, "结果:", sliceArr(arr2, len2)); // 期望结果 5, [0,1,3,0,4]

const arr3 = [3, 2, 2, 3];
const len3 = removeElementSwap(arr3, 3);
console.log("首尾交换 [3,2,2,3] 移除3:", len3, "结果:", sliceArr(arr3, len3)); // 期望结果 2

const arr4 = [0, 1, 2, 2, 3, 0, 4, 2];
const len4 = removeElementSwap(arr4, 2);
console.log("首尾交换 移除2:", len4, "结果:", sliceArr(arr4, len4)); // 期望结果 5

export {};
