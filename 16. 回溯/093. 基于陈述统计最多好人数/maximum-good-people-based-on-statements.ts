// ============================================================
// 093. 基于陈述统计最多好人数
// ============================================================
// LeetCode 2151. Maximum Good People Based on Statements
// 给定 n×n 陈述矩阵，statements[i][j] 为 0(坏)/1(好)/2(无陈述)。
// 好人说真话，坏人随意。求最多可能的好人数量。
// 时间复杂度：O(2^n * n^2), 空间复杂度：O(n)

// 方法1：回溯 (枚举每个人好/坏)
// 递归枚举每个人的好坏，达到叶节点时验证一致性。
// 时间复杂度 O(2^n * n^2), 空间复杂度 O(n)
function maximumGood(statements: number[][]): number {
  const n: number = statements.length;
  let answer: number = 0;
  const good: boolean[] = new Array(n).fill(false);

  // 验证当前好人/坏人分配是否自洽
  const check = (): boolean => {
    for (let i = 0; i < n; i++) {
      if (!good[i]) continue; // 坏人可以乱说，跳过
      for (let j = 0; j < n; j++) {
        if (statements[i][j] === 2) continue;
        const expect: boolean = statements[i][j] === 1;
        if (good[j] !== expect) return false;
      }
    }
    return true;
  };

  const backtrack = (i: number, count: number): void => {
    if (i === n) {
      if (check()) answer = Math.max(answer, count);
      return;
    }
    // 设为坏人
    good[i] = false;
    backtrack(i + 1, count);
    // 设为好人
    good[i] = true;
    backtrack(i + 1, count + 1);
  };

  backtrack(0, 0);
  return answer;
}

// 方法2：位掩码枚举+验证
// 枚举所有好人集合（位掩码），验证一致性，统计最大好人数。
// 时间复杂度 O(2^n * n^2), 空间复杂度 O(1)
function maximumGood2(statements: number[][]): number {
  const n: number = statements.length;
  let answer: number = 0;
  for (let mask: number = 0; mask < 1 << n; mask++) {
    let ok: boolean = true;
    for (let i = 0; i < n && ok; i++) {
      if (((mask >> i) & 1) === 0) continue; // i 是坏人，不验证
      for (let j = 0; j < n; j++) {
        if (statements[i][j] === 2) continue;
        const expect: boolean = statements[i][j] === 1;
        const actual: boolean = ((mask >> j) & 1) === 1;
        if (actual !== expect) {
          ok = false;
          break;
        }
      }
    }
    if (ok) {
      // 统计 mask 中 1 的个数
      let c: number = 0;
      let m: number = mask;
      while (m > 0) {
        c += m & 1;
        m >>= 1;
      }
      answer = Math.max(answer, c);
    }
  }
  return answer;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 093. 基于陈述统计最多好人数 =====");
console.log(
  maximumGood([
    [2, 1, 2],
    [1, 2, 0],
    [2, 0, 2],
  ]),
); // 期望结果: 2
console.log(
  maximumGood2([
    [2, 1, 2],
    [1, 2, 0],
    [2, 0, 2],
  ]),
); // 期望结果: 2
console.log(
  maximumGood([
    [2, 0],
    [0, 2],
  ]),
); // 期望结果: 1
console.log(
  maximumGood2([
    [2, 0],
    [0, 2],
  ]),
); // 期望结果: 1

export {};
