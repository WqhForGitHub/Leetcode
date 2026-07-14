// ============================================================
// 018. 滑动窗口中位数
// ============================================================
// LeetCode 480. Sliding Window Median
// 给定数组和窗口大小 k，返回每个滑动窗口的中位数数组。
// 时间复杂度：O(N * k)，空间复杂度：O(k)

// 方法1：双堆 + 延迟删除
function medianSlidingWindow(nums: number[], k: number): number[] {
  // 大根堆存较小一半，小根堆存较大一半
  const lo: number[] = []; // max-heap (用负数模拟)
  const hi: number[] = []; // min-heap
  const balance: Map<number, number> = new Map();
  const pushLo = (v: number): void => {
    lo.push(v);
    let i = lo.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (lo[i] > lo[p]) {
        [lo[i], lo[p]] = [lo[p], lo[i]];
        i = p;
      } else break;
    }
  };
  const popLo = (): number => {
    const top = lo[0];
    const last = lo.pop()!;
    if (lo.length > 0) {
      lo[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < lo.length && lo[l] > lo[s]) s = l;
        if (r < lo.length && lo[r] > lo[s]) s = r;
        if (s !== i) {
          [lo[i], lo[s]] = [lo[s], lo[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  const pushHi = (v: number): void => {
    hi.push(v);
    let i = hi.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (hi[i] < hi[p]) {
        [hi[i], hi[p]] = [hi[p], hi[i]];
        i = p;
      } else break;
    }
  };
  const popHi = (): number => {
    const top = hi[0];
    const last = hi.pop()!;
    if (hi.length > 0) {
      hi[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < hi.length && hi[l] < hi[s]) s = l;
        if (r < hi.length && hi[r] < hi[s]) s = r;
        if (s !== i) {
          [hi[i], hi[s]] = [hi[s], hi[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  const result: number[] = [];
  const prune = (heap: number[], isLo: boolean): void => {
    while (heap.length > 0) {
      const top = heap[0];
      const cnt = balance.get(top) ?? 0;
      if (cnt > 0) {
        balance.set(top, cnt - 1);
        if (isLo) popLo();
        else popHi();
      } else break;
    }
  };
  for (let i = 0; i < nums.length; i++) {
    // 插入
    if (lo.length === 0 || nums[i] <= lo[0]) {
      pushLo(nums[i]);
    } else {
      pushHi(nums[i]);
    }
    // 平衡
    while (lo.length > hi.length + 1) pushHi(popLo());
    while (hi.length > lo.length) pushLo(popHi());
    // 滑出窗口
    if (i >= k) {
      const out = nums[i - k];
      balance.set(out, (balance.get(out) ?? 0) + 1);
      if (out <= lo[0]) {
        // 删的是 lo 堆元素
        prune(lo, true);
        if (hi.length > lo.length) pushLo(popHi());
      } else {
        prune(hi, false);
        if (lo.length > hi.length + 1) pushHi(popLo());
      }
    }
    // 计算中位数
    if (i >= k - 1) {
      if (k % 2 === 1) result.push(lo[0]);
      else result.push((lo[0] + hi[0]) / 2);
    }
  }
  return result;
}

// 方法2：排序模拟（简洁）
function medianSlidingWindowSort(nums: number[], k: number): number[] {
  const result: number[] = [];
  for (let i = 0; i + k <= nums.length; i++) {
    const w = nums.slice(i, i + k).sort((a, b) => a - b);
    if (k % 2 === 1) result.push(w[(k - 1) >> 1]);
    else result.push((w[k / 2 - 1] + w[k / 2]) / 2);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 018. 滑动窗口中位数 =====");
console.log("排序模拟:", medianSlidingWindowSort([1, 3, -1, -3, 5, 3, 6, 7], 3)); // 期望 [1,-1,-1,3,5,6]
console.log("双堆:", medianSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // 期望 [1,-1,-1,3,5,6]

export {};
