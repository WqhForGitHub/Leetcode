// ============================================================
// 数学面试题 - TypeScript 解题合集
// ============================================================

// ============================================================
// 1. 试除法判定质数
// AcWing 866. 试除法判定质数
// 核心思路：若 n 有大于 1 的因子，则必有一个因子 <= sqrt(n)，只需检查到 sqrt(n)
// 时间复杂度：O(sqrt(n))
// 空间复杂度：O(1)
// ============================================================

// 方法1：标准试除法（推荐）- 检查到 sqrt(n)
function isPrime(n: number): boolean {
  if (n < 2) return false;
  // 只需检查到 sqrt(n)，用 i * i <= n 避免浮点精度问题
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// 方法2：优化试除法 — 跳过偶数
function isPrimeOptimized(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

// 方法3：6k±1 优化 — 质数一定在 6 的倍数两侧（除 2 和 3）
function isPrime6k(n: number): boolean {
  if (n < 2) return false;
  if (n === 2 || n === 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  // 从 5 开始，步长交替 2 和 4（即检查 6k-1 和 6k+1）
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

// ============================================================
// 2. 筛质数
// AcWing 868. 筛质数 — 给定 n，求 1~n 中质数的个数
// 核心思路：从 2 开始，将每个质数的倍数标记为合数
// ============================================================

// 方法1：埃氏筛法（推荐）- 只用质数去筛合数
// 时间复杂度：O(n log log n)
// 空间复杂度：O(n)
function countPrimesEratosthenes(n: number): number {
  if (n < 2) return 0;
  const isPrimeArr = new Array(n + 1).fill(true);
  isPrimeArr[0] = isPrimeArr[1] = false;
  let count = 0;

  for (let i = 2; i <= n; i++) {
    if (isPrimeArr[i]) {
      count++;
      // 从 i*i 开始筛，因为 i*2, i*3, ..., i*(i-1) 已被更小的质数筛过
      for (let j = i * i; j <= n; j += i) {
        isPrimeArr[j] = false;
      }
    }
  }
  return count;
}

// 方法2：线性筛法（欧拉筛）— 每个合数只被最小质因子筛一次
// 时间复杂度：O(n)
// 空间复杂度：O(n)
function countPrimesLinear(n: number): number {
  if (n < 2) return 0;
  const isPrimeArr = new Array(n + 1).fill(true);
  const primes: number[] = []; // 存储所有质数
  isPrimeArr[0] = isPrimeArr[1] = false;

  for (let i = 2; i <= n; i++) {
    if (isPrimeArr[i]) {
      primes.push(i);
    }
    // 用每个质数去筛 i 的倍数，保证合数只被最小质因子筛掉
    for (let j = 0; j < primes.length && primes[j] <= Math.floor(n / i); j++) {
      isPrimeArr[i * primes[j]] = false;
      // 如果 i 是 primes[j] 的倍数，停止筛（保证最小质因子原则）
      if (i % primes[j] === 0) break;
    }
  }
  return primes.length;
}

// 方法3：埃氏筛法 — 同时返回所有质数列表
function sievePrimes(n: number): number[] {
  if (n < 2) return [];
  const isPrimeArr = new Array(n + 1).fill(true);
  isPrimeArr[0] = isPrimeArr[1] = false;
  const primes: number[] = [];

  for (let i = 2; i <= n; i++) {
    if (isPrimeArr[i]) {
      primes.push(i);
      for (let j = i * i; j <= n; j += i) {
        isPrimeArr[j] = false;
      }
    }
  }
  return primes;
}

// ============================================================
// 3. 最大公约数
// AcWing 872. 最大公约数
// 核心思路：辗转相除法（欧几里得算法）— gcd(a, b) = gcd(b, a mod b)
// 时间复杂度：O(log(min(a, b)))
// 空间复杂度：O(1)（迭代版本）
// ============================================================

// 方法1：辗转相除法 — 迭代（推荐）
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// 方法2：辗转相除法 — 递归
function gcdRecursive(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b === 0) return a;
  return gcdRecursive(b, a % b);
}

// 方法3：更相减损法 — 用减法代替取模（适用于大数场景）
function gcdSubtraction(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (a === 0) return b;
  if (b === 0) return a;
  while (a !== b) {
    if (a > b) {
      a = a - b;
    } else {
      b = b - a;
    }
  }
  return a;
}

// 扩展：最小公倍数 lcm(a, b) = a * b / gcd(a, b)
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a / gcd(a, b) * b); // 先除后乘避免溢出
}

// ============================================================
// 4. 试除法求约数
// AcWing 869. 试除法求约数
// 核心思路：约数成对出现，若 d 是 n 的约数，则 n/d 也是，只需检查到 sqrt(n)
// 时间复杂度：O(sqrt(n))
// 空间复杂度：O(sqrt(n))（存储约数）
// ============================================================

// 方法1：试除法求所有约数（推荐）— 返回排序后的约数列表
function getDivisors(n: number): number[] {
  if (n <= 0) return [];
  const divisors: number[] = [];
  // 收集小因子
  const bigDivisors: number[] = []; // 收集大因子（n/d），保证有序
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divisors.push(i);
      if (i !== n / i) {
        bigDivisors.push(n / i);
      }
    }
  }
  // 合并：小因子正序 + 大因子逆序
  return divisors.concat(bigDivisors.reverse());
}

