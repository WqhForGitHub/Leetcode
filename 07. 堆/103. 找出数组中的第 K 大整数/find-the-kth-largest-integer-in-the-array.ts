// ============================================================
// 103. 找出数组中的第 K 大整数
// ============================================================
// LeetCode 1985. Find the Kth Largest Integer in the Array
// 字符串表示的大整数，找第 k 大。
// 时间复杂度：O(N log N)，空间复杂度：O(1)

// 方法1：最小堆（按字符串长度和字典序比较）
function kthLargestNumber(nums: string[], k: number): string {
  const compare = (a: string, b: string): number => {
    if (a.length !== b.length) return a.length - b.length;
    return a < b ? -1 : a > b ? 1 : 0;
  };
  const heap: string[] = [];
  const siftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (compare(heap[i], heap[p]) < 0) {
        [heap[i], heap[p]] = [heap[p], heap[i]];
        i = p;
      } else break;
    }
  };
  const siftDown = (i: number): void => {
    const n = heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && compare(heap[l], heap[s]) < 0) s = l;
      if (r < n && compare(heap[r], heap[s]) < 0) s = r;
      if (s !== i) {
        [heap[i], heap[s]] = [heap[s], heap[i]];
        i = s;
      } else break;
    }
  };
  for (const num of nums) {
    heap.push(num);
    siftUp(heap.length - 1);
    if (heap.length > k) {
      const last = heap.pop()!;
      heap[0] = last;
      siftDown(0);
    }
  }
  return heap[0];
}

// 方法2：快速选择
function kthLargestNumberQuick(nums: string[], k: number): string {
  const compare = (a: string, b: string): number => {
    if (a.length !== b.length) return a.length - b.length;
    return a < b ? -1 : a > b ? 1 : 0;
  };
  const partition = (lo: number, hi: number): number => {
    const pivot = nums[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      if (compare(nums[j], pivot) > 0) {
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
      }
    }
    [nums[i], nums[hi]] = [nums[hi], nums[i]];
    return i;
  };
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const p = partition(lo, hi);
    if (p === k - 1) return nums[p];
    if (p < k - 1) lo = p + 1;
    else hi = p - 1;
  }
  return nums[lo];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 103. 找出数组中的第 K 大整数 =====");
console.log("堆:", kthLargestNumber(["3", "6", "7", "10"], 4)); // 期望 "3"
console.log("快选:", kthLargestNumberQuick(["2", "21", "12", "1"], 3)); // 期望 "2"

export {};
