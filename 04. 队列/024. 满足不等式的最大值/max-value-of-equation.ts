// ============================================================
// 024. 满足不等式的最大值
// ============================================================
// LeetCode 1499. Max Value of Equation
// 给定点集 points[i] = [xi, yi]（xi 严格递增），求 yi + yj + |xi - xj| 的最大值，
// 其中 |xi - xj| <= k 且 i < j。

// ------------------------------------------------------------
// 方法1：单调递减队列
// ------------------------------------------------------------
// 因为 xi 递增，|xi - xj| = xj - xi，原式 = (yi - xi) + (yj + xj)。
// 用单调递减队列维护窗口内 (yi - xi) 的最大值。
// 时间 O(n)，空间 O(n)。
function findMaxValueOfEquation1(points: number[][], k: number): number {
  const deque: number[] = []; // 存下标，按 (yi - xi) 单调递减
  let result = -Infinity;
  for (let j = 0; j < points.length; j++) {
    const [xj, yj] = points[j];
    // 移除超出窗口的点
    while (deque.length > 0 && xj - points[deque[0]][0] > k) {
      deque.shift();
    }
    if (deque.length > 0) {
      const i = deque[0];
      const [xi, yi] = points[i];
      result = Math.max(result, yi - xi + yj + xj);
    }
    // 保持单调递减
    while (deque.length > 0) {
      const top = deque[deque.length - 1];
      const diff = points[top][1] - points[top][0];
      if (diff <= yj - xj) {
        deque.pop();
      } else {
        break;
      }
    }
    deque.push(j);
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：优先队列（堆）
// ------------------------------------------------------------
// 用最大堆维护 (yi - xi)，惰性删除过期元素。
// 时间 O(n log n)，空间 O(n)。
function findMaxValueOfEquation2(points: number[][], k: number): number {
  const heap: { val: number; index: number }[] = [];
  let result = -Infinity;

  const push = (node: { val: number; index: number }) => {
    heap.push(node);
    let i = heap.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (heap[parent].val >= heap[i].val) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };

  const pop = () => {
    const top = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    let i = 0;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < heap.length && heap[left].val > heap[largest].val)
        largest = left;
      if (right < heap.length && heap[right].val > heap[largest].val)
        largest = right;
      if (largest === i) break;
      [heap[largest], heap[i]] = [heap[i], heap[largest]];
      i = largest;
    }
    return top;
  };

  for (let j = 0; j < points.length; j++) {
    const [xj, yj] = points[j];
    while (heap.length > 0 && xj - points[heap[0].index][0] > k) {
      pop();
    }
    if (heap.length > 0) {
      result = Math.max(result, heap[0].val + yj + xj);
    }
    push({ val: yj - xj, index: j });
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    findMaxValueOfEquation1(
      [
        [1, 3],
        [2, 0],
        [5, 10],
        [6, -10],
      ],
      1,
    ),
    "期望: 4",
  );
  console.log(
    "测试2:",
    findMaxValueOfEquation1(
      [
        [0, 0],
        [3, 0],
        [9, 2],
      ],
      3,
    ),
    "期望: 3",
  );
  console.log(
    "测试3:",
    findMaxValueOfEquation2(
      [
        [1, 3],
        [2, 0],
        [5, 10],
        [6, -10],
      ],
      1,
    ),
    "期望: 4",
  );
  console.log(
    "测试4:",
    findMaxValueOfEquation2(
      [
        [0, 0],
        [3, 0],
        [9, 2],
      ],
      3,
    ),
    "期望: 3",
  );
}

test();

export {};