// 方法2：试除法求约数个数
// 核心思路：n = p1^a1 * p2^a2 * ... * pk^ak，约数个数 = (a1+1) * (a2+1) * ... * (ak+1)
function countDivisors(n: number): number {
  if (n <= 0) return 0;
  let count = 1;
  for (let i = 2; i * i <= n; i++) {
    let exponent = 0;
    while (n % i === 0) {
      exponent++;
      n = Math.floor(n / i);
    }
    if (exponent > 0) {
      count *= (exponent + 1);
    }
  }
  if (n > 1) count *= 2; // 剩余的质因子，指数为 1
  return count;
}

// 方法3：试除法求约数之和
// 核心思路：约数之和 = (1+p1+p1^2+...+p1^a1) * (1+p2+...+p2^a2) * ...
function sumDivisors(n: number): number {
  if (n <= 0) return 0;
  let sum = 1;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      let term = 1;   // 当前质因子贡献项
      let power = 1;  // p^k
      while (n % i === 0) {
        power *= i;
        term += power;
        n = Math.floor(n / i);
      }
      sum *= term;
    }
  }
  if (n > 1) sum *= (1 + n); // 剩余质因子贡献 (1 + p)
  return sum;
}

// ============================================================
// 5. Nim 游戏
// LeetCode 292. Nim Game / AcWing 891. Nim游戏
// 题意：n 堆石子，两人轮流从某一堆取任意多个，取走最后一个石子者胜
// 核心思路：Bouton 定理 — 先手必胜当且仅当所有堆石子数的异或值不为 0
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：异或值判断（推荐）— SG 定论在 Nim 中的直接应用
function canWinNim(piles: number[]): boolean {
  let xorSum = 0;
  for (const pile of piles) {
    xorSum ^= pile;
  }
  return xorSum !== 0; // 异或值非零，先手必胜
}

// 方法2：LeetCode 292 简化版 — 只有一堆且每次最多取 3 个
// 先手必败当且仅当 n 是 4 的倍数
function canWinNimSimple(n: number): boolean {
  return n % 4 !== 0;
}

// 方法3：带策略的 Nim — 返回先手第一步的最优取法
function nimFirstMove(piles: number[]): { pileIndex: number; takeCount: number } | null {
  let xorSum = 0;
  for (const pile of piles) {
    xorSum ^= pile;
  }
  // 异或值为 0，先手必败，无必胜策略
  if (xorSum === 0) return null;

  // 找到某一堆，取走若干石子后使剩余异或值为 0
  for (let i = 0; i < piles.length; i++) {
    // 取走后 piles[i] 变为 piles[i] ^ xorSum
    const target = piles[i] ^ xorSum;
    if (target < piles[i]) {
      return { pileIndex: i, takeCount: piles[i] - target };
    }
  }
  return null; // 理论上不会到这里
}

