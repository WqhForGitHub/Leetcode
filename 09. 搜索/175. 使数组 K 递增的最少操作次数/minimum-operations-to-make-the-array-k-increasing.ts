// ============================================================
// 175. 使数组 K 递增的最少操作次数
// ============================================================
// LeetCode 2111. Minimum Operations to Make the Array K-Increasing
// arr 满足 K-递增：arr[i-k] <= arr[i] 对所有 i >= k 成立。
// 每次操作可将一个元素改为任意值，求最少操作数。

// 方法1：对每个子序列求最长非递减子序列（LIS via 二分）
function kIncreasing(arr: number[], k: number): number {
  let result = 0;
  for (let i = 0; i < k; i++) {
    // 提取子序列 arr[i], arr[i+k], arr[i+2k], ...
    const subseq: number[] = [];
    for (let j = i; j < arr.length; j += k) {
      subseq.push(arr[j]);
    }
    // 最少操作数 = 子序列长度 - 最长非递减子序列长度
    result += subseq.length - lengthOfLNDS(subseq);
  }
  return result;
}

// 最长非递减子序列（允许相等），使用二分查找
function lengthOfLNDS(nums: number[]): number {
  const tails: number[] = [];
  for (const num of nums) {
    // 找第一个 > num 的位置（上界）
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (tails[mid] <= num) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(num);
    else tails[lo] = num;
  }
  return tails.length;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 175. 使数组 K 递增的最少操作次数 =====");
console.log("[5,4,3,2,1],1:", kIncreasing([5, 4, 3, 2, 1], 1)); // 4
console.log("[4,1,5,2,6,2],2:", kIncreasing([4, 1, 5, 2, 6, 2], 2)); // 0
console.log("[12,6,12,6,14,2,13,17,3,8,11,7,4,11,18,8,8,0],1:",
  kIncreasing([12, 6, 12, 6, 14, 2, 13, 17, 3, 8, 11, 7, 4, 11, 18, 8, 8, 0], 1)); // 12

export {};
