// ============================================================
// 位运算面试题 - TypeScript 解题合集
// 主题：奇偶判断 / 交换两数 / 2的幂 / 最小2的幂 /
//       整数中1的个数 / 最大连续1 / 单一元素 / 缺失数字 /
//       汉明距离 / 异或和 / 只出现一次的数字 / 翻转二进制位 /
//       二进制1的个数 / 最大异或值
// ============================================================

// ============================================================
// 1. 判断是奇数还是偶数
// 利用位运算：最低位为 1 则奇数，为 0 则偶数
// ============================================================

// 方法1：位与运算 — 推荐
function isOdd(n: number): boolean {
  return (n & 1) === 1;
}

// 方法2：取模运算
function isOddByMod(n: number): boolean {
  return n % 2 !== 0;
}

// ============================================================
// 2. 高效交换两个数
// 利用异或性质：a ^ a = 0, a ^ 0 = a
// ============================================================

// 方法1：异或交换 — 无需临时变量 — 推荐
function swapXor(a: number, b: number): [number, number] {
  // 注意：a 和 b 不能指向同一内存地址，否则会归零
  a = a ^ b;
  b = a ^ b; // b = (a ^ b) ^ b = a
  a = a ^ b; // a = (a ^ b) ^ a = b
  return [a, b];
}

// 方法2：解构赋值交换（TypeScript 风格）
function swapDestructure(a: number, b: number): [number, number] {
  [a, b] = [b, a];
  return [a, b];
}

// 方法3：加减法交换 — 无需临时变量
function swapArithmetic(a: number, b: number): [number, number] {
  a = a + b;
  b = a - b; // b = (a + b) - b = a
  a = a - b; // a = (a + b) - a = b
  return [a, b];
}

// ============================================================
// 3. 2 的幂
// LeetCode 231. Power of Two
//
// 判断一个整数是否是 2 的幂次方
//
// 核心思路：
//   2 的幂的二进制表示中只有一个 1
//   n > 0 且 n & (n - 1) === 0
//   例：8 = 1000, 7 = 0111, 8 & 7 = 0
//
// 时间复杂度：O(1)
// 空间复杂度：O(1)
// ============================================================

// 方法1：n & (n - 1) — 推荐
function isPowerOfTwo(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

// 方法2：利用 n & (-n) 获取最低位的 1
function isPowerOfTwoByLowestBit(n: number): boolean {
  return n > 0 && (n & -n) === n;
}

// 方法3：递归
function isPowerOfTwoRecursive(n: number): boolean {
  if (n <= 0) return false;
  if (n === 1) return true;
  if (n % 2 !== 0) return false;
  return isPowerOfTwoRecursive(n / 2);
}

// ============================================================
// 4. 最小的 2 的幂
// 给定一个正整数 n，找到 >= n 的最小的 2 的幂
//
// 核心思路：
//   将 n 最高位以下的位全部填 1，然后 +1
//   例：n = 5 (101) → 填充后 111 → +1 = 1000 = 8
//
// 时间复杂度：O(1)（固定 5 次移位操作，适用于 32 位整数）
// 空间复杂度：O(1)
// ============================================================

// 方法1：位填充法 — 推荐
function nextPowerOfTwo(n: number): number {
  if (n <= 0) return 1;
  n--; // 处理 n 本身就是 2 的幂的情况
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  return n + 1;
}

// 方法2：Math.clz32 计算前导零
function nextPowerOfTwoByClz(n: number): number {
  if (n <= 0) return 1;
  if (n === 1) return 1;
  // 32 - 前导零个数 = 有效位数，1 左移该位数即可
  return 1 << (32 - Math.clz32(n - 1));
}

// 方法3：循环法
function nextPowerOfTwoByLoop(n: number): number {
  if (n <= 0) return 1;
  let power = 1;
  while (power < n) {
    power <<= 1;
  }
  return power;
}

// ============================================================
// 5. 整数中 1 的个数
// LeetCode 191. Number of 1 Bits / 剑指 Offer 15. 二进制中1的个数
//
// 统计一个无符号整数的二进制表示中 1 的个数
//
// 核心思路：
//   n & (n - 1) 可以消去最低位的 1
//   循环执行直到 n 为 0，统计次数
//
// 时间复杂度：O(k)，k 为 1 的个数
// 空间复杂度：O(1)
// ============================================================

// 方法1：Brian Kernighan 算法 — 推荐
function hammingWeight(n: number): number {
  let count = 0;
  while (n !== 0) {
    n &= n - 1; // 每次消去最低位的 1
    count++;
  }
  return count;
}

// 方法2：逐位检查
function hammingWeightByBit(n: number): number {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if ((n >> i) & 1) count++;
  }
  return count;
}

