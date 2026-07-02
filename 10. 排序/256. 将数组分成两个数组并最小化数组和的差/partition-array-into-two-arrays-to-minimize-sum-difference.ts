// ============================================================
// 256. 将数组分成两个数组并最小化数组和的差
// ============================================================
// LeetCode 2035. Partition Array Into Two Arrays to Minimize Sum Difference
// 给定 2n 个元素的数组（n <= 15），分成两个长度均为 n 的数组，
// 最小化 |sum1 - sum2|。

// 方法1：折半查找：左右各 n 个，按子集大小生成所有子集和 + 排序 + 双指针找最接近 total/2
// 时间复杂度 O(n * 2^n)
function minimumDifference1(nums: number[]): number {
  const m = nums.length;
  const n = m >> 1;
  const total = nums.reduce((a, b) => a + b, 0);
  const half = total / 2;
  // left[k] 表示左半边大小为 k 的子集和列表
  const left: number[][] = Array.from({ length: n + 1 }, () => []);
  const right: number[][] = Array.from({ length: n + 1 }, () => []);
  for (let mask = 0; mask < 1 << n; mask++) {
    let sumL = 0;
    let sumR = 0;
    let k = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sumL += nums[i];
        sumR += nums[i + n];
        k++;
      }
    }
    left[k].push(sumL);
    right[k].push(sumR);
  }
  for (let k = 0; k <= n; k++) {
    left[k].sort((a, b) => a - b);
    right[k].sort((a, b) => a - b);
  }
  let best = Infinity;
  for (let k = 0; k <= n; k++) {
    // 取左 k 个 + 右 n-k 个，和为 s，目标 s 接近 half
    const L = left[k];
    const R = right[n - k];
    // 双指针：L 升序，R 降序扫描
    let i = 0;
    let j = R.length - 1;
    while (i < L.length && j >= 0) {
      const s = L[i] + R[j];
      const diff = Math.abs(total - 2 * s);
      if (diff < best) best = diff;
      if (s < half) i++;
      else if (s > half) j--;
      else return 0;
    }
  }
  return best;
}

// 方法2：折半查找 + 对右侧子集和排序后二分查找最接近 half - leftSum 的值
// 时间复杂度 O(n * 2^n * log(2^n))
function minimumDifference2(nums: number[]): number {
  const m = nums.length;
  const n = m >> 1;
  const total = nums.reduce((a, b) => a + b, 0);
  const half = total / 2;
  const left: number[][] = Array.from({ length: n + 1 }, () => []);
  const right: number[][] = Array.from({ length: n + 1 }, () => []);
  for (let mask = 0; mask < 1 << n; mask++) {
    let sumL = 0;
    let sumR = 0;
    let k = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sumL += nums[i];
        sumR += nums[i + n];
        k++;
      }
    }
    left[k].push(sumL);
    right[k].push(sumR);
  }
  for (let k = 0; k <= n; k++) right[k].sort((a, b) => a - b);
  let best = Infinity;
  function update(s: number): void {
    const diff = Math.abs(total - 2 * s);
    if (diff < best) best = diff;
  }
  function lowerBound(arr: number[], target: number): number {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
  for (let k = 0; k <= n; k++) {
    const L = left[k];
    const R = right[n - k];
    for (const lv of L) {
      const target = half - lv;
      const idx = lowerBound(R, target);
      if (idx < R.length) update(lv + R[idx]);
      if (idx > 0) update(lv + R[idx - 1]);
      if (best === 0) return 0;
    }
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 256. 将数组分成两个数组并最小化数组和的差 =====");
console.log("方法1 [3,9,7,3]:", minimumDifference1([3, 9, 7, 3]));
console.log("方法1 [-36,36]:", minimumDifference1([-36, 36]));
console.log("方法1 [2,-1,0,4,-2,-9]:", minimumDifference1([2, -1, 0, 4, -2, -9]));
console.log("方法2 [3,9,7,3]:", minimumDifference2([3, 9, 7, 3]));
console.log("方法2 [-36,36]:", minimumDifference2([-36, 36]));
console.log("方法2 [2,-1,0,4,-2,-9]:", minimumDifference2([2, -1, 0, 4, -2, -9]));

export {};
