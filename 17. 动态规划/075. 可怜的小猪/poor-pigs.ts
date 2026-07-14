// ============================================================
// 075. 可怜的小猪
// ============================================================
// LeetCode 458. Poor Pigs
// buckets 桶中有一桶有毒，猪喝后 minutesToDie 分钟内死亡，
// 在 minutesToTest 内找出毒桶所需最少猪数。
// 每头猪有 (tests+1) 种状态，n 头猪可以区分 (tests+1)^n 个桶。
// 时间复杂度 O(1) 或 O(log(buckets))

// 方法1：数学公式（推荐）
// tests = minutesToTest / minutesToDie（每头猪能测试的轮数）
// 每头猪有 (tests+1) 种状态：在第 1 轮死、第 2 轮死、...、第 tests 轮死、存活
// n 头猪可以区分 (tests+1)^n 个桶，需要 (tests+1)^n >= buckets
// 因此 n = ceil(log(buckets) / log(tests+1))
// 时间复杂度 O(1)，空间复杂度 O(1)
function poorPigs(buckets: number, minutesToDie: number, minutesToTest: number): number {
  // 计算每头猪能测试的轮数
  const tests: number = Math.floor(minutesToTest / minutesToDie);
  if (buckets <= 1) return 0;
  // 每头猪有 (tests+1) 种状态，n 头猪可区分 (tests+1)^n 个桶
  // n = ceil(log(buckets) / log(tests+1))
  return Math.ceil(Math.log(buckets) / Math.log(tests + 1));
}

// 方法2：迭代计算
// 从 n=0 开始，不断乘以 (tests+1)，直到容量 >= buckets。
// 避免浮点精度问题。
// 时间复杂度 O(log(buckets))，空间复杂度 O(1)
function poorPigs2(buckets: number, minutesToDie: number, minutesToTest: number): number {
  const tests: number = Math.floor(minutesToTest / minutesToDie);
  const states: number = tests + 1; // 每头猪的状态数
  let n: number = 0;
  let capacity: number = 1; // n 头猪能区分的桶数
  // 不断增大 n，直到能覆盖所有桶
  while (capacity < buckets) {
    capacity *= states;
    n++;
  }
  return n;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. 可怜的小猪 =====");
console.log(poorPigs(1000, 15, 60)); // 期望结果: 5
console.log(poorPigs(4, 15, 15)); // 期望结果: 2
console.log(poorPigs(4, 15, 30)); // 期望结果: 2
console.log(poorPigs2(1000, 15, 60)); // 期望结果: 5
console.log(poorPigs2(4, 15, 15)); // 期望结果: 2
console.log(poorPigs2(4, 15, 30)); // 期望结果: 2

export {};