// 方法3：分治法（并行计数）
function hammingWeightParallel(n: number): number {
  // 每 2 位一组计数
  n = (n & 0x55555555) + ((n >>> 1) & 0x55555555);
  // 每 4 位一组计数
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  // 每 8 位一组计数
  n = (n & 0x0f0f0f0f) + ((n >>> 4) & 0x0f0f0f0f);
  // 每 16 位一组计数
  n = (n & 0x00ff00ff) + ((n >>> 8) & 0x00ff00ff);
  // 每 32 位一组计数
  n = (n & 0x0000ffff) + ((n >>> 16) & 0x0000ffff);
  return n;
}

// ============================================================
// 6. 最大连续 1 的个数
// LeetCode 485. Max Consecutive Ones
// LeetCode 1145. Maximum Binary Tree... 相关
//
// 给定一个二进制数组，计算其中最大连续 1 的个数
//
// 核心思路：
//   遍历数组，遇到 1 计数器 +1，遇到 0 归零，维护最大值
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：一次遍历 — 推荐
function findMaxConsecutiveOnes(nums: number[]): number {
  let max = 0;
  let count = 0;
  for (const num of nums) {
    if (num === 1) {
      count++;
      max = Math.max(max, count);
    } else {
      count = 0;
    }
  }
  return max;
}

// 方法2：滑动窗口
function findMaxConsecutiveOnesByWindow(nums: number[]): number {
  let left = 0;
  let max = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) {
      left = right + 1;
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}

// 变体：LeetCode 487. Max Consecutive Ones II — 最多翻转一个 0
function findMaxConsecutiveOnesII(nums: number[]): number {
  let left = 0;
  let max = 0;
  let zeroCount = 0;
  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeroCount++;
    while (zeroCount > 1) {
      if (nums[left] === 0) zeroCount--;
      left++;
    }
    max = Math.max(max, right - left + 1);
  }
  return max;
}

// ============================================================
// 7. 单一元素
// LeetCode 540. Single Element in a Sorted Array
//
// 有序数组中，每个元素出现两次，唯有一个元素出现一次，找出它
//
// 核心思路：
//   二分查找 + 位运算：
//   - 出现两次的元素中，第一个在下标偶数位，第二个在奇数位
//   - 单一元素打破了这一规律，据此二分
//   - mid 为偶数时，若 nums[mid] === nums[mid+1]，单一元素在右侧
//   - mid 为奇数时，若 nums[mid] === nums[mid-1]，单一元素在右侧
//
// 时间复杂度：O(log n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：二分查找 — 推荐
function singleNonDuplicate(nums: number[]): number {
  let left = 0;
  let right = nums.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    // 确保 mid 为偶数，便于配对判断
    const evenMid = mid % 2 === 0 ? mid : mid - 1;
    if (nums[evenMid] === nums[evenMid + 1]) {
      // 单一元素在右侧
      left = evenMid + 2;
    } else {
      // 单一元素在左侧或当前位置
      right = evenMid;
    }
  }
  return nums[left];
}

// 方法2：全数组异或 — 简洁但非最优
function singleNonDuplicateByXor(nums: number[]): number {
  return nums.reduce((acc, num) => acc ^ num, 0);
}

