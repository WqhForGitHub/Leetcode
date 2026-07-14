// ============================================================
// 094. 穿过所有点的所需最少直线数量
// ============================================================
// LeetCode 2152. Minimum Number of Lines to Cover Points
// 给定平面上若干点，求最少需要多少条直线使其覆盖所有点。
// 时间复杂度：O(2^n * L), 空间复杂度：O(2^n + L)，L 为不同直线数

// 方法1：回溯 (每次选一条覆盖"第一个未覆盖点"的线)
// 先预处理所有"过两点的直线"对应的点集掩码，再回溯每次必须覆盖第一个未覆盖点。
// 时间复杂度 O(2^n * L), 空间复杂度 O(L)
function minimumLines(points: number[][]): number {
  const n: number = points.length;
  if (n === 0) return 0;
  if (n <= 2) return 1;

  // 共线判定（叉积为零）
  const collinear = (a: number[], b: number[], c: number[]): boolean => {
    return (b[0] - a[0]) * (c[1] - a[1]) === (b[1] - a[1]) * (c[0] - a[0]);
  };

  // 预处理所有不同的线（按掩码去重）
  const lineSet: Set<number> = new Set();
  const lines: number[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let mask: number = (1 << i) | (1 << j);
      for (let k = j + 1; k < n; k++) {
        if (collinear(points[i], points[j], points[k])) {
          mask |= 1 << k;
        }
      }
      if (!lineSet.has(mask)) {
        lineSet.add(mask);
        lines.push(mask);
      }
    }
  }

  const target: number = (1 << n) - 1;
  let answer: number = n;

  const backtrack = (covered: number, count: number): void => {
    if (count >= answer) return; // 剪枝
    if (covered === target) {
      answer = count;
      return;
    }
    // 找第一个未覆盖点，强制选一条覆盖它的线（避免重复枚举）
    let first: number = -1;
    for (let i = 0; i < n; i++) {
      if (((covered >> i) & 1) === 0) {
        first = i;
        break;
      }
    }
    for (const line of lines) {
      if ((line >> first) & 1) {
        backtrack(covered | line, count + 1);
      }
    }
  };

  backtrack(0, 0);
  return answer;
}

// 方法2：位掩码+回溯 (DP 形式)
// dp[mask] = 覆盖点集 mask 所需的最少线数；转移时同样强制覆盖第一个未覆盖点。
// 时间复杂度 O(2^n * L), 空间复杂度 O(2^n + L)
function minimumLines2(points: number[][]): number {
  const n: number = points.length;
  if (n === 0) return 0;
  if (n <= 2) return 1;

  const collinear = (a: number[], b: number[], c: number[]): boolean => {
    return (b[0] - a[0]) * (c[1] - a[1]) === (b[1] - a[1]) * (c[0] - a[0]);
  };

  // 为每个点 i 收集所有过 i 的线（掩码）
  const linesThrough: number[][] = Array.from({ length: n }, () => []);
  const seen: Set<string> = new Set();
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      let mask: number = (1 << i) | (1 << j);
      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        if (collinear(points[i], points[j], points[k])) {
          mask |= 1 << k;
        }
      }
      const key: string = i + ":" + mask;
      if (!seen.has(key)) {
        seen.add(key);
        linesThrough[i].push(mask);
      }
    }
  }

  const target: number = (1 << n) - 1;
  const dp: number[] = new Array(1 << n).fill(Infinity);
  dp[0] = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    if (dp[mask] === Infinity) continue;
    const remaining: number = target & ~mask;
    if (remaining === 0) continue;
    // 找第一个未覆盖点
    let first: number = -1;
    for (let i = 0; i < n; i++) {
      if ((remaining >> i) & 1) {
        first = i;
        break;
      }
    }
    for (const line of linesThrough[first]) {
      const newMask: number = mask | line;
      if (newMask !== mask) {
        dp[newMask] = Math.min(dp[newMask], dp[mask] + 1);
      }
    }
  }
  return dp[target];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 094. 穿过所有点的所需最少直线数量 =====");
console.log(
  minimumLines([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
  ]),
); // 期望结果: 1
console.log(
  minimumLines2([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
  ]),
); // 期望结果: 1
// 7 个点：y=0 上 3 个、y=1 上 3 个、(0,2) 单独 → 至少 3 条线
console.log(
  minimumLines([
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
  ]),
); // 期望结果: 3
console.log(
  minimumLines2([
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
  ]),
); // 期望结果: 3

export {};
