// ============================================================
// 位运算 & 二叉树经典算法 - TypeScript 解题合集
// ============================================================

// -------------------- 二叉树节点定义 --------------------
export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
    this.val = val === undefined ? 0 : val;
    this.left = left === undefined ? null : left;
    this.right = right === undefined ? null : right;
  }
}

// ============================================================
// 1. 最大公约数 (GCD)
// ============================================================

// 方法1：辗转相除法（欧几里得算法）- 推荐
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

// 方法2：递归版辗转相除
function gcdRecursive(a: number, b: number): number {
  if (b === 0) return Math.abs(a);
  return gcdRecursive(b, a % b);
}

// 方法3：更相减损术 - 避免取模运算
function gcdSubtraction(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (a === 0) return b;
  if (b === 0) return a;
  while (a !== b) {
    if (a > b) a -= b;
    else b -= a;
  }
  return a;
}

// 方法4： Stein 算法（二进制 GCD）- 位运算优化
function gcdStein(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  if (a === 0) return b;
  if (b === 0) return a;

  // 找到公共的 2 的因子
  let shift = 0;
  while (((a | b) & 1) === 0) {
    a >>= 1;
    b >>= 1;
    shift++;
  }

  // 确保 a 为奇数
  while ((a & 1) === 0) a >>= 1;

  do {
    while ((b & 1) === 0) b >>= 1;
    if (a > b) [a, b] = [b, a];
    b -= a;
  } while (b !== 0);

  return a << shift;
}

// 拓展：最小公倍数 LCM = a * b / gcd(a, b)
function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / gcd(a, b)) * b); // 先除后乘避免溢出
}

// ============================================================
// 2. 求不重复的元素的异或和
// 数组中仅出现一次的元素异或起来（所有不重复元素求异或和）
// 变体：数组中只出现一次的数字（其余出现两次）
// LeetCode 136. Single Number 的扩展
// ============================================================

// 方法1：利用异或性质 — 相同元素异或为 0，a ^ 0 = a
// 如果数组中每个不重复元素只出现一次，其余出现偶数次
function xorSumOfUnique(nums: number[]): number {
  return nums.reduce((acc, num) => acc ^ num, 0);
}

// 方法2：哈希表统计频次，对只出现一次的元素异或
function xorSumOfUniqueByMap(nums: number[]): number {
  const freq = new Map<number, number>();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  let result = 0;
  for (const [num, count] of freq) {
    if (count === 1) result ^= num;
  }
  return result;
}

// 方法3：Set 巧用 — 出现两次的异或抵消
// 先全部异或，再用 Set 去重后异或，两者异或即为出现一次的元素异或和
function xorSumOfUniqueBySet(nums: number[]): number {
  let allXor = 0;
  let uniqueXor = 0;
  const seen = new Set<number>();

  for (const num of nums) {
    allXor ^= num;
    if (!seen.has(num)) {
      uniqueXor ^= num;
      seen.add(num);
    }
  }

  // allXor = 只出现奇数次的异或结果
  // uniqueXor = 所有不重复元素的异或
  // 若元素只出现一次或两次：出现两次的元素 allXor 和 uniqueXor 都异或了，抵消
  // 出现一次的只出现在 uniqueXor 中
  // 简化：如果每个元素只出现1或2次，结果就是只出现1次的元素异或
  return uniqueXor;
}

// 方法4：排序 + 跳过重复
function xorSumOfUniqueBySort(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  let result = 0;
  let i = 0;
  while (i < sorted.length) {
    // 检查是否只出现一次
    if (i + 1 < sorted.length && sorted[i] === sorted[i + 1]) {
      // 跳过所有相同元素
      const val = sorted[i];
      while (i < sorted.length && sorted[i] === val) i++;
    } else {
      result ^= sorted[i];
      i++;
    }
  }
  return result;
}

// ============================================================
// 3. 筛质数
// ============================================================

// 方法1：埃拉托斯特尼筛法 - 经典版
function sievePrimes(n: number): number[] {
  if (n < 2) return [];
  const isPrime = new Array<boolean>(n + 1).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
  }
  return primes;
}

// 方法2：线性筛（欧拉筛）- 每个合数只被最小质因子筛一次，O(n)
function linearSieve(n: number): number[] {
  if (n < 2) return [];
  const isPrime = new Array<boolean>(n + 1).fill(true);
  const primes: number[] = [];
  isPrime[0] = false;
  isPrime[1] = false;

  for (let i = 2; i <= n; i++) {
    if (isPrime[i]) primes.push(i);
    for (const p of primes) {
      if (i * p > n) break;
      isPrime[i * p] = false;
      if (i % p === 0) break; // 保证每个合数只被最小质因子筛一次
    }
  }

  return primes;
}

// 方法3：位运算优化筛法 — 用 BitArray 节省空间
function sievePrimesBitwise(n: number): number[] {
  if (n < 2) return [];
  // 每个 32 位整数可表示 32 个数的质数状态
  const size = Math.floor(n / 32) + 1;
  const bits = new Uint32Array(size); // 0 表示质数，1 表示合数

  const setComposite = (x: number) => {
    bits[Math.floor(x / 32)] |= 1 << (x % 32);
  };

  const isComposite = (x: number): boolean => {
    return (bits[Math.floor(x / 32)] & (1 << (x % 32))) !== 0;
  };

  setComposite(0);
  setComposite(1);

  for (let i = 2; i * i <= n; i++) {
    if (!isComposite(i)) {
      for (let j = i * i; j <= n; j += i) {
        setComposite(j);
      }
    }
  }

  const primes: number[] = [];
  for (let i = 2; i <= n; i++) {
    if (!isComposite(i)) primes.push(i);
  }
  return primes;
}

