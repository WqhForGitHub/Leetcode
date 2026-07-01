// ============================================================
// 106. 转变数组后最接近目标值的数组和
// ============================================================
// LeetCode 1300. Sum of Mutated Array Closest to Target
// 将数组中大于 value 的元素变为 value，使数组和最接近 target，返回 value。

// 方法1：二分查找
function findBestValue(arr: number[], target: number): number {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
  }
  let lo = 0;
  let hi = arr[n - 1];
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    // 计算 value = mid 时的数组和
    const sum = calculateSum(arr, prefix, mid);
    if (sum < target) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  // 比较 lo 和 lo-1 哪个更接近
  const sum1 = calculateSum(arr, prefix, lo);
  const sum2 = calculateSum(arr, prefix, lo - 1);
  if (Math.abs(sum2 - target) <= Math.abs(sum1 - target)) {
    return lo - 1;
  }
  return lo;
}

function calculateSum(arr: number[], prefix: number[], value: number): number {
  // 二分找第一个 > value 的位置
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] <= value) lo = mid + 1;
    else hi = mid;
  }
  return prefix[lo] + (arr.length - lo) * value;
}

// 方法2：枚举 + 二分查找优化
function findBestValueEnum(arr: number[], target: number): number {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  let bestValue = 0;
  let bestDiff = Infinity;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    // value 在 arr[i-1] 到 arr[i] 范围内
    const remaining = n - i;
    let value;
    if (i === n) {
      value = arr[n - 1];
    } else {
      value = Math.floor((target - sum) / remaining);
    }
    value = Math.max(value, i > 0 ? arr[i - 1] : 0);
    if (i < n) value = Math.min(value, arr[i]);
    const currentSum = sum + remaining * value;
    const diff = Math.abs(currentSum - target);
    if (diff < bestDiff || (diff === bestDiff && value < bestValue)) {
      bestDiff = diff;
      bestValue = value;
    }
    if (i < n) sum += arr[i];
  }
  return bestValue;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 106. 转变数组后最接近目标值的数组和 =====");
console.log("二分 [4,9,3],10:", findBestValue([4, 9, 3], 10)); // 3
console.log("二分 [2,3,5],10:", findBestValue([2, 3, 5], 10)); // 5
console.log("二分 [60864,25176,36908,9978,22746,18703],56803:", findBestValue([60864, 25176, 36908, 9978, 22746, 18703], 56803)); // 11361

export {};
