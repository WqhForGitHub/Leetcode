// ============================================================
// 090. 下一个更大的数值平衡数
// ============================================================
// LeetCode 2048. Next Greater Numerically Balanced Number
// 数值平衡数：每个数字 d 出现次数恰好为 d 次（d=0 必须出现 0 次）。
// 给定 n，返回大于 n 的最小数值平衡数。
// 时间复杂度：O(答案数), 空间复杂度：O(1)

// 方法1：回溯 (逐位构建)
// 枚举使用的数字集合（1-9 的子集），并生成对应多重集的所有去重排列。
// 时间复杂度 O(L! 数量级, L<=7), 空间复杂度 O(L)
function nextBeautifulNumber(n: number): number {
  const candidates: number[] = [];
  const str: string = String(n);
  // 平衡数最长不会超过 str.length + 2 位（足够覆盖 n+1 之后的最小平衡数）
  const maxLen: number = str.length + 2;

  // 对 digits 数组生成去重全排列，加入候选
  const permute = (digits: number[]): void => {
    const m: number = digits.length;
    if (m === 0) return;
    const sorted: number[] = [...digits].sort((a, b) => a - b);
    const used: boolean[] = new Array(m).fill(false);
    const path: number[] = [];
    const dfs = (): void => {
      if (path.length === m) {
        let num: number = 0;
        for (const d of path) num = num * 10 + d;
        candidates.push(num);
        return;
      }
      for (let i = 0; i < m; i++) {
        if (used[i]) continue;
        // 去重：相同元素若前一个未用则跳过
        if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;
        used[i] = true;
        path.push(sorted[i]);
        dfs();
        path.pop();
        used[i] = false;
      }
    };
    dfs();
  };

  // 选数字集合：digit 表示当前考虑的数字，remaining 表示剩余位置数
  const chosen: number[] = [];
  const pickDigits = (digit: number, remaining: number): void => {
    if (remaining === 0) {
      const arr: number[] = [];
      for (const d of chosen) {
        for (let i = 0; i < d; i++) arr.push(d);
      }
      permute(arr);
      return;
    }
    if (digit > 9) return;
    // 选 digit
    if (digit <= remaining) {
      chosen.push(digit);
      pickDigits(digit + 1, remaining - digit);
      chosen.pop();
    }
    // 不选
    pickDigits(digit + 1, remaining);
  };

  // 对每个可能长度生成候选
  for (let len = str.length; len <= maxLen; len++) {
    pickDigits(1, len);
  }

  candidates.sort((a, b) => a - b);
  for (const x of candidates) {
    if (x > n) return x;
  }
  return -1;
}

// 方法2：枚举+验证
// 从 n+1 开始逐个检查是否为平衡数。
// 时间复杂度 O((gap) * log n), 空间复杂度 O(1)
function nextBeautifulNumber2(n: number): number {
  const isBalanced = (x: number): boolean => {
    const cnt: number[] = new Array(10).fill(0);
    let t: number = x;
    while (t > 0) {
      cnt[t % 10]++;
      t = Math.floor(t / 10);
    }
    for (let d = 0; d <= 9; d++) {
      if (cnt[d] !== 0 && cnt[d] !== d) return false;
    }
    return true;
  };

  let x: number = n + 1;
  while (!isBalanced(x)) x++;
  return x;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 090. 下一个更大的数值平衡数 =====");
console.log(nextBeautifulNumber(1)); // 期望结果: 22
console.log(nextBeautifulNumber2(1)); // 期望结果: 22
console.log(nextBeautifulNumber(1000)); // 期望结果: 1333
console.log(nextBeautifulNumber2(1000)); // 期望结果: 1333
console.log(nextBeautifulNumber(3000)); // 期望结果: 3133
console.log(nextBeautifulNumber2(3000)); // 期望结果: 3133

export {};