// 方法4：分段筛法 — 适用于极大 n，减少内存占用
function segmentedSieve(n: number): number[] {
  if (n < 2) return [];
  const limit = Math.floor(Math.sqrt(n));

  // 先筛 [0, sqrt(n)] 范围内的质数
  const basePrimes = sievePrimes(limit);

  const primes: number[] = [...basePrimes];
  const segmentSize = Math.max(limit, 32768); // 段大小

  // 分段筛 [low, high]
  for (let low = limit + 1; low <= n; low += segmentSize) {
    const high = Math.min(low + segmentSize - 1, n);
    const isPrime = new Array<boolean>(high - low + 1).fill(true);

    for (const p of basePrimes) {
      // 找到 [low, high] 中第一个 p 的倍数
      const start = Math.max(p * p, Math.ceil(low / p) * p);
      for (let j = start; j <= high; j += p) {
        isPrime[j - low] = false;
      }
    }

    for (let i = 0; i < isPrime.length; i++) {
      if (isPrime[i]) primes.push(low + i);
    }
  }

  return primes;
}

// ============================================================
// 4. 汉明距离
// LeetCode 461. Hamming Distance
// ============================================================

// 方法1：异或 + 计数 — 推荐
function hammingDistance(x: number, y: number): number {
  let xor = x ^ y;
  let count = 0;
  while (xor !== 0) {
    count += xor & 1;
    xor >>= 1;
  }
  return count;
}

// 方法2：Brian Kernighan 算法 — 每次消除最低位的 1
function hammingDistanceKernighan(x: number, y: number): number {
  let xor = x ^ y;
  let count = 0;
  while (xor !== 0) {
    xor &= xor - 1; // 消除最低位的 1
    count++;
  }
  return count;
}

// 方法3：内置函数
function hammingDistanceBuiltin(x: number, y: number): number {
  return (x ^ y).toString(2).replace(/0/g, "").length;
}

// 方法4：查表法 — 预计算 0~255 的 bit count
const BIT_COUNT_TABLE = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  BIT_COUNT_TABLE[i] = BIT_COUNT_TABLE[i >> 1] + (i & 1);
}

function hammingDistanceLookup(x: number, y: number): number {
  const xor = x ^ y;
  return (
    BIT_COUNT_TABLE[xor & 0xff] +
    BIT_COUNT_TABLE[(xor >> 8) & 0xff] +
    BIT_COUNT_TABLE[(xor >> 16) & 0xff] +
    BIT_COUNT_TABLE[(xor >> 24) & 0xff]
  );
}

// ============================================================
// 5. Nim 游戏
// LeetCode 292. Nim Game
// ============================================================

// 方法1：数学规律 — 如果 n 不是 4 的倍数，先手必赢
// 原理：4k 个石头时，无论先手拿 1/2/3 个，后手都能凑成 4，最终后手赢
function canWinNim(n: number): boolean {
  return n % 4 !== 0;
}

// 方法2：位运算判断
function canWinNimBitwise(n: number): boolean {
  // n & 3 === 0 等价于 n % 4 === 0
  return (n & 3) !== 0;
}

// 方法3：动态规划（仅适用于小规模，理解用）
function canWinNimDP(n: number): boolean {
  if (n <= 3) return true;
  // dp[i] = 拿 i 个石头时先手是否能赢
  // 只要存在 1/2/3 中拿完后对手不能赢的情况，先手就能赢
  const dp: boolean[] = new Array(n + 1);
  dp[0] = false;
  dp[1] = true;
  dp[2] = true;
  dp[3] = true;

  for (let i = 4; i <= n; i++) {
    // 先手拿 1/2/3 后，剩下 i-1/i-2/i-3
    // 如果对手在任一剩余状态下不能赢，先手就能赢
    dp[i] = !dp[i - 1] || !dp[i - 2] || !dp[i - 3];
  }

  return dp[n];
}

// 方法4：博弈论 SG 函数（Sprague-Grundy）
// Nim 游戏中 SG(x) = x % (m+1)，m=3（每次最多拿3个）
function canWinNimSG(n: number): boolean {
  // SG 值非零则先手必赢
  return n % 4 !== 0;
}

// ============================================================
// 6. 最大连续 1 的个数
// LeetCode 485. Max Consecutive Ones
// ============================================================

// 方法1：一次遍历 — 推荐
function findMaxConsecutiveOnes(nums: number[]): number {
  let maxCount = 0;
  let count = 0;

  for (const num of nums) {
    if (num === 1) {
      count++;
      maxCount = Math.max(maxCount, count);
    } else {
      count = 0;
    }
  }

  return maxCount;
}

