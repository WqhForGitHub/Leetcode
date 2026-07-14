// ============================================================
// 068. 错误的集合
// ============================================================
// LeetCode 645. Set Mismatch
// 长度为 n 的数组，元素本应为 1..n 各一次，但其中有一个数被重复了，
// 同时有一个数丢失。返回 [重复的数, 丢失的数]。

// 方法1：下标取负标记（推荐，O(n) 时间，O(1) 空间）
// 遍历数组，用 |num|-1 作为下标，把该位置取负表示 |num| 出现过。
// 若该位置已为负，说明 |num| 是重复数。
// 第二次扫描，仍为正的位置 idx，对应丢失数 idx+1。
function findErrorNums_marking(nums: number[]): number[] {
  let dup = -1;
  for (const num of nums) {
    const idx = Math.abs(num) - 1;
    if (nums[idx] < 0) {
      dup = Math.abs(num);
    } else {
      nums[idx] = -nums[idx];
    }
  }
  let missing = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      missing = i + 1;
      break;
    }
  }
  // 恢复原数组（可选）
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < 0) nums[i] = -nums[i];
  }
  return [dup, missing];
}

// 方法2：异或 XOR（O(n) 时间，O(1) 空间）
// xor = (1^2^...^n) ^ (nums[0]^...^nums[n-1]) = dup ^ missing。
// 找到 xor 中任意为 1 的比特位，把 1..n 和 nums 都按该位分成两组分别异或，
// 得到两个候选 a, b。再扫描 nums 判断哪个出现两次即为 dup，另一个为 missing。
function findErrorNums_xor(nums: number[]): number[] {
  const n = nums.length;
  let xor = 0;
  for (let i = 0; i < n; i++) {
    xor ^= nums[i];
    xor ^= i + 1;
  }
  // xor == dup ^ missing

  // 找到 xor 最低位的 1
  const diffBit = xor & -xor;

  let a = 0;
  let b = 0;
  for (let i = 0; i < n; i++) {
    if ((nums[i] & diffBit) !== 0) a ^= nums[i];
    else b ^= nums[i];
    if (((i + 1) & diffBit) !== 0) a ^= i + 1;
    else b ^= i + 1;
  }
  // a, b 中一个是 dup，一个是 missing。判断哪个在 nums 中出现两次。
  let count = 0;
  for (const num of nums) {
    if (num === a) count++;
  }
  if (count === 2) return [a, b];
  return [b, a];
}

// 方法3：数学（求和与平方和）（O(n) 时间，O(1) 空间）
// 设 dup = d, missing = m。
//   diff  = sum(nums) - sum(1..n)        = d - m
//   diff2 = sum(nums^2) - sum((1..n)^2)  = d^2 - m^2 = (d + m) * (d - m)
//   => d + m = diff2 / diff
//   => d = (diff + sum) / 2, m = (sum - diff) / 2
function findErrorNums_math(nums: number[]): number[] {
  const n = nums.length;
  let sum = 0;
  let sumSq = 0;
  for (const num of nums) {
    sum += num;
    sumSq += num * num;
  }
  const expectedSum = (n * (n + 1)) / 2;
  const expectedSumSq = (n * (n + 1) * (2 * n + 1)) / 6;

  const diff = sum - expectedSum; // d - m
  const diff2 = sumSq - expectedSumSq; // (d + m) * (d - m)
  const sumDM = diff2 / diff; // d + m

  const dup = (diff + sumDM) / 2;
  const missing = (sumDM - diff) / 2;
  return [dup, missing];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 068. 错误的集合 =====");
console.log("标记法 [1,2,2,4]:", findErrorNums_marking([1, 2, 2, 4])); // 期望 [2,3]
console.log("标记法 [1,1]:", findErrorNums_marking([1, 1])); // 期望 [1,2]
console.log("标记法 [3,2,3,4,6,5]:", findErrorNums_marking([3, 2, 3, 4, 6, 5])); // 期望 [3,1]

console.log("异或法 [1,2,2,4]:", findErrorNums_xor([1, 2, 2, 4])); // 期望 [2,3]
console.log("异或法 [1,1]:", findErrorNums_xor([1, 1])); // 期望 [1,2]
console.log("异或法 [3,2,3,4,6,5]:", findErrorNums_xor([3, 2, 3, 4, 6, 5])); // 期望 [3,1]

console.log("数学法 [1,2,2,4]:", findErrorNums_math([1, 2, 2, 4])); // 期望 [2,3]
console.log("数学法 [1,1]:", findErrorNums_math([1, 1])); // 期望 [1,2]
console.log("数学法 [3,2,3,4,6,5]:", findErrorNums_math([3, 2, 3, 4, 6, 5])); // 期望 [3,1]

export {};
