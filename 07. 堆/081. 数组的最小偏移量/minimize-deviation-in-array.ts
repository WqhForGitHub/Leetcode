// ============================================================
// 081. 数组的最小偏移量
// ============================================================
// LeetCode 1675. Minimize Deviation in Array
// 数组中偶数可除以 2，奇数可乘 2，求最小化数组最大值与最小值之差。
// 时间复杂度：O(N log N log M)，空间复杂度：O(N)

// 方法1：最大堆（推荐）
function minimumDeviation(nums: number[]): number {
  const heap: number[] = [];
  const pushMax = (v: number): void => {
    heap.push(v);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] > heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const popMax = (): number => {
    const top = heap[0];
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < heap.length && heap[l] > heap[s]) s = l;
        if (r < heap.length && heap[r] > heap[s]) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  let minVal = Infinity;
  for (let i = 0; i < nums.length; i++) {
    // 奇数变偶数
    if (nums[i] % 2 === 1) nums[i] *= 2;
    pushMax(nums[i]);
    minVal = Math.min(minVal, nums[i]);
  }
  let result = Infinity;
  while (true) {
    const maxVal = popMax();
    result = Math.min(result, maxVal - minVal);
    if (maxVal % 2 === 1) break;
    const newVal = maxVal / 2;
    pushMax(newVal);
    minVal = Math.min(minVal, newVal);
  }
  return result;
}

// 方法2：有序集合（用排序数组模拟）
function minimumDeviationSort(nums: number[]): number {
  const arr: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    arr.push(nums[i] % 2 === 1 ? nums[i] * 2 : nums[i]);
  }
  arr.sort((a, b) => b - a);
  let result = arr[0] - arr[arr.length - 1];
  while (arr[0] % 2 === 0) {
    const v = arr[0] / 2;
    arr.shift();
    // 插入保持有序
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    arr.splice(lo, 0, v);
    result = Math.min(result, arr[0] - arr[arr.length - 1]);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 081. 数组的最小偏移量 =====");
console.log("最大堆:", minimumDeviation([1, 2, 3, 4])); // 期望 1
console.log("排序:", minimumDeviationSort([4, 1, 5, 20, 3])); // 期望 3

export {};
