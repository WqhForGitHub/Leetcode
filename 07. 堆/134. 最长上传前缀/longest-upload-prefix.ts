// ============================================================
// 134. 最长上传前缀
// ============================================================
// LeetCode 2424. Longest Upload Prefix
// 依次上传视频到指定下标，查询从1开始的最长连续前缀长度。
// 时间复杂度：upload O(1) amortized，longest O(1)

// 方法1：贪心 + 并查集
class LUPrefix {
  private n: number;
  private uploaded: Set<number>;
  private prefix: number;

  constructor(n: number) {
    this.n = n;
    this.uploaded = new Set();
    this.prefix = 0;
  }

  upload(video: number): void {
    this.uploaded.add(video);
    while (this.uploaded.has(this.prefix + 1)) {
      this.prefix++;
    }
  }

  longest(): number {
    return this.prefix;
  }
}

// 方法2：最小堆
class LUPrefixHeap {
  private n: number;
  private heap: number[];
  private prefix: number;

  constructor(n: number) {
    this.n = n;
    this.heap = [];
    this.prefix = 0;
  }

  upload(video: number): void {
    this.heap.push(video);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.heap[i] < this.heap[p]) {
        [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
        i = p;
      } else break;
    }
    while (this.heap.length > 0 && this.heap[0] <= this.prefix + 1) {
      const min = this.heap[0];
      this.heap[0] = this.heap[this.heap.length - 1];
      this.heap.pop();
      if (this.heap.length > 0) {
        let idx = 0;
        const n = this.heap.length;
        while (true) {
          let s = idx;
          const l = 2 * idx + 1,
            r = 2 * idx + 2;
          if (l < n && this.heap[l] < this.heap[s]) s = l;
          if (r < n && this.heap[r] < this.heap[s]) s = r;
          if (s !== idx) {
            [this.heap[idx], this.heap[s]] = [this.heap[s], this.heap[idx]];
            idx = s;
          } else break;
        }
      }
      if (min > this.prefix) this.prefix = min;
    }
  }

  longest(): number {
    return this.prefix;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 134. 最长上传前缀 =====");
const server = new LUPrefix(4);
server.upload(3);
console.log("longest:", server.longest()); // 0
server.upload(1);
console.log("longest:", server.longest()); // 1
server.upload(2);
console.log("longest:", server.longest()); // 3

export {};