// 方法3：二分查找 — 另一种写法
function singleNonDuplicateBinarySearch(nums: number[]): number {
  let lo = 0;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    // mid ^ 1 将偶数变奇数、奇数变偶数，找到配对位
    if (nums[mid] === nums[mid ^ 1]) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return nums[lo];
}

// ============================================================
// 8. 缺失的数字
// LeetCode 268. Missing Number
//
// 给定 [0, n] 中 n 个数，找出缺失的那个数
//
// 核心思路：
//   利用异或：将数组所有元素和 [0, n] 的下标异或
//   最终结果就是缺失的数
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：异或法 — 推荐
function missingNumber(nums: number[]): number {
  let result = nums.length; // 初始为 n
  for (let i = 0; i < nums.length; i++) {
    result ^= i ^ nums[i];
  }
  return result;
}

// 方法2：数学法 — 等差数列求和
function missingNumberByMath(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}

// 方法3：哈希集合法
function missingNumberBySet(nums: number[]): number {
  const set = new Set(nums);
  for (let i = 0; i <= nums.length; i++) {
    if (!set.has(i)) return i;
  }
  return -1;
}

// ============================================================
// 9. 汉明距离
// LeetCode 461. Hamming Distance
//
// 两个整数之间的汉明距离是对应二进制位不同的位置数目
//
// 核心思路：
//   异或后统计 1 的个数
//
// 时间复杂度：O(k)，k 为异或结果中 1 的个数
// 空间复杂度：O(1)
// ============================================================

// 方法1：异或 + Kernighan — 推荐
function hammingDistance(x: number, y: number): number {
  let n = x ^ y;
  let count = 0;
  while (n !== 0) {
    n &= n - 1;
    count++;
  }
  return count;
}

// 方法2：异或 + 逐位检查
function hammingDistanceByBit(x: number, y: number): number {
  let n = x ^ y;
  let count = 0;
  while (n !== 0) {
    count += n & 1;
    n >>>= 1;
  }
  return count;
}

// 方法3：内置函数
function hammingDistanceBuiltin(x: number, y: number): number {
  return hammingWeight(x ^ y);
}

// ============================================================
// 10. 求不重复的元素的异或和
// 数组中仅出现一次的元素异或起来（所有不重复元素求异或和）
// LeetCode 136. Single Number 的扩展
//
// 核心思路：
//   如果数组中每个不重复元素只出现一次，其余出现偶数次
//   则所有元素异或的结果就是不重复元素的异或和
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：异或法 — 推荐
function xorSumOfUnique(nums: number[]): number {
  return nums.reduce((acc, num) => acc ^ num, 0);
}

// 方法2：哈希表统计频次
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

// ============================================================
// 11. 只出现一次的数字
// LeetCode 136. Single Number
//
// 数组中除了一个元素出现一次，其余都出现两次，找出只出现一次的元素
//
// 核心思路：
//   a ^ a = 0，a ^ 0 = a
//   所有元素异或后，出现两次的抵消，剩下的就是只出现一次的
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：异或法 — 推荐
function singleNumber(nums: number[]): number {
  return nums.reduce((acc, num) => acc ^ num, 0);
}

// 方法2：哈希表
function singleNumberByMap(nums: number[]): number {
  const freq = new Map<number, number>();
  for (const num of nums) {
    freq.set(num, (freq.get(num) || 0) + 1);
  }
  for (const [num, count] of freq) {
    if (count === 1) return num;
  }
  return -1;
}

// ============================================================
// 12. 只出现一次的数字 II
// LeetCode 137. Single Number II
//
// 数组中除了一个元素出现一次，其余都出现三次，找出只出现一次的元素
//
// 核心思路：
//   统计每个二进制位上 1 出现的次数，对 3 取余
//   余数对应的位就是只出现一次的数字的位
//
// 时间复杂度：O(n)
// 空间复杂度：O(1)
// ============================================================