// ============================================================
// 6. 快速幂
// AcWing 875. 快速幂 — 求 a^b % p
// 核心思路：将指数 b 分解为二进制，a^b = a^(b1) * a^(b2) * ... （bi 为 b 的二进制位）
// 时间复杂度：O(log b)
// 空间复杂度：O(1)
// ============================================================

// 安全乘法取模 — 避免 a*b 超过 Number.MAX_SAFE_INTEGER 导致精度丢失
// 核心思路：将乘法拆为加法，类似快速幂的思想：a * b % p
function mulMod(a: number, b: number, p: number): number {
  a = ((a % p) + p) % p;
  b = ((b % p) + p) % p;
  let result = 0;
  while (b > 0) {
    if (b & 1) {
      result = (result + a) % p;
    }
    a = (a + a) % p;
    b = b >>> 1;
  }
  return result;
}

// 方法1：快速幂迭代（推荐）— 二进制拆分指数，使用安全乘法避免溢出
function qpow(a: number, b: number, p: number): number {
  let result = 1;
  a = ((a % p) + p) % p; // 处理负数取模
  while (b > 0) {
    if (b & 1) {
      result = mulMod(result, a, p);
    }
    a = mulMod(a, a, p);
    b = b >>> 1; // 无符号右移
  }
  return result;
}

// 方法2：快速幂递归 — a^b = a^(b/2) * a^(b/2) * (b奇数时再乘a)，使用安全乘法
function qpowRecursive(a: number, b: number, p: number): number {
  if (b === 0) return 1 % p;
  a = ((a % p) + p) % p;
  const half = qpowRecursive(a, Math.floor(b / 2), p);
  let result = mulMod(half, half, p);
  if (b % 2 === 1) {
    result = mulMod(result, a, p);
  }
  return result;
}

// 方法3：快速幂求逆元 — 费马小定理：a^(p-2) ≡ a^(-1) (mod p)，p 为质数
function modInverse(a: number, p: number): number {
  return qpow(a, p - 2, p);
}

// 方法4：大数快速幂 — 使用 BigInt 避免溢出
function qpowBigInt(a: bigint, b: bigint, p: bigint): bigint {
  let result = 1n;
  a = ((a % p) + p) % p;
  while (b > 0n) {
    if (b & 1n) {
      result = (result * a) % p;
    }
    a = (a * a) % p;
    b = b >> 1n;
  }
  return result;
}

// ============================================================
// 7. Nim 游戏 - 台阶 Nim
// AcWing 892. 台阶-Nim游戏
// 题意：n 级台阶，每级上有若干石子，两人轮流操作，每次可以从某级台阶
//       取若干石子放到下一级，第 0 级为地面，取到地面不可再取，无石子可取者负
// 核心思路：等价于奇数级台阶上的石子做 Nim 游戏（偶数级不影响结果）
// 原因：从偶数级移到奇数级，对手可以继续移回偶数级，不改变奇数级异或值
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：奇数级异或判断（推荐）
function canWinStairNim(stairs: number[]): boolean {
  let xorSum = 0;
  // 只考虑奇数级台阶（索引从 1 开始）
  for (let i = 0; i < stairs.length; i++) {
    if ((i + 1) % 2 === 1) { // 第 1, 3, 5, ... 级
      xorSum ^= stairs[i];
    }
  }
  return xorSum !== 0;
}

// 方法2：从奇数级台阶的异或值推导策略
// 如果异或值非零，先手可以通过调整某个奇数级台阶的石子数使异或值为 0
function stairNimFirstMove(stairs: number[]): { stairIndex: number; moveCount: number } | null {
  let xorSum = 0;
  for (let i = 0; i < stairs.length; i++) {
    if ((i + 1) % 2 === 1) {
      xorSum ^= stairs[i];
    }
  }
  if (xorSum === 0) return null; // 先手必败

  // 找到奇数级台阶进行操作
  for (let i = 0; i < stairs.length; i++) {
    if ((i + 1) % 2 === 1) {
      const target = stairs[i] ^ xorSum;
      if (target < stairs[i]) {
        // 需要从第 i+1 级移走 stairs[i] - target 个石子到第 i 级
        return { stairIndex: i, moveCount: stairs[i] - target };
      }
    }
  }
  return null;
}

