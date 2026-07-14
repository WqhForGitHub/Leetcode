// ============================================================
// 245. 构造元素不等于两相邻元素平均值的数组
// ============================================================
// LeetCode 1968. Array With Elements Not Equal to Average of Neighbors
// 重排数组 nums，使得对所有内部位置 i，nums[i] != (nums[i-1] + nums[i+1]) / 2。

// 方法1：排序 + 交错放置小半和大半（O(n log n)）
function rearrangeArray(nums: number[]): number[] {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  const result = new Array<number>(n);
  // 小半放在偶数下标，大半放在奇数下标
  let left = 0;
  let right = Math.floor((n + 1) / 2);
  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      result[i] = nums[left];
      left++;
    } else {
      result[i] = nums[right];
      right++;
    }
  }
  return result;
}

// 方法2：排序 + 相邻交换（O(n log n)）
// 排序后每隔一个交换相邻元素，使局部不满足平均值条件
function rearrangeArray2(nums: number[]): number[] {
  nums.sort((a, b) => a - b);
  for (let i = 1; i < nums.length - 1; i += 2) {
    [nums[i], nums[i + 1]] = [nums[i + 1], nums[i]];
  }
  return nums;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 245. 构造元素不等于两相邻元素平均值的数组 =====");
const test1 = [1, 2, 3, 4, 5];
const r1 = rearrangeArray([...test1]);
console.log("方法1:", r1, "有效:", isValid(r1));
const r2 = rearrangeArray2([...test1]);
console.log("方法2:", r2, "有效:", isValid(r2));

function isValid(arr: number[]): boolean {
  for (let i = 1; i < arr.length - 1; i++) {
    if (arr[i] * 2 === arr[i - 1] + arr[i + 1]) return false;
  }
  return true;
}

export {};
