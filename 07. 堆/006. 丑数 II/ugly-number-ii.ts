// ============================================================
// 006. 丑数 II
// ============================================================
// LeetCode 264. Ugly Number II
// 给你一个整数 n ，请你找出并返回第 n 个丑数。丑数只包含质因数 2、3 和 5。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

class MinHeap {
  private heap: number[] = [];
  private set: Set<number> = new Set();
  get size(): number {
    return this.heap.length;
  }
  peek(): number | undefined {
    return this.heap[0];
  }
  push(v: number): boolean {
    if (this.set.has(v)) return false;
    this.set.add(v);
    this.heap.push(v);
    this.siftUp(this.heap.length - 1);
    return true;
  }
  pop(): number | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    this.set.delete(top);
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return top;
  }
  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[i] < this.heap[p]) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
  }
  private siftDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.heap[l] < this.heap[s]) s = l;
      if (r < n && this.heap[r] < this.heap[s]) s = r;
      if (s !== i) {
        [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]];
        i = s;
      } else break;
    }
  }
}

// 方法1：最小堆（推荐）
function nthUglyNumber(n: number): number {
  const heap = new MinHeap();
  heap.push(1);
  const factors = [2, 3, 5];
  let ugly = 1;
  for (let i = 0; i < n; i++) {
    ugly = heap.pop()!;
    for (const f of factors) heap.push(ugly * f);
  }
  return ugly;
}

// 方法2：三指针 DP
function nthUglyNumberDP(n: number): number {
  const dp: number[] = [1];
  let p2 = 0,
    p3 = 0,
    p5 = 0;
  for (let i = 1; i < n; i++) {
    const v2 = dp[p2] * 2;
    const v3 = dp[p3] * 3;
    const v5 = dp[p5] * 5;
    const next = Math.min(v2, v3, v5);
    dp.push(next);
    if (next === v2) p2++;
    if (next === v3) p3++;
    if (next === v5) p5++;
  }
  return dp[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 006. 丑数 II =====");
console.log("最小堆:", nthUglyNumber(10)); // 期望 12
console.log("DP:", nthUglyNumberDP(10)); // 期望 12

export {};