// 方法2：滑动窗口
function findMaxConsecutiveOnesSlidingWindow(nums: number[]): number {
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) {
      left = right + 1;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// 方法3：利用 join + split
function findMaxConsecutiveOnesSplit(nums: number[]): number {
  const str = nums.join("");
  const parts = str.split("0");
  return Math.max(...parts.map((s) => s.length));
}

// 方法4：位运算分组（仅适用于纯 0/1 数组）
function findMaxConsecutiveOnesBitwise(nums: number[]): number {
  let maxCount = 0;
  let count = 0;
  for (const num of nums) {
    // num & 1 比 num === 1 更通用，但本题为 0/1 数组
    count = (count + (num & 1)) * (num & 1); // 遇 0 归零，遇 1 加 1
    maxCount = Math.max(maxCount, count);
  }
  return maxCount;
}

// 变体：最大连续 1 的个数 III（允许翻转 k 个 0）
// LeetCode 1004. Max Consecutive Ones III
function longestOnes(nums: number[], k: number): number {
  let left = 0;
  let zeroCount = 0;
  let maxLen = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeroCount++;

    while (zeroCount > k) {
      if (nums[left] === 0) zeroCount--;
      left++;
    }

    maxLen = Math.max(maxLen, right - left + 1);
  }

  return maxLen;
}

// ============================================================
// 7. 判断是奇数还是偶数
// ============================================================

// 方法1：取模运算
function isOddByMod(n: number): boolean {
  return n % 2 !== 0;
}

// 方法2：位运算 — 推荐，最低位为 1 则奇数
function isOddByBit(n: number): boolean {
  return (n & 1) === 1;
}

// 方法3：位运算 — 偶数判断
function isEvenByBit(n: number): boolean {
  return (n & 1) === 0;
}

// 方法4：利用 Math.abs 避免负数取模陷阱
function isOddSafe(n: number): boolean {
  return Math.abs(n) % 2 === 1;
}

// 方法5：异或运算
function isOddByXor(n: number): boolean {
  // n ^ 1 === n + 1 说明最低位为 0（偶数）
  // n ^ 1 === n - 1 说明最低位为 1（奇数）
  return (n ^ 1) === n - 1;
}

// ============================================================
// 8. 2 的幂
// LeetCode 231. Power of Two
// ============================================================

// 方法1：位运算 — 推荐
// 2 的幂的二进制只有一个 1，n & (n-1) 消除最低位的 1 后应为 0
function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

// 方法2：利用 2 的幂的性质 — 最大的 2 的幂整除 n
function isPowerOfTwoMod(n: number): boolean {
  // 2^30 是 32 位有符号整数中最大的 2 的幂
  return n > 0 && (1 << 30) % n === 0;
}

// 方法3：计数 1 的个数
function isPowerOfTwoCountBit(n: number): boolean {
  return n > 0 && n.toString(2).replace(/0/g, "").length === 1;
}

// 方法4：对数法
function isPowerOfTwoLog(n: number): boolean {
  if (n <= 0) return false;
  const log2n = Math.log2(n);
  return Number.isInteger(log2n);
}

// 方法5：递归法
function isPowerOfTwoRecursive(n: number): boolean {
  if (n <= 0) return false;
  if (n === 1) return true;
  if (n % 2 !== 0) return false;
  return isPowerOfTwoRecursive(n / 2);
}

// ============================================================
// 9. 最小的 2 的幂（大于等于 n 的最小 2 的幂）
// ============================================================

// 方法1：位运算填充 — 推荐 O(1)
// 将 n 最高位以下的位全部填 1，然后 +1
function nextPowerOfTwo(n: number): number {
  if (n <= 1) return 1;

  n--; // 防止 n 本身就是 2 的幂
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  n++; // 进位得到 2 的幂

  return n;
}

// 方法2：Math.clz32 — 计算前导零个数
function nextPowerOfTwoClz(n: number): number {
  if (n <= 1) return 1;
  // 32 - 前导零个数 = 有效位数
  const bits = 32 - Math.clz32(n - 1);
  return 1 << bits;
}

// 方法3：循环左移
function nextPowerOfTwoLoop(n: number): number {
  if (n <= 1) return 1;
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

// 方法4：对数法
function nextPowerOfTwoLog(n: number): number {
  if (n <= 1) return 1;
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

// ============================================================
// 10. 缺失的数字
// LeetCode 268. Missing Number
// ============================================================

// 方法1：异或法 — 推荐 O(n) O(1)
// 将 0~n 的所有数与数组元素异或，剩下的就是缺失的数字
function missingNumber(nums: number[]): number {
  let result = nums.length; // 初始为 n
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i]; // 异或索引和值
  }
  return result;
}

// 方法2：数学求和法
// 等差数列求和 - 数组实际和 = 缺失的数字
function missingNumberSum(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}

// 方法3：哈希表
function missingNumberHashSet(nums: number[]): number {
  const set = new Set(nums);
  for (let i = 0; i <= nums.length; i++) {
    if (!set.has(i)) return i;
  }
  return -1;
}

// 方法4：排序法
function missingNumberSort(nums: number[]): number {
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i) return i;
  }
  return nums.length;
}

// 方法5：原地标记法（将对应索引的数取负）
function missingNumberMark(nums: number[]): number {
  const n = nums.length;
  // 先把所有数变为正
  for (let i = 0; i < n; i++) {
    const idx = Math.abs(nums[i]);
    if (idx < n) {
      nums[idx] = -Math.abs(nums[idx]);
    }
  }
  // 找到第一个正数的位置
  for (let i = 0; i < n; i++) {
    if (nums[i] > 0) return i;
  }
  return n;
}

