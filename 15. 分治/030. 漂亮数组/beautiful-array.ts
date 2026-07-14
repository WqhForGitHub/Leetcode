// ============================================================
// 030. 漂亮数组
// ============================================================
// LeetCode 932. Beautiful Array
// 长度为 n 的漂亮数组 A 满足：对任意 i < j，不存在 k (i < k < j) 使 2*A[k] = A[i] + A[j]。
// 构造任意一个长度为 n 的漂亮数组。
// 时间复杂度：O(n log n)，空间复杂度：O(n log n)

// 方法1：分治递归（推荐）
// 思路：若 A 是漂亮数组，则 [2*x - 1 for x in A]（全奇）和 [2*x for x in A]（全偶）也是漂亮数组。
//       因为奇数 + 偶数 = 奇数，不可能等于 2*A[k]（偶数）。
//       所以 beautiful(n) = beautiful((n+1)/2) 全奇 + beautiful(n/2) 全偶，递归到 n=1 返回 [1]。
//       用记忆化避免重复计算。
function beautifulArray(n: number): number[] {
  const memo = new Map<number, number[]>();
  return solve(n, memo);
}

function solve(n: number, memo: Map<number, number[]>): number[] {
  if (n === 1) return [1];
  if (memo.has(n)) return memo.get(n)!;

  // 左半构造奇数部分，右半构造偶数部分
  const left = solve((n + 1) >> 1, memo); // 奇数部分长度 ceil(n/2)
  const right = solve(n >> 1, memo); // 偶数部分长度 floor(n/2)

  const result: number[] = [];
  for (const x of left) result.push(2 * x - 1); // 全奇变换
  for (const x of right) result.push(2 * x); // 全偶变换

  memo.set(n, result);
  return result;
}

// 方法2：分治迭代展开（O(n log n)）
// 思路：与方法1相同，但用迭代方式从 [1] 开始不断"奇化 + 偶化"扩展，
//       直到数组长度 >= n，再过滤掉超过 n 的元素。
//       因为每次变换后元素值仍唯一且保持漂亮性质。
function beautifulArrayIterative(n: number): number[] {
  let arr: number[] = [1];
  while (arr.length < n) {
    const next: number[] = [];
    for (const x of arr) next.push(2 * x - 1); // 奇
    for (const x of arr) next.push(2 * x); // 偶
    arr = next;
  }
  // 过滤掉超过 n 的元素（来自长度向上取整带来的多余项）
  return arr.filter((x) => x <= n);
}

// ============================================================
// 测试
// ============================================================
// 辅助：验证是否为漂亮数组
function isBeautiful(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      for (let k = i + 1; k < j; k++) {
        if (2 * arr[k] === arr[i] + arr[j]) return false;
      }
    }
  }
  return true;
}

console.log("===== 030. 漂亮数组 =====");
console.log(
  "递归 n=4:",
  JSON.stringify(beautifulArray(4)),
  "合法:",
  isBeautiful(beautifulArray(4)),
); // 期望合法，如 [2,1,4,3]
console.log(
  "递归 n=5:",
  JSON.stringify(beautifulArray(5)),
  "合法:",
  isBeautiful(beautifulArray(5)),
); // 期望合法，如 [3,1,2,5,4]
console.log("递归 n=1:", JSON.stringify(beautifulArray(1))); // 期望: [1]
console.log(
  "迭代 n=4:",
  JSON.stringify(beautifulArrayIterative(4)),
  "合法:",
  isBeautiful(beautifulArrayIterative(4)),
);
console.log(
  "迭代 n=5:",
  JSON.stringify(beautifulArrayIterative(5)),
  "合法:",
  isBeautiful(beautifulArrayIterative(5)),
);

export {};
