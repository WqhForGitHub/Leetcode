// ============================================================
// 095. 学生出勤记录 II
// ============================================================
// LeetCode 552. Student Attendance Record II
// 给定 n，返回长度为 n 的出勤记录中可获奖励的记录数。
// 记录只含 A/L/P，缺勤A<2天，无连续迟到L>=3天。
// 结果对 10^9+7 取模。
// 时间复杂度：O(n)，空间复杂度：O(1)

const MOD: number = 1e9 + 7;

// 方法1：DP 状态机（推荐）
// 6个状态：P(0A0L), PL(0A1L), PLL(0A2L), A(1A0L), AL(1A1L), ALL(1A2L)
// 时间复杂度 O(n)，空间复杂度 O(1)
function checkRecord(n: number): number {
  // 状态含义：
  // dp[0]: 0次A, 0个连续L结尾 (P)
  // dp[1]: 0次A, 1个连续L结尾 (PL)
  // dp[2]: 0次A, 2个连续L结尾 (PLL)
  // dp[3]: 1次A, 0个连续L结尾 (A或...P后A)
  // dp[4]: 1次A, 1个连续L结尾 (AL)
  // dp[5]: 1次A, 2个连续L结尾 (ALL)

  let dp: number[] = [1, 0, 0, 0, 0, 0];

  for (let i: number = 0; i < n; i++) {
    const next: number[] = new Array(6).fill(0);

    // 加 P：连续L清零
    for (let j: number = 0; j < 6; j++) {
      const aCount: number = j < 3 ? 0 : 1;
      next[aCount * 3] = (next[aCount * 3] + dp[j]) % MOD;
    }

    // 加 L：连续L+1
    for (let j: number = 0; j < 6; j++) {
      const aCount: number = j < 3 ? 0 : 1;
      const lCount: number = j % 3;
      if (lCount < 2) {
        next[j + 1] = (next[j + 1] + dp[j]) % MOD;
      }
    }

    // 加 A：A次数+1（仅当当前0次A），连续L清零
    for (let j: number = 0; j < 3; j++) {
      next[3] = (next[3] + dp[j]) % MOD;
    }

    dp = next;
  }

  let result: number = 0;
  for (let j: number = 0; j < 6; j++) {
    result = (result + dp[j]) % MOD;
  }
  return result;
}

// 方法2：DP 矩阵快速幂
// 使用转移矩阵的快速幂加速
// 时间复杂度 O(log n)，空间复杂度 O(1)
function checkRecordMatrix(n: number): number {
  // 转移矩阵 6x6
  // 状态: [P, PL, PLL, A, AL, ALL]
  // P->P, PL->P, PLL->P, A->A, AL->A, ALL->A (加P)
  // P->PL, PL->PLL, A->AL, AL->ALL (加L)
  // P->A, PL->A, PLL->A (加A)

  const multiply = (a: number[][], b: number[][]): number[][] => {
    const n: number = a.length;
    const m: number = b[0].length;
    const k: number = b.length;
    const c: number[][] = [];
    for (let i: number = 0; i < n; i++) {
      c.push(new Array(m).fill(0));
      for (let j: number = 0; j < m; j++) {
        for (let l: number = 0; l < k; l++) {
          c[i][j] = (c[i][j] + ((a[i][l] * b[l][j]) % MOD)) % MOD;
        }
      }
    }
    return c;
  };

  const matrixPow = (mat: number[][], power: number): number[][] => {
    const size: number = mat.length;
    let result: number[][] = [];
    for (let i: number = 0; i < size; i++) {
      result.push(new Array(size).fill(0));
      result[i][i] = 1; // 单位矩阵
    }

    let base: number[][] = mat;
    while (power > 0) {
      if (power & 1) result = multiply(result, base);
      base = multiply(base, base);
      power >>= 1;
    }
    return result;
  };

  // 转移矩阵
  const trans: number[][] = [
    [1, 1, 0, 1, 0, 0], // P
    [1, 0, 1, 1, 0, 0], // PL
    [1, 0, 0, 1, 0, 0], // PLL
    [0, 0, 0, 1, 1, 0], // A
    [0, 0, 0, 1, 0, 1], // AL
    [0, 0, 0, 1, 0, 0], // ALL
  ];

  const result: number[][] = matrixPow(trans, n);

  // 初始状态 [1, 0, 0, 0, 0, 0]
  let ans: number = 0;
  for (let j: number = 0; j < 6; j++) {
    ans = (ans + result[0][j]) % MOD;
  }
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 095. 学生出勤记录 II =====");
console.log(checkRecord(1)); // 期望结果: 3
console.log(checkRecord(2)); // 期望结果: 8
console.log(checkRecord(5)); // 期望结果: 94
console.log(checkRecord(10101)); // 期望结果: 183236316
console.log("--- 方法2测试 ---");
console.log(checkRecordMatrix(2)); // 期望结果: 8
console.log(checkRecordMatrix(5)); // 期望结果: 94

export {};