// ============================================================
// 11. 整数中 1 的个数（汉明重量）
// LeetCode 191. Number of 1 Bits
// ============================================================

// 方法1：Brian Kernighan — 推荐，只循环 1 的个数次
function hammingWeight(n: number): number {
  let count = 0;
  // 注意 JS 中 n 是无符号 32 位整数，需用 >>> 0 转换
  n = n >>> 0;
  while (n !== 0) {
    n &= n - 1; // 消除最低位的 1
    count++;
  }
  return count;
}

// 方法2：逐位检查
function hammingWeightBitByBit(n: number): number {
  let count = 0;
  n = n >>> 0;
  for (let i = 0; i < 32; i++) {
    count += (n >> i) & 1;
  }
  return count;
}

// 方法3：分治法 — 并行计算
function hammingWeightParallel(n: number): number {
  n = n >>> 0;
  // 每 2 位一组，计算 1 的个数
  n = n - ((n >> 1) & 0x55555555);
  // 每 4 位一组
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  // 每 8 位一组
  n = (n + (n >> 4)) & 0x0f0f0f0f;
  // 每 16 位 → 32 位
  n = n + (n >> 8);
  n = n + (n >> 16);
  return n & 0x3f;
}

// 方法4：查表法
function hammingWeightLookup(n: number): number {
  n = n >>> 0;
  return (
    BIT_COUNT_TABLE[n & 0xff] +
    BIT_COUNT_TABLE[(n >> 8) & 0xff] +
    BIT_COUNT_TABLE[(n >> 16) & 0xff] +
    BIT_COUNT_TABLE[(n >> 24) & 0xff]
  );
}

// 方法5：toString
function hammingWeightString(n: number): number {
  return (n >>> 0).toString(2).replace(/0/g, "").length;
}

// ============================================================
// 12. 高效交换两个数
// ============================================================

// 方法1：解构赋值 — TS/JS 中最推荐
function swapDestructure(a: number, b: number): [number, number] {
  [a, b] = [b, a];
  return [a, b];
}

// 方法2：异或交换 — 不需要临时变量
// 原理：a ^ a = 0, a ^ 0 = a
function swapXor(a: number, b: number): [number, number] {
  a = a ^ b;
  b = a ^ b; // (a ^ b) ^ b = a
  a = a ^ b; // (a ^ b) ^ a = b
  return [a, b];
}

// 方法3：加减法交换 — 不需要临时变量
function swapArithmetic(a: number, b: number): [number, number] {
  a = a + b;
  b = a - b; // (a + b) - b = a
  a = a - b; // (a + b) - a = b
  return [a, b];
}

// 方法4：临时变量法 — 最通用
function swapTemp(a: number, b: number): [number, number] {
  const temp = a;
  a = b;
  b = temp;
  return [a, b];
}

// 方法5：对象/数组包装（原地修改）
function swapInPlace(arr: number[], i: number, j: number): void {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

// 异或交换注意事项：
// 1. a 和 b 不能指向同一内存地址，否则 a ^ a = 0
// 2. 适用于整数，浮点数有精度问题
// 3. 实际工程中推荐解构赋值，异或交换主要用于面试/底层优化

// ============================================================
// 13. 单一元素
// LeetCode 136. Single Number
// ============================================================

// 方法1：异或 — 推荐 O(n) O(1)
// a ^ a = 0, a ^ 0 = a，所有成对元素异或抵消
function singleNumber(nums: number[]): number {
  return nums.reduce((acc, num) => acc ^ num, 0);
}

// 方法2：哈希表 — O(n) O(n)
function singleNumberHashMap(nums: number[]): number {
  const seen = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) {
      seen.delete(num);
    } else {
      seen.add(num);
    }
  }
  return seen.values().next().value as number;
}

// 方法3：数学法
// 2 * (不重复元素之和) - 所有元素之和 = 单一元素
function singleNumberMath(nums: number[]): number {
  const uniqueSum = [...new Set(nums)].reduce((a, b) => a + b, 0);
  const totalSum = nums.reduce((a, b) => a + b, 0);
  return 2 * uniqueSum - totalSum;
}

// 方法4：排序 + 相邻比较
function singleNumberSort(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  for (let i = 0; i < sorted.length - 1; i += 2) {
    if (sorted[i] !== sorted[i + 1]) return sorted[i];
  }
  return sorted[sorted.length - 1];
}

// 变体：LeetCode 137. Single Number II — 其余元素出现 3 次
function singleNumberII(nums: number[]): number {
  let ones = 0,
    twos = 0;
  for (const num of nums) {
    ones = (ones ^ num) & ~twos;
    twos = (twos ^ num) & ~ones;
  }
  return ones;
}

// 变体：LeetCode 260. Single Number III — 两个单一元素
function singleNumberIII(nums: number[]): [number, number] {
  let xor = nums.reduce((a, b) => a ^ b, 0);
  // 找到最低位不同的位
  const diff = xor & -xor;
  let num1 = 0,
    num2 = 0;
  for (const num of nums) {
    if ((num & diff) === 0) {
      num1 ^= num;
    } else {
      num2 ^= num;
    }
  }
  return [num1, num2];
}

