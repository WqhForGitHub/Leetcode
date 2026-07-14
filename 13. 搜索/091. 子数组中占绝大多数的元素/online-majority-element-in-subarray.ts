// ============================================================
// 091. 子数组中占绝大多数的元素
// ============================================================
// LeetCode 1157. Online Majority Element In Subarray
// 查询子数组 [left, right] 中出现超过 threshold 次的元素。

// 方法1：桶 + 二分查找
class MajorityChecker {
  private pos: Map<number, number[]>; // 值 -> 出现位置列表
  private arr: number[];
  private buckets: number[][]; // 按频率排序的候选值

  constructor(arr: number[]) {
    this.arr = arr;
    this.pos = new Map();
    for (let i = 0; i < arr.length; i++) {
      if (!this.pos.has(arr[i])) this.pos.set(arr[i], []);
      this.pos.get(arr[i])!.push(i);
    }
    // 按出现频率从高到低排序
    this.buckets = Array.from(this.pos.keys()).sort(
      (a, b) => this.pos.get(b)!.length - this.pos.get(a)!.length,
    );
  }

  query(left: number, right: number, threshold: number): number {
    // 遍历候选值，检查是否满足条件
    for (const val of this.buckets) {
      const positions = this.pos.get(val)!;
      if (positions.length < threshold) break;
      // 二分找在 [left, right] 范围内的出现次数
      const l = this.lowerBound(positions, left);
      const r = this.upperBound(positions, right);
      if (r - l >= threshold) return val;
    }
    return -1;
  }

  private lowerBound(arr: number[], target: number): number {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  private upperBound(arr: number[], target: number): number {
    let lo = 0;
    let hi = arr.length;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid] <= target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }
}

// 方法2：线段树 + 随机化
class MajorityCheckerSegTree {
  private arr: number[];
  private tree: number[][]; // 线段树节点存储 [majority, count]

  constructor(arr: number[]) {
    this.arr = arr;
    const n = arr.length;
    this.tree = new Array(4 * n);
    this.build(1, 0, n - 1);
  }

  private build(node: number, lo: number, hi: number): void {
    if (lo === hi) {
      this.tree[node] = [this.arr[lo], 1];
      return;
    }
    const mid = Math.floor((lo + hi) / 2);
    this.build(node * 2, lo, mid);
    this.build(node * 2 + 1, mid + 1, hi);
    this.tree[node] = this.merge(this.tree[node * 2], this.tree[node * 2 + 1]);
  }

  private merge(a: number[], b: number[]): number[] {
    if (a[0] === b[0]) return [a[0], a[1] + b[1]];
    if (a[1] >= b[1]) return [a[0], a[1] - b[1]];
    return [b[0], b[1] - a[1]];
  }

  query(left: number, right: number, threshold: number): number {
    const [candidate] = this.queryHelper(1, 0, this.arr.length - 1, left, right);
    // 验证 candidate 是否真的超过 threshold
    let count = 0;
    for (let i = left; i <= right; i++) {
      if (this.arr[i] === candidate) count++;
    }
    return count >= threshold ? candidate : -1;
  }

  private queryHelper(node: number, lo: number, hi: number, left: number, right: number): number[] {
    if (lo > right || hi < left) return [0, 0];
    if (left <= lo && hi <= right) return this.tree[node];
    const mid = Math.floor((lo + hi) / 2);
    return this.merge(
      this.queryHelper(node * 2, lo, mid, left, right),
      this.queryHelper(node * 2 + 1, mid + 1, hi, left, right),
    );
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 091. 子数组中占绝大多数的元素 =====");
const mc = new MajorityChecker([1, 1, 2, 2, 1, 1]);
console.log("query(0,5,4):", mc.query(0, 5, 4)); // 1
console.log("query(0,3,3):", mc.query(0, 3, 3)); // -1
console.log("query(2,3,2):", mc.query(2, 3, 2)); // 2

export {};
