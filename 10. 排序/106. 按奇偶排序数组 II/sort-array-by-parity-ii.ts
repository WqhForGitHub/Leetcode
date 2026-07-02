// ============================================================
// 106. 按奇偶排序数组 II
// ============================================================
// LeetCode 922. Sort Array By Parity II
// 数组长度为偶数，其中一半偶数一半奇数。重排使偶数下标放偶数、奇数下标放奇数。

// 方法1：双指针（推荐，O(n) 时间，O(1) 空间）
// i 指向偶数下标，j 指向奇数下标。找到各自错位的元素后交换。
function sortArrayByParityII(nums: number[]): number[] {
  const n = nums.length;
  let i = 0; // 偶数下标指针
  let j = 1; // 奇数下标指针
  while (i < n && j < n) {
    // 找到偶数下标上的奇数（错位）
    while (i < n && nums[i] % 2 === 0) i += 2;
    // 找到奇数下标上的偶数（错位）
    while (j < n && nums[j] % 2 === 1) j += 2;
    if (i < n && j < n) {
      [nums[i], nums[j]] = [nums[j], nums[i]];
      i += 2;
      j += 2;
    }
  }
  return nums;
}

// 方法2：额外空间（O(n) 时间，O(n) 空间）
// 分别收集偶数和奇数，按对应位置填入结果数组。
function sortArrayByParityIIExtra(nums: number[]): number[] {
  const n = nums.length;
  const result = new Array<number>(n);
  let even = 0;
  let odd = 1;
  for (const x of nums) {
    if (x % 2 === 0) {
      result[even] = x;
      even += 2;
    } else {
      result[odd] = x;
      odd += 2;
    }
  }
  return result;
}

// 校验函数：偶数下标为偶数、奇数下标为奇数
function isValidParityII(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 !== i % 2) return false;
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 106. 按奇偶排序数组 II =====");
console.log(
  "双指针:",
  JSON.stringify(sortArrayByParityII([4, 2, 5, 7])),
  "合法?",
  isValidParityII(sortArrayByParityII([4, 2, 5, 7])),
); // 期望合法
console.log(
  "双指针:",
  JSON.stringify(sortArrayByParityII([2, 3])),
  "合法?",
  isValidParityII(sortArrayByParityII([2, 3])),
); // 期望合法
console.log(
  "额外空间:",
  JSON.stringify(sortArrayByParityIIExtra([4, 2, 5, 7])),
  "合法?",
  isValidParityII(sortArrayByParityIIExtra([4, 2, 5, 7])),
); // 期望合法
console.log(
  "额外空间:",
  JSON.stringify(sortArrayByParityIIExtra([2, 3])),
  "合法?",
  isValidParityII(sortArrayByParityIIExtra([2, 3])),
); // 期望合法

export {};
