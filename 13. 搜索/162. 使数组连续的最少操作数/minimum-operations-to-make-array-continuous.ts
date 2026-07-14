// ============================================================
// 162. 使数组连续的最少操作数
// ============================================================
// LeetCode 2009. Minimum Number of Operations to Make Array Continuous
// 每次操作可将一个元素替换为任意整数，使数组连续（所有元素唯一且 max-min=n-1）。
// 返回最少操作数。

// 方法1：排序 + 去重 + 滑动窗口（二分）
function minOperations(nums: number[]): number {
  const n = nums.length;
  // 去重并排序
  const unique = [...new Set(nums)].sort((a, b) => a - b);
  const m = unique.length;
  let result = n;
  for (let i = 0; i < m; i++) {
    // 以 unique[i] 为最小值，最大值应为 unique[i] + n - 1
    const target = unique[i] + n - 1;
    // 二分找右边界：最后一个 <= target 的位置
    let lo = i;
    let hi = m - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (unique[mid] <= target) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    // [i, lo] 范围内的元素已经在窗口内，不需要操作
    const alreadyIn = lo - i + 1;
    result = Math.min(result, n - alreadyIn);
  }
  return result;
}

// 方法2：双指针滑动窗口
function minOperationsSliding(nums: number[]): number {
  const n = nums.length;
  const unique = [...new Set(nums)].sort((a, b) => a - b);
  const m = unique.length;
  let result = n;
  let j = 0;
  for (let i = 0; i < m; i++) {
    while (j < m && unique[j] <= unique[i] + n - 1) {
      j++;
    }
    // 窗口 [i, j-1] 中的元素都满足要求
    const count = j - i;
    result = Math.min(result, n - count);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 162. 使数组连续的最少操作数 =====");
console.log("二分 [4,2,5,3]:", minOperations([4, 2, 5, 3])); // 0
console.log("二分 [1,10,100,1000]:", minOperations([1, 10, 100, 1000])); // 3
console.log("二分 [1,1,1,1]:", minOperations([1, 1, 1, 1])); // 3
console.log("双指针 [4,2,5,3]:", minOperationsSliding([4, 2, 5, 3])); // 0
console.log("双指针 [1,10,100,1000]:", minOperationsSliding([1, 10, 100, 1000])); // 3

export {};