// ============================================================
// 14. 括号匹配
// LeetCode 20. Valid Parentheses
// ============================================================

// 方法1：栈 — 推荐
function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    ")": "(",
    "]": "[",
    "}": "{",
  };

  for (const char of s) {
    if (char === "(" || char === "[" || char === "{") {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }

  return stack.length === 0;
}

// 方法2：替换法 — 每次消去最内层的括号对
function isValidParenthesesReplace(s: string): boolean {
  let prev = "";
  while (prev !== s) {
    prev = s;
    s = s.replace("()", "").replace("[]", "").replace("{}", "");
  }
  return s.length === 0;
}

// 方法3：栈 + 编号映射（更通用）
function isValidParenthesesNumber(s: string): boolean {
  const stack: number[] = [];
  // 开括号用正数，闭括号用负数，匹配的开闭括号绝对值相同
  const pairs: Record<string, number> = {
    "(": 1,
    ")": -1,
    "[": 2,
    "]": -2,
    "{": 3,
    "}": -3,
  };

  for (const char of s) {
    const id = pairs[char];
    if (id > 0) {
      stack.push(id);
    } else {
      if (stack.length === 0 || stack.pop() !== -id) return false;
    }
  }

  return stack.length === 0;
}

// 方法4：计数法 — 仅适用于单一括号类型 "(()())"
function isValidSingleParentheses(s: string): boolean {
  let count = 0;
  for (const char of s) {
    if (char === "(") count++;
    else if (char === ")") count--;
    if (count < 0) return false; // 右括号先出现
  }
  return count === 0;
}

// ============================================================
// 15. 二叉树的最大深度
// LeetCode 104. Maximum Depth of Binary Tree
// ============================================================

// 方法1：递归 DFS — 推荐
function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 方法2：BFS 层序遍历
function maxDepthBFS(root: TreeNode | null): number {
  if (root === null) return 0;

  const queue: TreeNode[] = [root];
  let depth = 0;

  while (queue.length > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    depth++;
  }

  return depth;
}

// 方法3：迭代 DFS + 栈（记录深度）
function maxDepthDFSStack(root: TreeNode | null): number {
  if (root === null) return 0;

  const stack: [TreeNode, number][] = [[root, 1]];
  let maxDepthVal = 0;

  while (stack.length > 0) {
    const [node, depth] = stack.pop()!;
    maxDepthVal = Math.max(maxDepthVal, depth);
    if (node.left) stack.push([node.left, depth + 1]);
    if (node.right) stack.push([node.right, depth + 1]);
  }

  return maxDepthVal;
}

// 方法4：后序遍历迭代
function maxDepthPostOrder(root: TreeNode | null): number {
  if (root === null) return 0;

  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;
  let lastVisited: TreeNode | null = null;
  let depth = 0;
  let maxDepthVal = 0;

  while (current || stack.length > 0) {
    if (current) {
      stack.push(current);
      depth++;
      maxDepthVal = Math.max(maxDepthVal, depth);
      current = current.left;
    } else {
      const peekNode = stack[stack.length - 1];
      if (peekNode.right && peekNode.right !== lastVisited) {
        current = peekNode.right;
      } else {
        stack.pop();
        depth--;
        lastVisited = peekNode;
      }
    }
  }

  return maxDepthVal;
}

// ============================================================
// 16. 二叉树的最小深度
// LeetCode 111. Minimum Depth of Binary Tree
// ============================================================

// 方法1：递归 DFS — 推荐
// 注意：最小深度是到最近叶子节点的最短路径
function minDepth(root: TreeNode | null): number {
  if (root === null) return 0;

  // 叶子节点
  if (root.left === null && root.right === null) return 1;

  // 只有一棵子树时，只能走那棵子树
  if (root.left === null) return 1 + minDepth(root.right);
  if (root.right === null) return 1 + minDepth(root.left);

  // 两棵子树都有，取最小值
  return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

// 方法2：BFS — 找到第一个叶子节点即返回，更高效
function minDepthBFS(root: TreeNode | null): number {
  if (root === null) return 0;

  const queue: TreeNode[] = [root];
  let depth = 0;

  while (queue.length > 0) {
    depth++;
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node.left === null && node.right === null) return depth;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return depth;
}

// 方法3：迭代 DFS + 栈
function minDepthDFSStack(root: TreeNode | null): number {
  if (root === null) return 0;

  const stack: [TreeNode, number][] = [[root, 1]];
  let minDepthVal = Infinity;

  while (stack.length > 0) {
    const [node, depth] = stack.pop()!;
    if (node.left === null && node.right === null) {
      minDepthVal = Math.min(minDepthVal, depth);
    }
    if (node.left) stack.push([node.left, depth + 1]);
    if (node.right) stack.push([node.right, depth + 1]);
  }

  return minDepthVal;
}

// 方法4：使用 maxDepth 的变体 — 不推荐，效率低
function minDepthFromMax(root: TreeNode | null): number {
  if (root === null) return 0;
  if (root.left === null && root.right === null) return 1;

  const left = minDepthFromMax(root.left);
  const right = minDepthFromMax(root.right);

  // 如果某个子树为空，其深度为 0 不应参与比较
  if (root.left === null) return right + 1;
  if (root.right === null) return left + 1;
  return Math.min(left, right) + 1;
}

// ============================================================
// 17. 路径总和
// LeetCode 112. Path Sum
// ============================================================

// 方法1：递归 DFS — 推荐
function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;

  // 叶子节点：检查是否等于剩余值
  if (root.left === null && root.right === null) {
    return root.val === targetSum;
  }

  const remaining = targetSum - root.val;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}

