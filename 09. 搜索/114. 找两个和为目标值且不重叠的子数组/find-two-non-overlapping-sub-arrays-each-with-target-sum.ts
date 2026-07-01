// ============================================================
// 114. 找两个和为目标值且不重叠的子数组
// ============================================================
// LeetCode 1477. Find Two Non-overlapping Sub-arrays Each With Target Sum
// 找两个不重叠且和为 target 的子数组，使长度之和最小。

// 方法1：前缀和 + 前后缀最小
function minSumOfLengths(arr: number[], target: number): number {
  const n = arr.length;
  // prefix[i] = arr[0..i-1] 中和为 target 的最短子数组长度
  const prefix = new Array(n + 1).fill(Infinity);
  // suffix[i] = arr[i..n-1] 中和为 target 的最短子数组长度
  const suffix = new Array(n + 1).fill(Infinity);

  // 计算前缀
  let left = 0;
  let sum = 0;
  for (let right = 0; right < n; right++) {
    sum += arr[right];
    while (sum > target) {
      sum -= arr[left++];
    }
    if (sum === target) {
      prefix[right + 1] = Math.min(prefix[right], right - left + 1);
    } else {
      prefix[right + 1] = prefix[right];
    }
  }

  // 计算后缀
  let right = n - 1;
  sum = 0;
  for (let l = n - 1; l >= 0; l--) {
    sum += arr[l];
    while (sum > target) {
      sum -= arr[right--];
    }
    if (sum === target) {
      suffix[l] = Math.min(suffix[l + 1], right - l + 1);
    } else {
      suffix[l] = suffix[l + 1];
    }
  }

  let result = Infinity;
  for (let i = 1; i <= n; i++) {
    if (prefix[i] !== Infinity && suffix[i] !== Infinity) {
      result = Math.min(result, prefix[i] + suffix[i]);
    }
  }
  return result === Infinity ? -1 : result;
}

// 方法2：哈希表 + 前缀和
function minSumOfLengthsHash(arr: number[], target: number): number {
  const n = arr.length;
  // best[i] = arr[0..i-1] 中和为 target 的最短子数组长度
  const best = new Array(n + 1).fill(Infinity);
  let prefixSum = 0;
  const sumIndex = new Map<number, number>();
  sumIndex.set(0, -1);
  let result = Infinity;

  for (let i = 0; i < n; i++) {
    prefixSum += arr[i];
    if (sumIndex.has(prefixSum - target)) {
      const prevIdx = sumIndex.get(prefixSum - target)!;
      const len = i - prevIdx;
      best[i + 1] = Math.min(best[i], len);
      if (best[prevIdx + 1] !== Infinity) {
        result = Math.min(result, len + best[prevIdx + 1]);
      }
    } else {
      best[i + 1] = best[i];
    }
    sumIndex.set(prefixSum, i);
  }
  return result === Infinity ? -1 : result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 114. 找两个和为目标值且不重叠的子数组 =====");
console.log("前后缀 [3,2,2,4,3],3:", minSumOfLengths([3, 2, 2, 4, 3], 3)); // 2
console.log("前后缀 [7,3,4,7],7:", minSumOfLengths([7, 3, 4, 7], 7)); // 2
console.log("前后缀 [4,3,2,6,2,3,4],6:", minSumOfLengths([4, 3, 2, 6, 2, 3, 4], 6)); // -1
console.log("哈希 [7,3,4,7],7:", minSumOfLengthsHash([7, 3, 4, 7], 7)); // 2

export {};