// 方法3：证明辅助 — 偶数级台阶的移动可被对手抵消
// 对手从偶数级移 k 个到奇数级，我方就从该奇数级移 k 个到下一个偶数级
// 这样奇数级异或值不变，局面始终对先手有利
function analyzeStairNim(stairs: number[]): string {
  let xorSum = 0;
  for (let i = 0; i < stairs.length; i++) {
    if ((i + 1) % 2 === 1) {
      xorSum ^= stairs[i];
    }
  }
  if (xorSum === 0) {
    return "先手必败：奇数级异或值为 0";
  }
  return `先手必胜：奇数级异或值 = ${xorSum}`;
}

// ============================================================
// 8. 扩展 Nim 游戏
// AcWing 893. 集合-Nim游戏（SG 函数）
// 题意：n 堆石子，每次可以从一堆中取走集合 S 中某个数的石子，取走最后一个者胜
// 核心思路：SG 定理 — 计算 SG(x) = mex{SG(x - s) | s ∈ S, s <= x}
//           整个游戏的 SG 值为各堆 SG 值的异或，非零则先手必胜
// 时间复杂度：O(n * maxPile * |S|)
// 空间复杂度：O(maxPile)
// ============================================================

// mex 函数：最小不在集合中的非负整数
function mex(set: Set<number>): number {
  let m = 0;
  while (set.has(m)) m++;
  return m;
}

// 方法1：递推求 SG 函数（推荐）— 用记忆化数组
function computeSG(maxN: number, S: number[]): number[] {
  const sg = new Array(maxN + 1).fill(0);
  for (let i = 1; i <= maxN; i++) {
    const reachable = new Set<number>();
    for (const s of S) {
      if (i >= s) {
        reachable.add(sg[i - s]);
      }
    }
    sg[i] = mex(reachable);
  }
  return sg;
}

// 集合 Nim 游戏 — 判断先手是否必胜
function canWinSetNim(piles: number[], S: number[]): boolean {
  const maxPile = Math.max(...piles);
  const sg = computeSG(maxPile, S);

  let xorSum = 0;
  for (const pile of piles) {
    xorSum ^= sg[pile];
  }
  return xorSum !== 0;
}

// 方法2：递归 + 记忆化求 SG 函数
function computeSGMemo(maxN: number, S: number[]): number[] {
  const memo = new Array(maxN + 1).fill(-1);
  memo[0] = 0; // SG(0) = 0，无石子可取

  function sg(x: number): number {
    if (memo[x] !== -1) return memo[x];
    const reachable = new Set<number>();
    for (const s of S) {
      if (x >= s) {
        reachable.add(sg(x - s));
      }
    }
    memo[x] = mex(reachable);
    return memo[x];
  }

  for (let i = 0; i <= maxN; i++) {
    sg(i);
  }
  return memo;
}

// 方法3：扩展 — 拆分 Nim 游戏（AcWing 894）
// 题意：每次操作可以将一堆石子分成两堆非空石子（两堆之和 <= 原堆）
// 核心思路：SG(x) = mex{SG(i) XOR SG(x-i) | 1 <= i < x}
// 一堆分成两堆，相当于两个独立子游戏的组合，SG 值为两者异或
function canWinSplitNim(piles: number[]): boolean {
  const maxPile = Math.max(...piles);
  const sg = new Array(maxPile + 1).fill(0);

  for (let i = 1; i <= maxPile; i++) {
    const reachable = new Set<number>();
    for (let j = 1; j < i; j++) {
      // 分成 j 和 i-j 两堆，SG 值为两堆 SG 异或
      reachable.add(sg[j] ^ sg[i - j]);
    }
    sg[i] = mex(reachable);
  }

  let xorSum = 0;
  for (const pile of piles) {
    xorSum ^= sg[pile];
  }
  return xorSum !== 0;
}

