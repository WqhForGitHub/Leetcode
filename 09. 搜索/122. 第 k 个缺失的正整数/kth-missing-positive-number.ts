// ============================================================
// 122. 第 k 个缺失的正整数
// ============================================================
// LeetCode 1539. Kth Missing Positive Number
// 升序数组中第 k 个缺失的正整数。

// 方法1：二分查找
function findKthPositive(arr: number[], k: number): number {
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    // arr[mid] 之前缺失的正整数个数 = arr[mid] - mid - 1
    if (arr[mid] - mid - 1 < k) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  // left 是第一个缺失数 >= k 的位置
  // arr[right] 之前缺失了 arr[right]-right-1 个，还需 k-(arr[right]-right-1) 个
  // 结果 = right + k + 1（当 right >= 0）
  // 更简单：left 表示在 arr 中 left 之前的数都满足缺失 < k
  // 所以答案 = left + k
  return left + k;
}

// 方法2：线性扫描
function findKthPositiveLinear(arr: number[], k: number): number {
  let missing = 0;
  let current = 1;
  let i = 0;
  while (true) {
    if (i < arr.length && arr[i] === current) {
      i++;
    } else {
      missing++;
      if (missing === k) return current;
    }
    current++;
  }
}

// 方法3：暴力枚举
function findKthPositiveBrute(arr: number[], k: number): number {
  const set = new Set(arr);
  let count = 0;
  for (let i = 1; ; i++) {
    if (!set.has(i)) {
      count++;
      if (count === k) return i;
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 122. 第 k 个缺失的正整数 =====");
console.log("二分 [2,3,4,7,11],5:", findKthPositive([2, 3, 4, 7, 11], 5)); // 9
console.log("二分 [1,2,3,4],2:", findKthPositive([1, 2, 3, 4], 2)); // 6
console.log("线性 [2,3,4,7,11],5:", findKthPositiveLinear([2, 3, 4, 7, 11], 5)); // 9

export {};
