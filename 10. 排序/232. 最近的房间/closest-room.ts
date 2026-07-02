// ============================================================
// 232. 最近的房间
// ============================================================
// LeetCode 1847. Closest Room
// 给定 rooms = [[roomId, size], ...] 和 queries = [[preferredId, minSize], ...]。
// 对每个查询，找出 size >= minSize 且 roomId 最接近 preferredId 的房间；
// 若差值相同取 roomId 较小者，无满足条件的房间返回 -1。

// 方法1：离线排序 + 二分插入有序数组 + 二分查找最近 id（O((n+q) log n)）
// 将房间按 size 降序排序，查询按 minSize 降序排序离线处理。
// 逐步把 size >= minSize 的房间 roomId 插入有序数组，
// 再二分查找最接近 preferredId 的值。

function insertSorted(arr: number[], val: number): void {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < val) lo = mid + 1;
    else hi = mid;
  }
  arr.splice(lo, 0, val);
}

function findClosest(arr: number[], target: number): number {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  // lo 为第一个 >= target 的位置（可能为 arr.length）
  if (lo === arr.length) return arr[arr.length - 1];
  if (lo === 0) return arr[0];
  const diffLo = target - arr[lo - 1]; // arr[lo-1] < target
  const diffHi = arr[lo] - target; // arr[lo] >= target
  if (diffHi < diffLo) return arr[lo];
  if (diffLo < diffHi) return arr[lo - 1];
  // 差值相同，取较小的 id（arr[lo-1]）
  return arr[lo - 1];
}

function closestRoom1(rooms: number[][], queries: number[][]): number[] {
  const n = rooms.length;
  const m = queries.length;
  // 房间按 size 降序
  rooms.sort((a, b) => b[1] - a[1]);
  // 查询带上原下标，按 minSize 降序
  const indexedQueries: number[][] = queries.map((q, i) => [q[0], q[1], i]);
  indexedQueries.sort((a, b) => b[1] - a[1]);

  const ans = new Array<number>(m).fill(-1);
  const sortedIds: number[] = [];
  let j = 0;
  for (const [preferred, minSize, idx] of indexedQueries) {
    while (j < n && rooms[j][1] >= minSize) {
      insertSorted(sortedIds, rooms[j][0]);
      j++;
    }
    if (sortedIds.length === 0) {
      ans[idx] = -1;
    } else {
      ans[idx] = findClosest(sortedIds, preferred);
    }
  }
  return ans;
}

// 方法2：离线排序 + 有序列表（SortedList）维护候选 id（O((n+q) log n)）
// 思路同方法1，使用一个 SortedList 类封装插入与最近值查找，
// 插入用二分定位，最近值通过 lower_bound 比较左右邻居得到。

class SortedList {
  private arr: number[] = [];

  size(): number {
    return this.arr.length;
  }

  add(val: number): void {
    let lo = 0;
    let hi = this.arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.arr[mid] < val) lo = mid + 1;
      else hi = mid;
    }
    this.arr.splice(lo, 0, val);
  }

  closest(target: number): number {
    let lo = 0;
    let hi = this.arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.arr[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    if (lo === this.arr.length) return this.arr[this.arr.length - 1];
    if (lo === 0) return this.arr[0];
    const a = this.arr[lo - 1];
    const b = this.arr[lo];
    const da = target - a;
    const db = b - target;
    if (da <= db) return a; // 差值相同时取较小 id（a < b）
    return b;
  }
}

function closestRoom2(rooms: number[][], queries: number[][]): number[] {
  const n = rooms.length;
  const m = queries.length;
  rooms.sort((a, b) => b[1] - a[1]);
  const indexedQueries: number[][] = queries.map((q, i) => [q[0], q[1], i]);
  indexedQueries.sort((a, b) => b[1] - a[1]);

  const ans = new Array<number>(m).fill(-1);
  const sl = new SortedList();
  let j = 0;
  for (const [preferred, minSize, idx] of indexedQueries) {
    while (j < n && rooms[j][1] >= minSize) {
      sl.add(rooms[j][0]);
      j++;
    }
    ans[idx] = sl.size() > 0 ? sl.closest(preferred) : -1;
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 232. 最近的房间 =====");
const rooms1 = [
  [2, 2],
  [1, 2],
  [3, 2],
];
const queries1 = [
  [3, 1],
  [3, 3],
  [5, 2],
];
console.log("方法1 [3,1],[3,3],[5,2]:", closestRoom1(rooms1, queries1)); // [3,-1,3]
console.log("方法2 [3,1],[3,3],[5,2]:", closestRoom2(rooms1, queries1)); // [3,-1,3]

const rooms2 = [
  [1, 4],
  [2, 3],
  [3, 5],
  [4, 1],
  [5, 2],
];
const queries2 = [
  [2, 3],
  [2, 4],
  [2, 5],
];
console.log("方法1 [2,3],[2,4],[2,5]:", closestRoom1(rooms2, queries2)); // [2,1,3]
console.log("方法2 [2,3],[2,4],[2,5]:", closestRoom2(rooms2, queries2)); // [2,1,3]

export {};