// 方法2：迭代 DFS + 栈
function hasPathSumDFSStack(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;

  const stack: [TreeNode, number][] = [[root, root.val]];

  while (stack.length > 0) {
    const [node, sum] = stack.pop()!;

    if (node.left === null && node.right === null && sum === targetSum) {
      return true;
    }

    if (node.right) stack.push([node.right, sum + node.right.val]);
    if (node.left) stack.push([node.left, sum + node.left.val]);
  }

  return false;
}

// 方法3：BFS + 队列
function hasPathSumBFS(root: TreeNode | null, targetSum: number): boolean {
  if (root === null) return false;

  const queue: [TreeNode, number][] = [[root, root.val]];

  while (queue.length > 0) {
    const [node, sum] = queue.shift()!;

    if (node.left === null && node.right === null && sum === targetSum) {
      return true;
    }

    if (node.left) queue.push([node.left, sum + node.left.val]);
    if (node.right) queue.push([node.right, sum + node.right.val]);
  }

  return false;
}

// 方法4：回溯法
function hasPathSumBacktrack(
  root: TreeNode | null,
  targetSum: number,
): boolean {
  const backtrack = (node: TreeNode | null, currentSum: number): boolean => {
    if (node === null) return false;
    currentSum += node.val;

    if (node.left === null && node.right === null) {
      return currentSum === targetSum;
    }

    if (backtrack(node.left, currentSum)) return true;
    if (backtrack(node.right, currentSum)) return true;

    return false;
  };

  return backtrack(root, 0);
}

// 变体：LeetCode 113. Path Sum II — 返回所有路径
function pathSumII(root: TreeNode | null, targetSum: number): number[][] {
  const result: number[][] = [];

  const backtrack = (
    node: TreeNode | null,
    remaining: number,
    path: number[],
  ) => {
    if (node === null) return;
    path.push(node.val);

    if (node.left === null && node.right === null && remaining === node.val) {
      result.push([...path]);
    }

    backtrack(node.left, remaining - node.val, path);
    backtrack(node.right, remaining - node.val, path);
    path.pop(); // 回溯
  };

  backtrack(root, targetSum, []);
  return result;
}

// ============================================================
// 18. 对称二叉树
// LeetCode 101. Symmetric Tree
// ============================================================

// 方法1：递归 — 推荐
function isSymmetric(root: TreeNode | null): boolean {
  if (root === null) return true;

  const isMirror = (left: TreeNode | null, right: TreeNode | null): boolean => {
    if (left === null && right === null) return true;
    if (left === null || right === null) return false;
    return (
      left.val === right.val &&
      isMirror(left.left, right.right) &&
      isMirror(left.right, right.left)
    );
  };

  return isMirror(root.left, root.right);
}

// 方法2：迭代 — 队列（BFS 变体）
function isSymmetricIterative(root: TreeNode | null): boolean {
  if (root === null) return true;

  const queue: (TreeNode | null)[] = [root.left, root.right];

  while (queue.length > 0) {
    const left = queue.shift()!;
    const right = queue.shift()!;

    if (left === null && right === null) continue;
    if (left === null || right === null) return false;
    if (left.val !== right.val) return false;

    queue.push(left.left, right.right); // 外侧配对
    queue.push(left.right, right.left); // 内侧配对
  }

  return true;
}

// 方法3：迭代 — 栈
function isSymmetricStack(root: TreeNode | null): boolean {
  if (root === null) return true;

  const stack: (TreeNode | null)[] = [root.left, root.right];

  while (stack.length > 0) {
    const right = stack.pop()!;
    const left = stack.pop()!;

    if (left === null && right === null) continue;
    if (left === null || right === null) return false;
    if (left.val !== right.val) return false;

    stack.push(left.left, right.right);
    stack.push(left.right, right.left);
  }

  return true;
}

// 方法4：序列化比较 — 中序遍历 + 反转比较
function isSymmetricSerialize(root: TreeNode | null): boolean {
  if (root === null) return true;

  const serialize = (node: TreeNode | null, isReverse: boolean): string => {
    if (node === null) return "#";
    const left = isReverse ? node.right : node.left;
    const right = isReverse ? node.left : node.right;
    return `${node.val},${serialize(left, isReverse)},${serialize(right, isReverse)}`;
  };

  return serialize(root.left, false) === serialize(root.right, true);
}

// ============================================================
// 19. 压缩字符串
// LeetCode 443. String Compression
// ============================================================

// 方法1：原地压缩 — 推荐 O(n) O(1)
// 返回压缩后的长度，将结果写入 chars 前 len 位
function compress(chars: string[]): number {
  let write = 0; // 写入位置
  let read = 0; // 读取位置

  while (read < chars.length) {
    const char = chars[read];
    let count = 0;

    // 统计连续相同字符
    while (read < chars.length && chars[read] === char) {
      read++;
      count++;
    }

    // 写入字符
    chars[write++] = char;

    // 写入计数（如果 > 1）
    if (count > 1) {
      const countStr = count.toString();
      for (const digit of countStr) {
        chars[write++] = digit;
      }
    }
  }

  return write;
}

