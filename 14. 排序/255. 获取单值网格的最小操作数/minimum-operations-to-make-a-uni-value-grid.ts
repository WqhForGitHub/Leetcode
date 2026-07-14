// ============================================================
// 255. 获取单值网格的最小操作数
// ============================================================
// LeetCode 2033. Minimum Operations to Make a Uni-Value Grid
// 给定 grid 和 x，可对任意元素加减 x 任意次。使所有元素相等的最小操作数；
// 若不可能（元素模 x 不全相同）返回 -1。

// 方法1：展开 + 排序 + 检查模 x 一致 + 中位数作为目标 + 求和 |v-中位数|/x
// 时间复杂度 O(mn log(mn))
function minOperations1(grid: number[][], x: number): number {
  const arr: number[] = [];
  for (const row of grid) for (const v of row) arr.push(v);
  arr.sort((a, b) => a - b);
  const base = arr[0] % x;
  for (const v of arr) {
    if (v % x !== base) return -1;
  }
  // 归一化为 v / x 后取中位数
  const norm: number[] = arr.map((v) => Math.floor((v - arr[0]) / x));
  const mid = norm[norm.length >> 1];
  let ops = 0;
  for (const nv of norm) ops += Math.abs(nv - mid);
  return ops;
}

// 方法2：展开 + 排序 + 检查可整除性 + 中位数配合前缀和 O(1) 区间和
// 时间复杂度 O(mn log(mn))
function minOperations2(grid: number[][], x: number): number {
  const arr: number[] = [];
  for (const row of grid) for (const v of row) arr.push(v);
  arr.sort((a, b) => a - b);
  const mod = arr[0] % x;
  for (const v of arr) {
    if ((v - arr[0]) % x !== 0) return -1;
  }
  const n = arr.length;
  const prefix: number[] = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + arr[i];
  const total = prefix[n];
  // 中位数 arr[k]
  const k = n >> 1;
  // 左边 k 个：arr[k]*k - sumLeft
  // 右边 n-1-k 个：sumRight - arr[k]*(n-1-k)
  const sumLeft = prefix[k];
  const sumRight = total - prefix[k + 1];
  const diff = arr[k] * k - sumLeft + sumRight - arr[k] * (n - 1 - k);
  return Math.floor(diff / x);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 255. 获取单值网格的最小操作数 =====");
console.log(
  "方法1 [[2,4],[6,8]],x=2:",
  minOperations1(
    [
      [2, 4],
      [6, 8],
    ],
    2,
  ),
);
console.log(
  "方法1 [[1,5],[2,3]],x=1:",
  minOperations1(
    [
      [1, 5],
      [2, 3],
    ],
    1,
  ),
);
console.log(
  "方法1 [[1,2],[3,4]],x=2:",
  minOperations1(
    [
      [1, 2],
      [3, 4],
    ],
    2,
  ),
);
console.log(
  "方法2 [[2,4],[6,8]],x=2:",
  minOperations2(
    [
      [2, 4],
      [6, 8],
    ],
    2,
  ),
);
console.log(
  "方法2 [[1,5],[2,3]],x=1:",
  minOperations2(
    [
      [1, 5],
      [2, 3],
    ],
    1,
  ),
);
console.log(
  "方法2 [[1,2],[3,4]],x=2:",
  minOperations2(
    [
      [1, 2],
      [3, 4],
    ],
    2,
  ),
);

export {};
