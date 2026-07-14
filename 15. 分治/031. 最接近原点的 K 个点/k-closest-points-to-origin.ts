// ============================================================
// 031. 最接近原点的 K 个点
// ============================================================
// LeetCode 973. K Closest Points to Origin
// 给定一个数组 points，其中 points[i] = [xi, yi] 表示 X-Y 平面上的一个点。
// 返回距离原点 (0, 0) 最近的 k 个点。距离为平方欧几里得距离。
// 时间复杂度：O(n) 平均, 空间复杂度：O(log n)

// 方法1：快速选择（分治划分）（推荐）
// 利用类似快排的划分，期望 O(n) 找到第 k 小的距离
// 时间复杂度 O(n) 平均，空间复杂度 O(log n) 递归栈
function kClosest(points: number[][], k: number): number[][] {
  const dist: (i: number) => number = (i: number): number =>
    points[i][0] * points[i][0] + points[i][1] * points[i][1];

  // 分治：将前 k 小的元素放到前 k 个位置
  function quickSelect(left: number, right: number, kIdx: number): void {
    if (left >= right) return;

    // 随机选择 pivot 避免最坏情况
    const randIdx: number = left + Math.floor(Math.random() * (right - left + 1));
    swap(left, randIdx);
    const pivotDist: number = dist(left);

    // 三路划分：[<pivot] [==pivot] [>pivot]
    let lt: number = left; // [left, lt] < pivot
    let gt: number = right; // [gt, right] > pivot
    let i: number = left + 1;
    while (i <= gt) {
      const d: number = dist(i);
      if (d < pivotDist) {
        lt++;
        swap(lt, i);
        i++;
      } else if (d > pivotDist) {
        swap(i, gt);
        gt--;
      } else {
        i++;
      }
    }
    swap(left, lt);

    // 现在 [left, lt-1] < pivot, [lt, gt] == pivot, [gt+1, right] > pivot
    if (kIdx <= lt - 1) {
      quickSelect(left, lt - 1, kIdx);
    } else if (kIdx >= gt + 1) {
      quickSelect(gt + 1, right, kIdx);
    }
    // 否则 k 落在 == pivot 区间，前 k 小已就位
  }

  function swap(a: number, b: number): void {
    const tmp: number[] = points[a];
    points[a] = points[b];
    points[b] = tmp;
  }

  if (k >= points.length) return points;
  quickSelect(0, points.length - 1, k - 1);
  return points.slice(0, k);
}

// 方法2：大小为 k 的最大堆
// 维护一个容量为 k 的最大堆，堆顶为堆中距离最大的点
// 时间复杂度 O(n log k)，空间复杂度 O(k)
function kClosestHeap(points: number[][], k: number): number[][] {
  const dist: (p: number[]) => number = (p: number[]): number => p[0] * p[0] + p[1] * p[1];

  // 最大堆（数组实现），按距离比较
  const heap: number[][] = [];

  function siftUp(idx: number): void {
    while (idx > 0) {
      const parent: number = Math.floor((idx - 1) / 2);
      if (dist(heap[parent]) < dist(heap[idx])) {
        [heap[parent], heap[idx]] = [heap[idx], heap[parent]];
        idx = parent;
      } else {
        break;
      }
    }
  }

  function siftDown(idx: number): void {
    const n: number = heap.length;
    while (true) {
      let largest: number = idx;
      const l: number = 2 * idx + 1;
      const r: number = 2 * idx + 2;
      if (l < n && dist(heap[l]) > dist(heap[largest])) largest = l;
      if (r < n && dist(heap[r]) > dist(heap[largest])) largest = r;
      if (largest !== idx) {
        [heap[largest], heap[idx]] = [heap[idx], heap[largest]];
        idx = largest;
      } else {
        break;
      }
    }
  }

  for (let i: number = 0; i < points.length; i++) {
    if (heap.length < k) {
      heap.push(points[i]);
      siftUp(heap.length - 1);
    } else if (dist(points[i]) < dist(heap[0])) {
      heap[0] = points[i];
      siftDown(0);
    }
  }

  return heap;
}

// 方法3：按距离排序
// 计算所有点的距离后整体排序，取前 k 个
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function kClosestSort(points: number[][], k: number): number[][] {
  const dist: (p: number[]) => number = (p: number[]): number => p[0] * p[0] + p[1] * p[1];
  const sorted: number[][] = [...points].sort((a: number[], b: number[]) => dist(a) - dist(b));
  return sorted.slice(0, k);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 031. 最接近原点的 K 个点 =====");
console.log(
  kClosest(
    [
      [1, 3],
      [-2, 2],
    ],
    1,
  ),
); // 期望结果: [[-2,2]]
console.log(
  kClosest(
    [
      [3, 3],
      [5, -1],
      [-2, 4],
    ],
    2,
  ),
); // 期望结果: [[3,3],[-2,4]] (顺序可能不同)
console.log("--- 方法2测试 ---");
console.log(
  kClosestHeap(
    [
      [1, 3],
      [-2, 2],
    ],
    1,
  ),
); // 期望结果: [[-2,2]]
console.log(
  kClosestHeap(
    [
      [3, 3],
      [5, -1],
      [-2, 4],
    ],
    2,
  ),
); // 期望结果: 前2近的点
console.log("--- 方法3测试 ---");
console.log(
  kClosestSort(
    [
      [1, 3],
      [-2, 2],
    ],
    1,
  ),
); // 期望结果: [[-2,2]]
console.log(
  kClosestSort(
    [
      [3, 3],
      [5, -1],
      [-2, 4],
    ],
    2,
  ),
); // 期望结果: [[3,3],[-2,4]]

export {};
