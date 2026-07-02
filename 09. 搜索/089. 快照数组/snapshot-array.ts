// ============================================================
// 089. 快照数组
// ============================================================
// LeetCode 1146. Snapshot Array
// 支持设置值、拍照、查询某个快照版本的值。

// 方法1：Map + 二分查找
class SnapshotArray {
  private snaps: Map<number, [number, number]>[]; // 每个索引存储 [snap_id, value]
  private snapId: number;

  constructor(length: number) {
    this.snaps = new Array(length);
    for (let i = 0; i < length; i++) {
      this.snaps[i] = new Map();
      this.snaps[i].set(0, [0, 0]); // 初始值
    }
    this.snapId = 0;
  }

  set(index: number, val: number): void {
    this.snaps[index].set(this.snapId, [this.snapId, val]);
  }

  snap(): number {
    return this.snapId++;
  }

  get(index: number, snap_id: number): number {
    const map = this.snaps[index];
    // 二分找 <= snap_id 的最大版本
    const result = 0;
    const lo = 0;
    const hi = this.snapId;
    // 由于 key 是 snap_id，需要遍历太慢，改用数组
    const keys = Array.from(map.keys()).sort((a, b) => a - b);
    let l = 0;
    let r = keys.length - 1;
    let best = 0;
    while (l <= r) {
      const mid = Math.floor((l + r) / 2);
      if (keys[mid] <= snap_id) {
        best = keys[mid];
        l = mid + 1;
      } else {
        r = mid - 1;
      }
    }
    return map.get(best)![1];
  }
}

// 方法2：数组 + 二分查找（更高效）
class SnapshotArrayOpt {
  private data: [number, number][][]; // data[i] = [snap_id, value][]
  private snapId: number;

  constructor(length: number) {
    this.data = new Array(length);
    for (let i = 0; i < length; i++) {
      this.data[i] = [[0, 0]];
    }
    this.snapId = 0;
  }

  set(index: number, val: number): void {
    const arr = this.data[index];
    if (arr[arr.length - 1][0] === this.snapId) {
      arr[arr.length - 1][1] = val;
    } else {
      arr.push([this.snapId, val]);
    }
  }

  snap(): number {
    return this.snapId++;
  }

  get(index: number, snap_id: number): number {
    const arr = this.data[index];
    let lo = 0;
    let hi = arr.length - 1;
    let best = 0;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (arr[mid][0] <= snap_id) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return arr[best][1];
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 089. 快照数组 =====");
const sa = new SnapshotArrayOpt(3);
sa.set(0, 5);
console.log("snap():", sa.snap()); // 0
sa.set(0, 6);
console.log("get(0,0):", sa.get(0, 0)); // 5
console.log("snap():", sa.snap()); // 1

export {};