// 方法1：逐位统计 — 推荐
function singleNumberII(nums: number[]): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    let bitSum = 0;
    for (const num of nums) {
      bitSum += (num >> i) & 1;
    }
    if (bitSum % 3 !== 0) {
      result |= (1 << i);
    }
  }
  return result;
}

// 方法2：有限状态自动机（三进制）
// 用两个变量 ones 和 twos 记录每个位出现 1 次和 2 次的状态
function singleNumberIIFSM(nums: number[]): number {
  let ones = 0;
  let twos = 0;
  for (const num of nums) {
    ones = (ones ^ num) & ~twos;
    twos = (twos ^ num) & ~ones;
  }
  return ones;
}

// 方法3：数学法 3(a+b+c) - (3a+3b+c) = 2c
function singleNumberIIMath(nums: number[]): number {
  const sumSet = new Set(nums);
  const sumOfUnique = [...sumSet].reduce((a, b) => a + b, 0);
  const sumOfAll = nums.reduce((a, b) => a + b, 0);
  return (3 * sumOfUnique - sumOfAll) / 2;
}

// ============================================================
// 13. 翻转二进制位
// LeetCode 190. Reverse Bits
//
// 颠倒给定 32 位无符号整数的二进制位
//
// 核心思路：
//   逐位取出原数的最低位，放入结果的最高位
//
// 时间复杂度：O(1)（固定 32 次）
// 空间复杂度：O(1)
// ============================================================

// 方法1：逐位翻转 — 推荐
function reverseBits(n: number): number {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    // result 左移腾出最低位，加上 n 的最低位
    result = (result << 1) | (n & 1);
    n >>>= 1;
  }
  // 用 >>> 0 确保结果为无符号 32 位整数
  return result >>> 0;
}

// 方法2：分治法（交换法）
function reverseBitsDivide(n: number): number {
  // 交换 16 位组
  n = ((n >>> 16) | (n << 16)) >>> 0;
  // 交换 8 位组
  n = ((n & 0xff00ff00) >>> 8) | ((n & 0x00ff00ff) << 8);
  // 交换 4 位组
  n = ((n & 0xf0f0f0f0) >>> 4) | ((n & 0x0f0f0f0f) << 4);
  // 交换 2 位组
  n = ((n & 0xcccccccc) >>> 2) | ((n & 0x33333333) << 2);
  // 交换 1 位组
  n = ((n & 0xaaaaaaaa) >>> 1) | ((n & 0x55555555) << 1);
  return n >>> 0;
}

// 方法3：位运算 + 缓存（对多次调用优化）
// 将 32 位分成 4 个字节，每个字节翻转后缓存
const reverseByteCache = new Map<number, number>();
function reverseByte(byte: number): number {
  if (reverseByteCache.has(byte)) return reverseByteCache.get(byte)!;
  let result = 0;
  let b = byte;
  for (let i = 0; i < 8; i++) {
    result = (result << 1) | (b & 1);
    b >>>= 1;
  }
  reverseByteCache.set(byte, result >>> 0);
  return result >>> 0;
}

function reverseBitsCached(n: number): number {
  let result = 0;
  for (let i = 0; i < 4; i++) {
    result = (result << 8) | reverseByte(n & 0xff);
    n >>>= 8;
  }
  return result >>> 0;
}

// ============================================================
// 14. 整数的二进制表示的总数
// LeetCode 338. Counting Bits
//
// 给定整数 n，对 [0, n] 范围内每个整数返回其二进制中 1 的个数
//
// 核心思路：
//   动态规划：dp[i] = dp[i >> 1] + (i & 1)
//   即：i 的 1 的个数 = i/2 的 1 的个数 + i 的最低位
//
// 时间复杂度：O(n)
// 空间复杂度：O(n)
// ============================================================

// 方法1：动态规划 — 推荐
function countBits(n: number): number[] {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    // i 右移一位（除以2）的 1 的个数 + 最低位是否为 1
    dp[i] = dp[i >> 1] + (i & 1);
  }
  return dp;
}