// 方法2：分组统计（返回压缩后字符串）
function compressToString(s: string): string {
  if (s.length === 0) return "";

  const groups: [string, number][] = [];
  let current = s[0];
  let count = 1;

  for (let i = 1; i < s.length; i++) {
    if (s[i] === current) {
      count++;
    } else {
      groups.push([current, count]);
      current = s[i];
      count = 1;
    }
  }
  groups.push([current, count]);

  return groups
    .map(([char, cnt]) => (cnt === 1 ? char : `${char}${cnt}`))
    .join("");
}

// 方法3：正则表达式
function compressByRegex(s: string): string {
  return s.replace(/(.)\1+/g, (match, char) => `${char}${match.length}`);
}

// 方法4：双指针原地（与方法1类似，不同写法）
function compressTwoPointer(chars: string[]): number {
  let anchor = 0; // 当前组的起始位置
  let write = 0; // 写入位置

  for (let read = 0; read <= chars.length; read++) {
    // 读到不同字符或末尾时，写入前一组
    if (read === chars.length || chars[read] !== chars[anchor]) {
      chars[write++] = chars[anchor];

      const count = read - anchor;
      if (count > 1) {
        const digits = count.toString();
        for (const d of digits) {
          chars[write++] = d;
        }
      }

      anchor = read;
    }
  }

  return write;
}

// 变体：解压字符串 "a3b2c" → "aaabbc"
function decompress(s: string): string {
  let result = "";
  let i = 0;

  while (i < s.length) {
    const char = s[i++];
    let count = 0;
    let hasDigit = false;

    while (i < s.length && /\d/.test(s[i])) {
      count = count * 10 + parseInt(s[i]);
      i++;
      hasDigit = true;
    }

    result += char.repeat(hasDigit ? count : 1);
  }

  return result;
}

// ============================================================
// 20. 二叉树的中序遍历
// LeetCode 94. Binary Tree Inorder Traversal
// ============================================================

// 方法1：递归 — 推荐
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];

  const inorder = (node: TreeNode | null) => {
    if (node === null) return;
    inorder(node.left);
    result.push(node.val);
    inorder(node.right);
  };

  inorder(root);
  return result;
}

// 方法2：迭代 + 栈
function inorderTraversalIterative(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current: TreeNode | null = root;

  while (current || stack.length > 0) {
    // 一路向左走到底
    while (current) {
      stack.push(current);
      current = current.left;
    }
    // 弹出并访问
    current = stack.pop()!;
    result.push(current.val);
    // 转向右子树
    current = current.right;
  }

  return result;
}

// 方法3：Morris 遍历 — O(1) 空间，不需要栈
// 利用线索二叉树的思想，临时修改树结构
function inorderTraversalMorris(root: TreeNode | null): number[] {
  const result: number[] = [];
  let current: TreeNode | null = root;

  while (current) {
    if (current.left === null) {
      result.push(current.val);
      current = current.right;
    } else {
      // 找到左子树中最右边的节点（前驱节点）
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }

      if (predecessor.right === null) {
        // 建立线索：前驱的右指针指向当前节点
        predecessor.right = current;
        current = current.left;
      } else {
        // 线索已存在，说明左子树已遍历完
        predecessor.right = null;
        result.push(current.val);
        current = current.right;
      }
    }
  }

  return result;
}

// 方法4：统一迭代法 — 用 null 标记待处理节点
function inorderTraversalUnified(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: (TreeNode | null)[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (node === null) continue;

    if (node instanceof TreeNode) {
      // 中序：右 → 根(null标记) → 左
      stack.push(node.right);
      stack.push(null); // 标记中间节点待处理
      stack.push(node.val as any as TreeNode); // 用值代替
      stack.push(node.left);
    } else {
      // 值节点（被 null 标记后的节点）
      result.push(node as unknown as number);
    }
  }

  return result;
}

