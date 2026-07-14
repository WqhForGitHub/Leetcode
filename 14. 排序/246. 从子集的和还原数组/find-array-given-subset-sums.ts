// ============================================================
// 246. 从子集的和还原数组
// ============================================================
// LeetCode 1982. Find Array Given Subset Sums
// 给定一个数组所有 2^n 个子集和（无序），还原出原始数组（n 个元素）。

// 方法1：排序 + 分治递归（O(n * 2^n)）
function recoverArray(n: number, sums: number[]): number[] {
  const sorted = [...sums].sort((a, b) => a - b);
  return recoverHelper(sorted);
}

function recoverHelper(sums: number[]): number[] {
  if (sums.length === 1) return []; // 空数组
  // 候选元素 x：最小值对应的元素
  // 如果 x >= 0：sums[0] 不含 x，sums[1] = sums[0] + x（或另一个不含 x 的）
  // x = sums[1] - sums[0]（正数情况）
  // x = sums[0] - sums[1]（负数情况，sums[0] 含 x）
  const x1 = sums[1] - sums[0];
  const x2 = sums[0] - sums[1];

  for (const x of [x1, x2]) {
    const result = trySplit(sums, x);
    if (result !== null) {
      const sub = recoverHelper(result);
      if (sub !== null) {
        return [x, ...sub];
      }
    }
  }
  return [];
}

function trySplit(sums: number[], x: number): number[] | null {
  const n = sums.length;
  if (n === 0) return [];
  // 将 sums 分成两组：不含 x 的（S）和含 x 的（S + x）
  // 使用计数方式匹配
  const countMap = new Map<number, number>();
  for (const s of sums) {
    countMap.set(s, (countMap.get(s) ?? 0) + 1);
  }

  const remaining: number[] = [];

  if (x >= 0) {
    // 从小到大处理，最小的必为不含 x 的
    const sortedSums = [...sums].sort((a, b) => a - b);
    for (const s of sortedSums) {
      if ((countMap.get(s) ?? 0) === 0) continue;
      // s 不含 x，s + x 含 x
      const pair = s + x;
      if ((countMap.get(pair) ?? 0) === 0) return null;
      countMap.set(s, (countMap.get(s) ?? 0) - 1);
      countMap.set(pair, (countMap.get(pair) ?? 0) - 1);
      remaining.push(s);
    }
  } else {
    // x < 0，从大到小处理，最大的必为不含 x 的
    const sortedSums = [...sums].sort((a, b) => b - a);
    for (const s of sortedSums) {
      if ((countMap.get(s) ?? 0) === 0) continue;
      // s 含 x（即 s = S + x），S = s - x 不含 x
      const pair = s - x;
      if ((countMap.get(pair) ?? 0) === 0) return null;
      countMap.set(s, (countMap.get(s) ?? 0) - 1);
      countMap.set(pair, (countMap.get(pair) ?? 0) - 1);
      remaining.push(pair);
    }
  }

  if (remaining.length !== n / 2) return null;
  return remaining.sort((a, b) => a - b);
}

// 方法2：排序 + 多重集合迭代匹配（O(n * 2^n)）
function recoverArray2(n: number, sums: number[]): number[] {
  let current = [...sums].sort((a, b) => a - b);
  const result: number[] = [];

  while (current.length > 1) {
    current.sort((a, b) => a - b);
    // 尝试 x = current[1] - current[0]
    const x = current[1] - current[0];
    const next = tryExtract(current, x);
    if (next !== null) {
      result.push(x);
      current = next;
    } else {
      // 尝试 x = current[0] - current[1]（负数）
      const xNeg = current[0] - current[1];
      const nextNeg = tryExtract(current, xNeg);
      if (nextNeg !== null) {
        result.push(xNeg);
        current = nextNeg;
      } else {
        return [];
      }
    }
  }
  return result;
}

function tryExtract(sums: number[], x: number): number[] | null {
  if (x === 0) {
    // x=0 时，元素为 0，每个和出现两次，取每隔一个
    const result: number[] = [];
    for (let i = 0; i < sums.length; i += 2) {
      result.push(sums[i]);
    }
    return result;
  }
  const countMap = new Map<number, number>();
  for (const s of sums) {
    countMap.set(s, (countMap.get(s) ?? 0) + 1);
  }
  const remaining: number[] = [];

  if (x > 0) {
    const sorted = [...sums].sort((a, b) => a - b);
    for (const s of sorted) {
      if ((countMap.get(s) ?? 0) === 0) continue;
      const pair = s + x;
      if ((countMap.get(pair) ?? 0) === 0) return null;
      countMap.set(s, (countMap.get(s) ?? 0) - 1);
      countMap.set(pair, (countMap.get(pair) ?? 0) - 1);
      remaining.push(s);
    }
  } else {
    const sorted = [...sums].sort((a, b) => b - a);
    for (const s of sorted) {
      if ((countMap.get(s) ?? 0) === 0) continue;
      const pair = s - x;
      if ((countMap.get(pair) ?? 0) === 0) return null;
      countMap.set(s, (countMap.get(s) ?? 0) - 1);
      countMap.set(pair, (countMap.get(pair) ?? 0) - 1);
      remaining.push(pair);
    }
  }
  if (remaining.length !== sums.length / 2) return null;
  return remaining.sort((a, b) => a - b);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 246. 从子集的和还原数组 =====");
console.log("方法1:", recoverArray(3, [-3, -2, -1, 0, 0, 1, 2, 3])); // [-1,-1,3] 或 [-1,0,1] 等
console.log("方法2:", recoverArray2(3, [-3, -2, -1, 0, 0, 1, 2, 3]));
console.log("方法1:", recoverArray(2, [0, 0, 3, 3])); // [0,3] 或 [3,0]
console.log("方法2:", recoverArray2(2, [0, 0, 3, 3])); // [0,3] 或 [3,0]
console.log("方法1:", recoverArray(1, [0, 5])); // [5]
console.log("方法2:", recoverArray2(1, [0, 5])); // [5]

export {};
