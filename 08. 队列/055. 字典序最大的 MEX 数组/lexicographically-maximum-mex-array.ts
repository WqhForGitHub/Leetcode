// ============================================================
// 055. 字典序最大的 MEX 数组
// ============================================================
// LeetCode 周赛题. 字典序最大的 MEX 数组
// 重排数组，使 MEX 值最大，在 MEX 最大化的前提下字典序最大。

// ------------------------------------------------------------
// 方法1：贪心 + 队列
// ------------------------------------------------------------
// 贪心地从 0 开始构造，优先使用已有的最小可用数字。
// 时间 O(n log n)，空间 O(n)。
function lexicographicallyMaximumMex1(nums: number[]): number[] {
  const n = nums.length;
  const count: Map<number, number> = new Map();
  for (const num of nums) {
    count.set(num, (count.get(num) || 0) + 1);
  }
  const result: number[] = [];
  const available: number[] = [];
  for (const [num, cnt] of count) {
    for (let i = 0; i < cnt; i++) {
      available.push(num);
    }
  }
  available.sort((a, b) => b - a); // 降序，便于取最大

  // 贪心：每次取剩余中最大的可以放且不影响 MEX 的数字
  const used: boolean[] = new Array(available.length).fill(false);
  let mex = 0;
  for (let i = 0; i < n; i++) {
    // 优先放最大的不影响 MEX 的数字
    let placed = false;
    for (let j = 0; j < available.length; j++) {
      if (!used[j] && available[j] > mex) {
        result.push(available[j]);
        used[j] = true;
        placed = true;
        break;
      }
    }
    if (!placed) {
      // 放 mex 本身
      for (let j = 0; j < available.length; j++) {
        if (!used[j] && available[j] === mex) {
          result.push(available[j]);
          used[j] = true;
          mex++;
          placed = true;
          break;
        }
      }
    }
    if (!placed) {
      // 放任意可用
      for (let j = 0; j < available.length; j++) {
        if (!used[j]) {
          result.push(available[j]);
          used[j] = true;
          break;
        }
      }
    }
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：排序 + 构造
// ------------------------------------------------------------
// 先排序，然后贪心地从后往前放置不影响 MEX 的元素。
// 时间 O(n log n)，空间 O(n)。
function lexicographicallyMaximumMex2(nums: number[]): number[] {
  const sorted = [...nums].sort((a, b) => a - b);
  const n = nums.length;
  // 计算 MEX
  let mex = 0;
  for (const num of sorted) {
    if (num === mex) mex++;
  }
  // 构造字典序最大的排列
  const result: number[] = [];
  const used: boolean[] = new Array(n).fill(false);
  for (let i = 0; i < n; i++) {
    // 从大到小尝试放
    for (let j = n - 1; j >= 0; j--) {
      if (!used[j]) {
        used[j] = true;
        result.push(sorted[j]);
        break;
      }
    }
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", JSON.stringify(lexicographicallyMaximumMex1([0, 1, 2])), "期望: [2,1,0]");
  console.log(
    "测试2:",
    JSON.stringify(lexicographicallyMaximumMex1([0, 0, 1, 3])),
    "期望: [3,1,0,0]",
  );
  console.log("测试3:", JSON.stringify(lexicographicallyMaximumMex2([0, 1, 2])), "期望: [2,1,0]");
}

test();

export {};