// 方法5：方法4的修正版
function inorderTraversalUnifiedFix(root: TreeNode | null): number[] {
  const result: number[] = [];
  // 栈中存储节点或标记
  const stack: { node: TreeNode; visited: boolean }[] = [];

  if (root) stack.push({ node: root, visited: false });

  while (stack.length > 0) {
    const item = stack.pop()!;

    if (item.visited) {
      result.push(item.node.val);
    } else {
      // 中序：右 → 根(标记已访问) → 左
      if (item.node.right)
        stack.push({ node: item.node.right, visited: false });
      stack.push({ node: item.node, visited: true });
      if (item.node.left) stack.push({ node: item.node.left, visited: false });
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================

// --- 二叉树辅助函数 ---
function createTree(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  const root = new TreeNode(arr[0]!);
  const queue: TreeNode[] = [root];
  let i = 1;

  while (i < arr.length) {
    const node = queue.shift()!;
    if (i < arr.length && arr[i] !== null) {
      node.left = new TreeNode(arr[i]!);
      queue.push(node.left);
    }
    i++;
    if (i < arr.length && arr[i] !== null) {
      node.right = new TreeNode(arr[i]!);
      queue.push(node.right);
    }
    i++;
  }

  return root;
}

// --- 测试用例 ---
console.log("===== 1. 最大公约数 =====");
console.log(gcd(12, 8)); // 4
console.log(gcdRecursive(54, 24)); // 6
console.log(gcdStein(48, 18)); // 6
console.log(lcm(12, 8)); // 24

console.log("\n===== 2. 不重复元素的异或和 =====");
console.log(xorSumOfUnique([1, 2, 3, 2, 1])); // 3（只有 3 出现一次）
console.log(xorSumOfUniqueByMap([1, 2, 1, 3, 2, 4])); // 7 (3 ^ 4 = 7)
console.log(xorSumOfUniqueBySort([5, 5, 3])); // 3

console.log("\n===== 3. 筛质数 =====");
console.log(sievePrimes(30)); // [2,3,5,7,11,13,17,19,23,29]
console.log(linearSieve(20)); // [2,3,5,7,11,13,17,19]
console.log(sievePrimesBitwise(10)); // [2,3,5,7]

console.log("\n===== 4. 汉明距离 =====");
console.log(hammingDistance(1, 4)); // 2
console.log(hammingDistanceKernighan(3, 1)); // 1
console.log(hammingDistanceBuiltin(1, 4)); // 2

console.log("\n===== 5. Nim 游戏 =====");
console.log(canWinNim(4)); // false
console.log(canWinNim(5)); // true
console.log(canWinNimBitwise(8)); // false

console.log("\n===== 6. 最大连续 1 的个数 =====");
console.log(findMaxConsecutiveOnes([1, 1, 0, 1, 1, 1])); // 3
console.log(findMaxConsecutiveOnesSlidingWindow([1, 0, 1, 1, 0, 1])); // 2
console.log(longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)); // 6

console.log("\n===== 7. 奇偶判断 =====");
console.log(isOddByBit(3)); // true
console.log(isEvenByBit(4)); // true
console.log(isOddByBit(-3)); // true

console.log("\n===== 8. 2 的幂 =====");
console.log(isPowerOfTwo(16)); // true
console.log(isPowerOfTwo(3)); // false
console.log(isPowerOfTwoMod(1)); // true

console.log("\n===== 9. 最小的 2 的幂 =====");
console.log(nextPowerOfTwo(5)); // 8
console.log(nextPowerOfTwo(8)); // 8
console.log(nextPowerOfTwoClz(17)); // 32

console.log("\n===== 10. 缺失的数字 =====");
console.log(missingNumber([3, 0, 1])); // 2
console.log(missingNumberSum([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8

console.log("\n===== 11. 整数中 1 的个数 =====");
console.log(hammingWeight(11)); // 3 (1011)
console.log(hammingWeight(128)); // 1
console.log(hammingWeightParallel(11)); // 3

console.log("\n===== 12. 高效交换两个数 =====");
console.log(swapDestructure(3, 5)); // [5, 3]
console.log(swapXor(10, 20)); // [20, 10]
console.log(swapArithmetic(7, 13)); // [13, 7]

console.log("\n===== 13. 单一元素 =====");
console.log(singleNumber([4, 1, 2, 1, 2])); // 4
console.log(singleNumberII([2, 2, 3, 2])); // 3
console.log(singleNumberIII([1, 2, 1, 3, 2, 5])); // [3, 5]

console.log("\n===== 14. 括号匹配 =====");
console.log(isValidParentheses("()[]{}")); // true
console.log(isValidParentheses("([)]")); // false
console.log(isValidParenthesesReplace("{[]}")); // true

console.log("\n===== 15. 二叉树的最大深度 =====");
const tree15 = createTree([3, 9, 20, null, null, 15, 7]);
console.log(maxDepth(tree15)); // 3
console.log(maxDepthBFS(tree15)); // 3

console.log("\n===== 16. 二叉树的最小深度 =====");
const tree16 = createTree([3, 9, 20, null, null, 15, 7]);
console.log(minDepth(tree16)); // 2
console.log(minDepthBFS(tree16)); // 2

console.log("\n===== 17. 路径总和 =====");
const tree17 = createTree([
  5,
  4,
  8,
  11,
  null,
  13,
  4,
  7,
  2,
  null,
  null,
  null,
  1,
]);
console.log(hasPathSum(tree17, 22)); // true
console.log(hasPathSumDFSStack(tree17, 22)); // true

console.log("\n===== 18. 对称二叉树 =====");
const tree18 = createTree([1, 2, 2, 3, 4, 4, 3]);
console.log(isSymmetric(tree18)); // true
console.log(isSymmetricIterative(tree18)); // true
const tree18b = createTree([1, 2, 2, null, 3, null, 3]);
console.log(isSymmetric(tree18b)); // false

console.log("\n===== 19. 压缩字符串 =====");
const chars19 = ["a", "a", "b", "b", "c", "c", "c"];
console.log(compress(chars19), chars19.slice(0, 6)); // 6, ['a','2','b','2','c','3']
console.log(compressToString("aaabbc")); // "a3b2c"
console.log(decompress("a3b2c")); // "aaabbc"

console.log("\n===== 20. 二叉树的中序遍历 =====");
const tree20 = createTree([1, null, 2, 3]);
console.log(inorderTraversal(tree20)); // [1, 3, 2]
console.log(inorderTraversalIterative(tree20)); // [1, 3, 2]
console.log(inorderTraversalMorris(tree20)); // [1, 3, 2]

export {};
