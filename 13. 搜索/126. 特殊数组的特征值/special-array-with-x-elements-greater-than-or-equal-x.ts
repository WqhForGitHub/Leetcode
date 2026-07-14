// ============================================================
// 126. 特殊数组的特征值
// ============================================================
// LeetCode 1608. Special Array With X Elements Greater Than or Equal X
// 找 x 使得数组中恰好有 x 个元素 >= x。

// 方法1：排序 + 二分查找
function specialArray(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  for (let x = 1; x <= n; x++) {
    // 二分找第一个 >= x 的位置
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (nums[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (nums[lo] >= x && n - lo === x) return x;
  }
  return -1;
}

// 方法2：排序 + 线性扫描
function specialArrayLinear(nums: number[]): number {
  nums.sort((a, b) => a - b);
  const n = nums.length;
  for (let x = 1; x <= n; x++) {
    // 找第一个 >= x 的元素
    let i = 0;
    while (i < n && nums[i] < x) i++;
    if (n - i === x) return x;
  }
  return -1;
}

// 方法3：计数排序
function specialArrayCount(nums: number[]): number {
  const n = nums.length;
  const count = new Array(n + 1).fill(0);
  for (const num of nums) {
    count[Math.min(num, n)]++;
  }
  let total = 0;
  for (let x = n; x >= 0; x--) {
    total += count[x];
    if (total === x) return x;
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 126. 特殊数组的特征值 =====");
console.log("二分 [3,5]:", specialArray([3, 5])); // 2
console.log("二分 [0,0]:", specialArray([0, 0])); // -1
console.log("二分 [0,4,3,0,4]:", specialArray([0, 4, 3, 0, 4])); // 3
console.log("计数 [3,6,7,7,0]:", specialArrayCount([3, 6, 7, 7, 0])); // -1

export {};
