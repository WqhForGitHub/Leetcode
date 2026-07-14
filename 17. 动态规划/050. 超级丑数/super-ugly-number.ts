// ============================================================
// 050. 超级丑数
// ============================================================
// LeetCode 313. Super Ugly Number
// 给定质数数组 primes，返回第 n 个超级丑数（只含这些质因子的正整数）。
// 时间复杂度 O(nk)，空间复杂度 O(n+k)

// 方法1：动态规划 + 多指针（推荐）
// 类似丑数II，但质因子不固定为2,3,5，而是给定的 primes 数组
// 每个质因子维护一个指针，dp[i] = min(dp[pointers[j]] * primes[j])
// 时间复杂度 O(nk)，空间复杂度 O(n+k)
function nthSuperUglyNumber(n: number, primes: number[]): number {
  const k: number = primes.length;

  // dp[i] 存储第 i+1 个超级丑数
  const dp: number[] = new Array<number>(n);
  dp[0] = 1;

  // pointers[j] 表示第 j 个质因子对应的指针位置
  const pointers: number[] = new Array<number>(k).fill(0);

  for (let i: number = 1; i < n; i++) {
    // 计算每个质因子产生的候选丑数
    let minVal: number = Infinity;
    const candidates: number[] = new Array<number>(k);
    for (let j: number = 0; j < k; j++) {
      candidates[j] = dp[pointers[j]] * primes[j];
      minVal = Math.min(minVal, candidates[j]);
    }

    dp[i] = minVal;

    // 移动产生最小值的指针（去重，用 if 不用 else）
    for (let j: number = 0; j < k; j++) {
      if (candidates[j] === minVal) {
        pointers[j]++;
      }
    }
  }

  return dp[n - 1];
}

// 方法2：最小堆
// 每次取出最小丑数，将其乘以所有质因子后加入堆（需去重）
// 时间复杂度 O(nk log(nk))，空间复杂度 O(n+k)
function nthSuperUglyNumber2(n: number, primes: number[]): number {
  const seen: Set<number> = new Set<number>();
  const heap: number[] = [1];
  seen.add(1);

  let result: number = 1;

  for (let i: number = 0; i < n; i++) {
    // 取出堆顶最小值
    heap.sort((a: number, b: number) => a - b);
    result = heap.shift()!;

    // 将当前最小值乘以所有质因子加入堆
    for (const prime of primes) {
      const num: number = result * prime;
      if (num > 0 && !seen.has(num)) {
        seen.add(num);
        heap.push(num);
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 050. 超级丑数 =====");
console.log(nthSuperUglyNumber(12, [2, 7, 13, 19])); // 期望结果: 32
console.log(nthSuperUglyNumber(1, [2, 3, 5])); // 期望结果: 1
console.log(nthSuperUglyNumber(6, [2, 3, 5])); // 期望结果: 6
console.log(nthSuperUglyNumber2(12, [2, 7, 13, 19])); // 期望结果: 32

export {};
