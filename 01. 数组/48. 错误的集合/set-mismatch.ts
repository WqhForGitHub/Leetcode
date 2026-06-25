// ============================================================
// 48. 错误的集合
// ============================================================
// LeetCode 645. Set Mismatch
// 集合 s 包含 [1, n] 的整数，但其中一个数字被另一个数字替换，导致有一个数字重复、一个数字缺失。返回 [重复的数字, 缺失的数字]。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：原地标记-取负（推荐）
function findErrorNums(nums: number[]): number[] {
  let duplicate = -1;
  // 第一遍遍历：用取负来标记某数字是否出现过
  for (const num of nums) {
    const idx = Math.abs(num) - 1;
    if (nums[idx] < 0) {
      // 已经被标记过，说明 num 是重复数字
      duplicate = Math.abs(num);
    } else {
      nums[idx] = -nums[idx];
    }
  }

  // 第二遍遍历：找出仍为正数的下标，对应缺失的数字
  let missing = -1;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) {
      missing = i + 1;
      break;
    }
  }

  return [duplicate, missing];
}

// 方法2：哈希表计数
function findErrorNumsHash(nums: number[]): number[] {
  const count = new Map<number, number>();
  const n = nums.length;
  let duplicate = -1;
  let missing = -1;

  for (const num of nums) {
    count.set(num, (count.get(num) ?? 0) + 1);
  }

  // 遍历 1..n，找出重复和缺失
  for (let i = 1; i <= n; i++) {
    const c = count.get(i) ?? 0;
    if (c === 2) {
      duplicate = i;
    } else if (c === 0) {
      missing = i;
    }
  }

  return [duplicate, missing];
}

// 方法3：数学方法
// sum(nums) - sum(1..n) = dup - missing
// sum(nums^2) - sum(i^2) = dup^2 - missing^2 = (dup - missing)(dup + missing)
function findErrorNumsMath(nums: number[]): number[] {
  const n = nums.length;
  let sum = 0;
  let sumSq = 0;
  for (const num of nums) {
    sum += num;
    sumSq += num * num;
  }
  // 1..n 的和与平方和
  const expectedSum = (n * (n + 1)) / 2;
  const expectedSumSq = (n * (n + 1) * (2 * n + 1)) / 6;

  const diff = sum - expectedSum; // dup - missing
  const diffSq = sumSq - expectedSumSq; // dup^2 - missing^2 = (dup - missing)(dup + missing)
  const sumDupMis = diffSq / diff; // dup + missing

  const dup = (diff + sumDupMis) / 2;
  const missing = sumDupMis - dup;

  return [dup, missing];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 48. 错误的集合 =====");
console.log("原地标记:", findErrorNums([1, 2, 2, 4])); // 期望结果: [2, 3]
console.log("原地标记:", findErrorNums([1, 1])); // 期望结果: [1, 2]
console.log("原地标记:", findErrorNums([3, 2, 3, 4, 6, 5])); // 期望结果: [3, 1]
console.log("哈希表:", findErrorNumsHash([1, 2, 2, 4])); // 期望结果: [2, 3]
console.log("哈希表:", findErrorNumsHash([1, 1])); // 期望结果: [1, 2]
console.log("数学:", findErrorNumsMath([1, 2, 2, 4])); // 期望结果: [2, 3]
console.log("数学:", findErrorNumsMath([1, 1])); // 期望结果: [1, 2]

export {};
