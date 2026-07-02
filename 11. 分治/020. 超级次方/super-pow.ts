// ============================================================
// 020. 超级次方
// ============================================================
// LeetCode 372. Super Pow
// 你的任务是计算 a^b mod 1337，其中 a 是正整数，b 是一个非常大的正整数，
// 以整数数组 b 的形式给出。
// 时间复杂度：O(len(b)), 空间复杂度：O(len(b)) 递归栈

const MOD: number = 1337;

// 方法1：分治递归（推荐）
// a^[b1,b2,...,bn] = (a^[b1,...,bn-1])^10 * a^bn mod 1337
// 利用 (x * y) mod m = ((x mod m) * (y mod m)) mod m
function superPow1(a: number, b: number[]): number {
  if (b.length === 0) return 1;
  const lastDigit: number = b[b.length - 1];
  const rest: number[] = b.slice(0, b.length - 1);
  // 递归计算 a^rest，再 ^10，再乘 a^lastDigit
  const part1: number = powMod(superPow1(a, rest), 10);
  const part2: number = powMod(a, lastDigit);
  return (part1 * part2) % MOD;
}

// 快速幂取模：计算 a^e mod 1337
function powMod(a: number, e: number): number {
  a %= MOD;
  let result: number = 1;
  let base: number = a;
  while (e > 0) {
    if (e & 1) result = (result * base) % MOD;
    base = (base * base) % MOD;
    e >>= 1;
  }
  return result;
}

// 方法2：迭代
// 从高位到低位依次处理：result = result^10 * a^digit mod 1337
function superPow2(a: number, b: number[]): number {
  let result: number = 1;
  for (const digit of b) {
    result = (powMod(result, 10) * powMod(a, digit)) % MOD;
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. 超级次方 =====");
console.log("方法1:", superPow1(2, [1, 0])); // 期望结果: 1024 (2^10)
console.log("方法2:", superPow2(2, [1, 0])); // 期望结果: 1024
console.log("方法1:", superPow1(2, [3])); // 期望结果: 8
console.log("方法2:", superPow2(2, [3])); // 期望结果: 8
console.log("方法1:", superPow1(1, [4, 3, 3, 5, 2])); // 期望结果: 1
console.log("方法2:", superPow2(1, [4, 3, 3, 5, 2])); // 期望结果: 1
console.log("方法1:", superPow1(2, [1, 0, 0])); // 期望结果: 1178 (2^100 mod 1337)
console.log("方法2:", superPow2(2, [1, 0, 0])); // 期望结果: 1178
console.log("方法1:", superPow1(2147483647, [2, 0, 0])); // 期望结果: 1198
console.log("方法2:", superPow2(2147483647, [2, 0, 0])); // 期望结果: 1198

export {};
