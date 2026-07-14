// ============================================================
// 044. 24 点游戏
// ============================================================
// LeetCode 679. 24 Game
// 给定 4 张牌（1-13），通过 +, -, *, / 和括号能否恰好得到 24。每张牌只能用一次。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯(两两运算) (推荐)
// 每次从数组中任选两个数字进行四则运算，将结果与剩余数字组成新数组继续递归。
// 当数组只剩一个数字时，判断是否等于24（允许浮点误差）。
// 时间复杂度 O(12 * 6 * 2 * 4^3) = O(1), 空间复杂度 O(1)
function judgePoint24(nums: number[]): boolean {
  const EPS = 1e-6;

  const backtrack = (arr: number[]): boolean => {
    if (arr.length === 1) {
      return Math.abs(arr[0] - 24) < EPS;
    }

    // 任选两个数
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (i === j) continue;
        // 其余未被选中的数
        const rest: number[] = [];
        for (let k = 0; k < arr.length; k++) {
          if (k !== i && k !== j) rest.push(arr[k]);
        }

        const a = arr[i];
        const b = arr[j];
        const candidates: number[] = [a + b, a - b, a * b];
        // 除法时分母不能为0
        if (Math.abs(b) > EPS) candidates.push(a / b);

        for (const val of candidates) {
          rest.push(val);
          if (backtrack(rest)) return true;
          rest.pop();
        }
      }
    }
    return false;
  };

  return backtrack([...nums]);
}

// 方法2：回溯+分数运算(避免浮点误差)
// 使用 [分子, 分母] 二元组表示有理数，避免浮点误差
// 时间复杂度 O(1), 空间复杂度 O(1)
function judgePoint24Fraction(nums: number[]): boolean {
  // 分数：[分子, 分母]
  type Frac = [number, number];

  const gcd = (a: number, b: number): number => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a === 0 ? 1 : a;
  };

  const normalize = (f: Frac): Frac => {
    if (f[1] < 0) {
      f[0] = -f[0];
      f[1] = -f[1];
    }
    const g = gcd(f[0], f[1]);
    return [f[0] / g, f[1] / g];
  };

  const add = (a: Frac, b: Frac): Frac => normalize([a[0] * b[1] + b[0] * a[1], a[1] * b[1]]);
  const sub = (a: Frac, b: Frac): Frac => normalize([a[0] * b[1] - b[0] * a[1], a[1] * b[1]]);
  const mul = (a: Frac, b: Frac): Frac => normalize([a[0] * b[0], a[1] * b[1]]);
  const div = (a: Frac, b: Frac): Frac => {
    if (b[0] === 0) return [NaN, 1];
    return normalize([a[0] * b[1], a[1] * b[0]]);
  };

  const equal24 = (f: Frac): boolean => f[1] !== 0 && f[0] === 24 * f[1];

  const backtrack = (arr: Frac[]): boolean => {
    if (arr.length === 1) {
      return equal24(arr[0]);
    }
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (i === j) continue;
        const rest: Frac[] = [];
        for (let k = 0; k < arr.length; k++) {
          if (k !== i && k !== j) rest.push(arr[k]);
        }
        const a = arr[i];
        const b = arr[j];
        const ops: ((a: Frac, b: Frac) => Frac)[] = [add, sub, mul, div];
        for (const op of ops) {
          const r = op(a, b);
          if (Number.isNaN(r[0])) continue;
          rest.push(r);
          if (backtrack(rest)) return true;
          rest.pop();
        }
      }
    }
    return false;
  };

  const fracs: Frac[] = nums.map((n) => [n, 1] as Frac);
  return backtrack(fracs);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 044. 24 点游戏 =====");
console.log(judgePoint24([4, 1, 8, 7])); // 期望结果: true
console.log(judgePoint24([1, 2, 1, 2])); // 期望结果: false
console.log(judgePoint24Fraction([4, 1, 8, 7])); // 期望结果: true
console.log(judgePoint24Fraction([1, 2, 1, 2])); // 期望结果: false

export {};