// 方法2：动态规划 + n & (n-1)
// dp[i] = dp[i & (i - 1)] + 1
// i & (i-1) 比 i 少一个最低位的 1
function countBitsByLowestBit(n: number): number[] {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i & (i - 1)] + 1;
  }
  return dp;
}

// 方法3：逐个计算（暴力法）
function countBitsBruteForce(n: number): number[] {
  const result: number[] = [];
  for (let i = 0; i <= n; i++) {
    result.push(hammingWeight(i));
  }
  return result;
}

// ============================================================
// 15. 找到最大异或值
// LeetCode 421. Maximum XOR of Two Numbers in an Array
//
// 给定非负整数数组，找到数组中两个元素的最大异或值
//
// 核心思路：
//   贪心 + 位运算：从最高位开始，逐位确定最大异或值
//   利用前缀集合判断当前位能否为 1
//
// 时间复杂度：O(n * log C)，C 为最大值
// 空间复杂度：O(n)
// ============================================================

// 方法1：贪心 + 位运算 — 推荐
function findMaximumXOR(nums: number[]): number {
  let maxResult = 0;
  let mask = 0;

  for (let i = 31; i >= 0; i--) {
    // 从最高位开始，逐步扩展掩码
    mask |= (1 << i);
    const prefixes = new Set<number>();

    // 获取每个数的前缀（高位部分）
    for (const num of nums) {
      prefixes.add(num & mask);
    }

    // 贪心：尝试让当前位为 1
    const candidate = maxResult | (1 << i);

    for (const prefix of prefixes) {
      // 如果存在另一个前缀使得异或结果为 candidate
      if (prefixes.has(prefix ^ candidate)) {
        maxResult = candidate;
        break;
      }
    }
  }

  return maxResult;
}

// 方法2：Trie 字典树
class TrieNode421 {
  children: (TrieNode421 | null)[] = [null, null];
}

function findMaximumXORByTrie(nums: number[]): number {
  // 构建字典树
  const root = new TrieNode421();
  const maxNum = Math.max(...nums);
  const maxBit = maxNum === 0 ? 1 : Math.floor(Math.log2(maxNum)) + 1;

  const insert = (num: number): void => {
    let node = root;
    for (let i = maxBit - 1; i >= 0; i--) {
      const bit = (num >> i) & 1;
      if (!node.children[bit]) {
        node.children[bit] = new TrieNode421();
      }
      node = node.children[bit]!;
    }
  };

  const findMaxXor = (num: number): number => {
    let node = root;
    let result = 0;
    for (let i = maxBit - 1; i >= 0; i--) {
      const bit = (num >> i) & 1;
      // 期望走相反方向以获得最大异或
      const desired = 1 - bit;
      if (node.children[desired]) {
        result |= (1 << i);
        node = node.children[desired]!;
      } else {
        node = node.children[bit]!;
      }
    }
    return result;
  };

  let maxResult = 0;
  for (const num of nums) {
    insert(num);
    maxResult = Math.max(maxResult, findMaxXor(num));
  }

  return maxResult;
}

// 方法3：暴力法 — 仅用于验证
function findMaximumXORBruteForce(nums: number[]): number {
  let maxResult = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      maxResult = Math.max(maxResult, nums[i] ^ nums[j]);
    }
  }
  return maxResult;
}

// ============================================================
// 测试
// ============================================================

// --- 测试用例 ---
console.log("===== 1. 判断奇偶 =====");
console.log(isOdd(5)); // true
console.log(isOdd(4)); // false
console.log(isOdd(0)); // false
console.log(isOdd(-3)); // true

console.log("\n===== 2. 高效交换两个数 =====");
console.log(swapXor(3, 5)); // [5, 3]
console.log(swapDestructure(10, 20)); // [20, 10]
console.log(swapArithmetic(7, 13)); // [13, 7]

console.log("\n===== 3. 2 的幂 =====");
console.log(isPowerOfTwo(1)); // true
console.log(isPowerOfTwo(16)); // true
console.log(isPowerOfTwo(3)); // false
console.log(isPowerOfTwo(0)); // false
console.log(isPowerOfTwoByLowestBit(8)); // true

