// ============================================================
// 170. 标记所有下标的最早秒数 II
// ============================================================
// LeetCode 3092. Most Frequent IDs (变形)
// 给定 changeIndices 和 changeIndices[min] 表示在哪个秒数可以标记该下标。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：二分 + 最小堆验证
function earliestSecondToMarkIndicesII(nums: number[], changeIndices: number[]): number {
  const n = nums.length;
  const m = changeIndices.length;
  if (m < n) return -1;
  const check = (lastSec: number): boolean => {
    // 检查前 lastSec 秒能否标记所有
    const lastSeen: Map<number, number> = new Map();
    for (let i = 0; i < lastSec; i++) {
      const idx = changeIndices[i] - 1;
      lastSeen.set(idx, i); // 每个下标最后出现的时间
    }
    if (lastSeen.size < n) return false;
    // 按最后出现时间排序
    const sorted: Array<[number, number]> = Array.from(lastSeen.entries()).sort((a, b) => a[1] - b[1]);
    let available = 0;
    let prevSec = -1;
    for (const [idx, sec] of sorted) {
      available += sec - prevSec - 1; // 这段时间可以减少
      if (available < nums[idx]) return false;
      available -= nums[idx];
      prevSec = sec;
    }
    return true;
  };
  let lo = n, hi = m;
  let result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (check(mid)) {
      result = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return result;
}

// 方法2：二分 + 堆验证
function earliestSecondToMarkIndicesIIHeap(nums: number[], changeIndices: number[]): number {
  const n = nums.length;
  const m = changeIndices.length;
  if (m < n) return -1;
  const check = (lastSec: number): boolean => {
    const lastSeen: Map<number, number> = new Map();
    for (let i = 0; i < lastSec; i++) {
      const idx = changeIndices[i] - 1;
      lastSeen.set(idx, i);
    }
    if (lastSeen.size < n) return false;
    // 用最小堆维护需要减1的操作
    const heap: Array<[number, number]> = [];
    for (const [idx, sec] of lastSeen) {
      heap.push([sec, nums[idx]]);
      let i = heap.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heap[i][0] < heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
        else break;
      }
    }
    let time = 0;
    while (heap.length > 0) {
      const [sec, cost] = heap[0];
      heap[0] = heap[heap.length - 1];
      heap.pop();
      let i = 0;
      const len = heap.length;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < len && heap[l][0] < heap[s][0]) s = l;
        if (r < len && heap[r][0] < heap[s][0]) s = r;
        if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
        else break;
      }
      if (time + cost > sec) return false;
      time += cost + 1;
    }
    return true;
  };
  let lo = n, hi = m;
  let result = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (check(mid)) {
      result = mid;
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 170. 标记所有下标的最早秒数 II =====");
console.log("二分:", earliestSecondToMarkIndicesII([2, 2, 0], [2, 2, 2, 2, 3, 2, 2, 1])); // 期望 7
console.log("二分:", earliestSecondToMarkIndicesIIHeap([1, 3], [1, 1, 1, 2, 1, 1, 1])); // 期望 -1

export {};
