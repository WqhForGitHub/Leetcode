// ============================================================
// 020. K 连续位的最小翻转次数
// ============================================================
// LeetCode 995. Minimum Number of K Consecutive Bit Flips
// 在二进制数组中，每次可以翻转连续 K 个位，求使数组全为 1 的最少翻转次数。不可能返回 -1。

// ------------------------------------------------------------
// 方法1：差分数组记录翻转
// ------------------------------------------------------------
// 用差分数组记录每个位置的翻转次数，维护当前累计翻转。
// 遇到 0 且翻转次数为偶数，或 1 且翻转次数为奇数时需要翻转。
// 时间 O(n)，空间 O(n)。
function minKBitFlips1(nums: number[], k: number): number {
  const n = nums.length;
  const flipDiff: number[] = new Array(n + 1).fill(0);
  let flipCount = 0;
  let result = 0;
  for (let i = 0; i < n; i++) {
    flipCount += flipDiff[i];
    if ((nums[i] + flipCount) % 2 === 0) {
      // 需要翻转
      if (i + k > n) return -1;
      result++;
      flipCount++;
      flipDiff[i + k]--;
    }
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：队列记录翻转区间
// ------------------------------------------------------------
// 用队列保存翻转的起始位置，队列长度即当前翻转次数的奇偶性。
// 每次处理新位置时弹出超出范围的翻转。
// 时间 O(n)，空间 O(k)。
function minKBitFlips2(nums: number[], k: number): number {
  const n = nums.length;
  const flipQueue: number[] = [];
  let result = 0;
  for (let i = 0; i < n; i++) {
    // 移除超出窗口的翻转
    while (flipQueue.length > 0 && flipQueue[0] + k <= i) {
      flipQueue.shift();
    }
    const flipped = flipQueue.length % 2;
    if ((nums[i] + flipped) % 2 === 0) {
      if (i + k > n) return -1;
      result++;
      flipQueue.push(i);
    }
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", minKBitFlips1([0, 1, 0], 1), "期望: 2");
  console.log("测试2:", minKBitFlips1([1, 1, 0], 2), "期望: -1");
  console.log("测试3:", minKBitFlips1([0, 0, 0, 1, 0, 1, 1, 0], 3), "期望: 3");
  console.log("测试4:", minKBitFlips2([0, 1, 0], 1), "期望: 2");
  console.log("测试5:", minKBitFlips2([1, 1, 0], 2), "期望: -1");
  console.log("测试6:", minKBitFlips2([0, 0, 0, 1, 0, 1, 1, 0], 3), "期望: 3");
}

test();

export {};