console.log("\n===== 4. 最小的 2 的幂 =====");
console.log(nextPowerOfTwo(5)); // 8
console.log(nextPowerOfTwo(8)); // 8
console.log(nextPowerOfTwo(1)); // 1
console.log(nextPowerOfTwo(9)); // 16
console.log(nextPowerOfTwoByClz(17)); // 32

console.log("\n===== 5. 整数中 1 的个数 =====");
console.log(hammingWeight(11)); // 3 (1011)
console.log(hammingWeight(128)); // 1 (10000000)
console.log(hammingWeight(0xffffffff)); // 32
console.log(hammingWeightByBit(11)); // 3

console.log("\n===== 6. 最大连续 1 的个数 =====");
console.log(findMaxConsecutiveOnes([1, 1, 0, 1, 1, 1])); // 3
console.log(findMaxConsecutiveOnes([1, 0, 1, 1, 0, 1])); // 2
console.log(findMaxConsecutiveOnesII([1, 0, 1, 1, 0])); // 4

console.log("\n===== 7. 单一元素 =====");
console.log(singleNonDuplicate([1, 1, 2, 3, 3, 4, 4, 8, 8])); // 2
console.log(singleNonDuplicate([3, 3, 7, 7, 10, 11, 11])); // 10
console.log(singleNonDuplicateByXor([1, 1, 2, 2, 3])); // 3

console.log("\n===== 8. 缺失的数字 =====");
console.log(missingNumber([3, 0, 1])); // 2
console.log(missingNumber([0, 1])); // 2
console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8
console.log(missingNumberByMath([3, 0, 1])); // 2

console.log("\n===== 9. 汉明距离 =====");
console.log(hammingDistance(1, 4)); // 2 (001 vs 100)
console.log(hammingDistance(3, 1)); // 1 (011 vs 001)
console.log(hammingDistanceByBit(1, 4)); // 2

console.log("\n===== 10. 异或和 =====");
console.log(xorSumOfUnique([1, 2, 3, 2, 1])); // 3 (只出现一次的是 3)
console.log(xorSumOfUnique([1, 1, 2, 2, 3, 3])); // 0 (都出现两次)
console.log(xorSumOfUniqueByMap([1, 2, 3, 2, 1])); // 3

console.log("\n===== 11. 只出现一次的数字 =====");
console.log(singleNumber([2, 2, 1])); // 1
console.log(singleNumber([4, 1, 2, 1, 2])); // 4
console.log(singleNumber([1])); // 1

console.log("\n===== 12. 只出现一次的数字 II =====");
console.log(singleNumberII([2, 2, 3, 2])); // 3
console.log(singleNumberII([0, 1, 0, 1, 0, 1, 99])); // 99
console.log(singleNumberIIFSM([2, 2, 3, 2])); // 3

console.log("\n===== 13. 翻转二进制位 =====");
console.log(reverseBits(0b00000010100101000001111010011100)); // 964176192
console.log(reverseBits(0xffffffff)); // 4294967295
console.log(reverseBitsDivide(0b00000010100101000001111010011100)); // 964176192

console.log("\n===== 14. 整数的二进制表示的总数 =====");
console.log(countBits(2)); // [0, 1, 1]
console.log(countBits(5)); // [0, 1, 1, 2, 1, 2]
console.log(countBitsByLowestBit(5)); // [0, 1, 1, 2, 1, 2]

console.log("\n===== 15. 找到最大异或值 =====");
console.log(findMaximumXOR([3, 10, 5, 25, 2, 8])); // 28 (25 ^ 5 = 28)
console.log(findMaximumXOR([0])); // 0
console.log(findMaximumXOR([2, 4])); // 6 (2 ^ 4 = 6)
console.log(findMaximumXORByTrie([3, 10, 5, 25, 2, 8])); // 28

export {};
