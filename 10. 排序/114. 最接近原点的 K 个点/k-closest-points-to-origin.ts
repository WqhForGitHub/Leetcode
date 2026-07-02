// ============================================================
// 114. 最接近原点的 K 个点
// ============================================================
// LeetCode 973. K Closest Points to Origin
// 给定平面上若干点，求距离原点欧氏距离最近的 k 个点。
// 距离平方 (x^2 + y^2) 即可比较大小，无需开方。

// 方法1：按距离排序后取前 k（O(n log n) 时间，O(log n) 排序空间）
function kClosest(points: number[][], k: number): number[][] {
  points.sort((a, b) => dist(a) - dist(b));
  return points.slice(0, k);
}

function dist(p: number[]): number {
  return p[0] * p[0] + p[1] * p[1];
}

// 方法2：快速选择 quickselect（O(n) 平均，O(n^2) 最坏，O(log n) 递归空间）
// 划分后使前 k 个点恰为最小的 k 个，无需完全排序。
function kClosestQuickselect(points: number[][], k: number): number[][] {
  const n = points.length;
  let left = 0;
  let right = n - 1;
  while (left < right) {
    const pivotIdx = partition(points, left, right);
    if (pivotIdx === k) {
      break;
    } else if (pivotIdx < k) {
      left = pivotIdx + 1;
    } else {
      right = pivotIdx - 1;
    }
  }
  return points.slice(0, k);
}

function partition(points: number[][], left: number, right: number): number {
  // 取最右元素作为基准，把小于基准的换到左侧
  const pivot = dist(points[right]);
  let store = left;
  for (let i = left; i < right; i++) {
    if (dist(points[i]) < pivot) {
      swap(points, store, i);
      store++;
    }
  }
  swap(points, store, right);
  return store;
}

function swap(arr: number[][], i: number, j: number): void {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// 方法3：大小为 k 的最大堆（O(n log k) 时间，O(k) 空间）
// 维护距离最大的 k 个点在堆顶，新点比堆顶更近则替换。
function kClosestHeap(points: number[][], k: number): number[][] {
  // 最大堆：按距离比较，父节点距离 >= 子节点
  const heap: number[][] = []; // 存点

  const less = (a: number[], b: number[]): boolean => dist(a) > dist(b);

  const siftUp = (i: number): void => {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (less(heap[i], heap[parent])) {
        swap(heap, i, parent);
        i = parent;
      } else {
        break;
      }
    }
  };

  const siftDown = (i: number): void => {
    const size = heap.length;
    while (true) {
      let best = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < size && less(heap[l], heap[best])) best = l;
      if (r < size && less(heap[r], heap[best])) best = r;
      if (best === i) break;
      swap(heap, i, best);
      i = best;
    }
  };

  for (const p of points) {
    if (heap.length < k) {
      heap.push(p);
      siftUp(heap.length - 1);
    } else if (dist(p) < dist(heap[0])) {
      // 堆顶是当前 k 个中最远的；新点更近时替换堆顶
      heap[0] = p;
      siftDown(0);
    }
  }
  return heap;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 114. 最接近原点的 K 个点 =====");

const pts = [
  [1, 3],
  [-2, 2],
  [5, 8],
  [0, 1],
];
console.log(
  "方法1 排序:",
  kClosest(
    pts.map((p) => p.slice()),
    2,
  ),
); // 期望 [[-2,2],[0,1]]
console.log(
  "方法2 快选:",
  kClosestQuickselect(
    pts.map((p) => p.slice()),
    2,
  ),
);
console.log(
  "方法3 堆:",
  kClosestHeap(
    pts.map((p) => p.slice()),
    2,
  ),
);

const pts2 = [
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
];
console.log(
  "方法1 k=3:",
  kClosest(
    pts2.map((p) => p.slice()),
    3,
  ),
); // 期望 [[1,1],[2,2],[3,3]]
console.log(
  "方法2 k=3:",
  kClosestQuickselect(
    pts2.map((p) => p.slice()),
    3,
  ),
);
console.log(
  "方法3 k=3:",
  kClosestHeap(
    pts2.map((p) => p.slice()),
    3,
  ),
);

console.log(
  "单点 k=1:",
  kClosest(
    [
      [0, 0],
      [1, 1],
    ],
    1,
  ),
  "期望 [[0,0]]",
);

export {};