// ============================================================
// 测试
// ============================================================

console.log("===== 1. 试除法判定质数 =====");
console.log(isPrime(1));       // false
console.log(isPrime(2));       // true
console.log(isPrime(7));       // true
console.log(isPrime(12));      // false
console.log(isPrime(97));      // true
console.log(isPrimeOptimized(97));   // true
console.log(isPrime6k(97));          // true
console.log(isPrime6k(1));           // false
console.log(isPrime6k(49));          // false (7*7)

console.log("\n===== 2. 筛质数 =====");
console.log(countPrimesEratosthenes(10));  // 4 (2,3,5,7)
console.log(countPrimesEratosthenes(100)); // 25
console.log(countPrimesLinear(100));       // 25
console.log(sievePrimes(20));              // [2,3,5,7,11,13,17,19]

console.log("\n===== 3. 最大公约数 =====");
console.log(gcd(12, 8));       // 4
console.log(gcd(7, 5));        // 1
console.log(gcdRecursive(12, 8)); // 4
console.log(gcdSubtraction(12, 8)); // 4
console.log(lcm(12, 8));       // 24
console.log(lcm(7, 5));        // 35

console.log("\n===== 4. 试除法求约数 =====");
console.log(getDivisors(12));       // [1,2,3,4,6,12]
console.log(getDivisors(16));       // [1,2,4,8,16]
console.log(getDivisors(1));        // [1]
console.log(countDivisors(12));     // 6
console.log(countDivisors(16));     // 5
console.log(sumDivisors(12));       // 28 (1+2+3+4+6+12)
console.log(sumDivisors(6));        // 12 (1+2+3+6 = 12，完美数)

console.log("\n===== 5. Nim 游戏 =====");
console.log(canWinNim([1, 2, 3]));     // false (1^2^3 = 0)
console.log(canWinNim([1, 2, 4]));     // true  (1^2^4 = 7)
console.log(canWinNim([5, 5]));        // false (5^5 = 0)
console.log(canWinNimSimple(4));       // false
console.log(canWinNimSimple(5));       // true
console.log(nimFirstMove([1, 2, 4]));  // { pileIndex: 2, takeCount: 3 } → 将第3堆4改为1

console.log("\n===== 6. 快速幂 =====");
console.log(qpow(2, 10, 1000000007));    // 1024
console.log(qpow(3, 13, 1000000007));    // 1594323
console.log(qpow(2, 100, 1000000007));   // 976371285
console.log(qpowRecursive(2, 10, 1000000007)); // 1024
console.log(modInverse(3, 7));           // 5 (3*5=15≡1 mod 7)
console.log(qpowBigInt(2n, 100n, 1000000007n)); // 976371285n

console.log("\n===== 7. Nim 游戏 - 台阶 =====");
// 台阶 [3,2,1]：第1级3个，第2级2个，第3级1个
// 奇数级异或 = 3 ^ 1 = 2 ≠ 0，先手必胜
console.log(canWinStairNim([3, 2, 1]));  // true
// 台阶 [1,1]：第1级1个，第2级1个
// 奇数级异或 = 1 ≠ 0，先手必胜
console.log(canWinStairNim([1, 1]));     // true
console.log(analyzeStairNim([3, 2, 1])); // 先手必胜：奇数级异或值 = 2

console.log("\n===== 8. 扩展 Nim 游戏 =====");
// 集合 S = {2, 5}，石子堆 [5, 5]
// SG(0)=0, SG(1)=0, SG(2)=1, SG(3)=0, SG(4)=1, SG(5)=2
// 5^5 = 0，先手必败
console.log(canWinSetNim([5, 5], [2, 5]));   // false
// 集合 S = {2, 5}，石子堆 [5, 6]
// SG(5)=2, SG(6)=0, 2^0=2≠0，先手必胜
console.log(canWinSetNim([5, 6], [2, 5]));   // true
// 拆分 Nim，石子堆 [1, 2, 3]
console.log(canWinSplitNim([1, 2, 3]));       // 结果取决于 SG 值

export {};
