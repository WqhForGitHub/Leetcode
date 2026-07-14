// ============================================================
// 201. 特殊数组的特征值
// ============================================================
// LeetCode 1608. Special Array With X Elements Greater Than or Equal X
// 找出特征值 x，使得 nums 中恰好有 x 个元素 >= x。返回 x，不存在返回 -1。

// 方法1：排序 + 二分查找枚举 x（O(n log n)）
function specialArray(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  // 枚举 x 从 0 到 n
  for (let x = 0; x <= n; x++) {
    // 二分查找第一个 >= x 的位置
    let left = 0;
    let right = n;
    while (left < right) {
      const mid = (left + right) >> 1;
      if (nums[mid] >= x) right = mid;
      else left = mid + 1;
    }
    const count = n - left; // >= x 的元素个数
    if (count === x) return x;
  }
  return -1;
}

// 方法2：排序 + 一次遍历枚举 x（O(n log n)）
function specialArray2(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  // 对于 x，需要恰好 x 个元素 >= x
  // 即 nums[n-x] >= x 且 (n-x==0 或 nums[n-x-1] < x)
  for (let x = 1; x <= n; x++) {
    const idx = n - x;
    if (nums[idx] >= x && (idx === 0 || nums[idx - 1] < x)) {
      return x;
    }
  }
  // 检查 x = 0
  if (nums[n - 1] < 0) return 0;
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 201. 特殊数组的特征值 =====");
console.log("方法1:", specialArray([3, 5])); // 2
console.log("方法2:", specialArray2([3, 5])); // 2
console.log("方法1:", specialArray([0, 0])); // -1
console.log("方法2:", specialArray2([0, 0])); // -1
console.log("方法1:", specialArray([0, 4, 3, 0, 4])); // 3
console.log("方法2:", specialArray2([0, 4, 3, 0, 4])); // 3

export {};
