// ============================================================
// 154. 转变数组后最接近目标值的数组和
// ============================================================
// LeetCode 1300. Sum of Mutated Array Closest to Target
// 选择一个 value，将数组中所有大于 value 的元素替换为 value，
// 使数组和最接近 target，返回该 value（相同差值取较小者）。

// 方法1：排序 + 前缀和 + 分段求解（O(n log n)）
// 排序后，对每一段 [arr[i-1], arr[i]]，数组和是关于 value 的线性函数，
// 直接解方程 prefix + (n - i) * value = target，比较候选值。
function findBestValue(arr: number[], target: number): number {
  arr.sort((a, b) => a - b);
  const n = arr.length;
  let prefix = 0;
  for (let i = 0; i < n; i++) {
    const rest = n - i;
    // 该段内 sum(value) = prefix + rest * value，解出 value = (target - prefix) / rest
    const t = (target - prefix) / rest;
    if (t < arr[i]) {
      // 最优点落在当前段内
      const lower = i > 0 ? arr[i - 1] : 0;
      let v = Math.floor(t);
      if (v < lower) v = lower;
      if (v > arr[i]) v = arr[i];
      // 比较 v 与 v+1，取更接近者（差值相同时取较小）
      const sumV = prefix + rest * v;
      const sumV1 = prefix + rest * (v + 1);
      if (Math.abs(sumV - target) <= Math.abs(sumV1 - target)) {
        return v;
      }
      return v + 1;
    }
    prefix += arr[i];
  }
  // target 不小于总和，取最大元素即可
  return arr[n - 1];
}

// 方法2：枚举值 + 前缀和 + 二分（O(maxVal * log n)）
// 枚举 0..arr 最大值，二分找到第一个大于 value 的位置计算数组和。
function findBestValue2(arr: number[], target: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + sorted[i];

  let ans = 0;
  let minDiff = Infinity;
  const maxVal = sorted[n - 1];
  for (let v = 0; v <= maxVal; v++) {
    // 二分找第一个 > v 的下标
    let lo = 0;
    let hi = n;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] > v) hi = mid;
      else lo = mid + 1;
    }
    const sum = prefix[lo] + (n - lo) * v;
    const d = Math.abs(sum - target);
    if (d < minDiff) {
      minDiff = d;
      ans = v;
    }
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 154. 转变数组后最接近目标值的数组和 =====");
console.log("方法1 [4,9,3], target=10:", findBestValue([4, 9, 3], 10)); // 3
console.log("方法1 [2,3,5], target=10:", findBestValue([2, 3, 5], 10)); // 5
console.log("方法1 [60864,25176,32091,14585,60817,22329,90980], target=54703:", findBestValue([60864, 25176, 32091, 14585, 60817, 22329, 90980], 54703)); // 7815 (sum=54705, diff=2)
console.log("方法2 [4,9,3], target=10:", findBestValue2([4, 9, 3], 10)); // 3
console.log("方法2 [2,3,5], target=10:", findBestValue2([2, 3, 5], 10)); // 5
console.log("方法2 [60864,25176,32091,14585,60817,22329,90980], target=54703:", findBestValue2([60864, 25176, 32091, 14585, 60817, 22329, 90980], 54703)); // 7815

export {};
