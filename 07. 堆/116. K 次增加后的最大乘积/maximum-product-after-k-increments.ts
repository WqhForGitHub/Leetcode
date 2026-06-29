// ============================================================
// 116. K 次增加后的最大乘积
// ============================================================
// LeetCode 2233. Maximum Product After K Increments
// 对数组做 k 次 +1 操作，使乘积最大。
// 时间复杂度：O(N log N + k log N)，空间复杂度：O(N)

// 方法1：最小堆
function maximumProduct(nums: number[], k: number): number {
  const MOD = 1000000007;
  const heap: number[] = nums.slice();
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i] < heap[p]) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (i: number): void => {
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < n && heap[l] < heap[s]) s = l;
      if (r < n && heap[r] < heap[s]) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (let i = (heap.length >> 1) - 1; i >= 0; i--) siftDown(i);
  for (let i = 0; i < k; i++) {
    heap[0]++;
    siftDown(0);
  }
  let result = 1;
  for (const v of heap) {
    result = (result * v) % MOD;
  }
  return result;
}

// 方法2：排序模拟（低效）
function maximumProductSort(nums: number[], k: number): number {
  const MOD = 1000000007;
  const arr = nums.slice();
  for (let i = 0; i < k; i++) {
    arr.sort((a, b) => a - b);
    arr[0]++;
  }
  let result = 1;
  for (const v of arr) result = (result * v) % MOD;
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 116. K 次增加后的最大乘积 =====");
console.log("堆:", maximumProduct([0, 4], 5)); // 期望 20
console.log("堆:", maximumProduct([6, 3, 3, 2], 2)); // 期望 216

export {};
