// ============================================================
// 172. 将整数按权重排序
// ============================================================
// LeetCode 1387. Sort Integers by The Power Value
// 权重值：将整数变为 1 所需的步数（偶数 x/2，奇数 3x+1）。
// 区间 [lo, hi] 内所有整数按权重升序排序，权重相同按数值升序，
// 返回排序后第 k 个整数（1 索引）。

// 方法1：递归记忆化求权重 + 排序（O(n log n + n * P)）
// 使用 Map 缓存已计算的权重，递归求每个数的权重。
function getKth(lo: number, hi: number, k: number): number {
  const memo = new Map<number, number>();
  memo.set(1, 0);
  const power = (x: number): number => {
    if (memo.has(x)) return memo.get(x)!;
    const steps = x % 2 === 0 ? 1 + power(x / 2) : 1 + power(3 * x + 1);
    memo.set(x, steps);
    return steps;
  };
  const arr: number[] = [];
  for (let i = lo; i <= hi; i++) arr.push(i);
  arr.sort((a, b) => {
    const pa = power(a);
    const pb = power(b);
    if (pa !== pb) return pa - pb;
    return a - b;
  });
  return arr[k - 1];
}

// 方法2：迭代预计算权重 + 排序（O((hi-lo+1) * P + n log n)）
// 先用迭代方式批量预计算区间内所有数的权重，再排序。
function getKth2(lo: number, hi: number, k: number): number {
  const memo = new Map<number, number>();
  memo.set(1, 0);
  const power = (x: number): number => {
    if (memo.has(x)) return memo.get(x)!;
    const path: number[] = [];
    let cur = x;
    while (!memo.has(cur)) {
      path.push(cur);
      cur = cur % 2 === 0 ? cur / 2 : 3 * cur + 1;
    }
    let base = memo.get(cur)!;
    for (let i = path.length - 1; i >= 0; i--) {
      base += 1;
      memo.set(path[i], base);
    }
    return memo.get(x)!;
  };
  const arr: number[] = [];
  for (let i = lo; i <= hi; i++) arr.push(i);
  for (const x of arr) power(x);
  arr.sort((a, b) => {
    const pa = memo.get(a)!;
    const pb = memo.get(b)!;
    if (pa !== pb) return pa - pb;
    return a - b;
  });
  return arr[k - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 172. 将整数按权重排序 =====");
console.log("方法1 lo=12,hi=15,k=2:", getKth(12, 15, 2)); // 13
console.log("方法1 lo=1,hi=1,k=1:", getKth(1, 1, 1)); // 1
console.log("方法2 lo=12,hi=15,k=2:", getKth2(12, 15, 2)); // 13
console.log("方法2 lo=7,hi=11,k=4:", getKth2(7, 11, 4)); // 7

export {};
