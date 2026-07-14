// ============================================================
// 042. 丑数 II
// ============================================================
// LeetCode 264. Ugly Number II
// 返回第 n 个丑数（只含质因子 2、3、5 的正整数，1 视为丑数）。
// 时间复杂度 O(n)，空间复杂度 O(n)

// 方法1：动态规划 + 三指针（推荐）
// 维护三个指针 p2、p3、p5，分别表示下一个丑数是由哪个之前的丑数乘以2/3/5得到
// 状态转移：dp[i] = min(dp[p2]*2, dp[p3]*3, dp[p5]*5)
// 时间复杂度 O(n)，空间复杂度 O(n)
function nthUglyNumber(n: number): number {
  // dp[i] 存储第 i+1 个丑数
  const dp: number[] = new Array<number>(n);
  dp[0] = 1;

  // 三指针分别对应乘2、乘3、乘5的位置
  let p2: number = 0;
  let p3: number = 0;
  let p5: number = 0;

  for (let i: number = 1; i < n; i++) {
    // 候选丑数
    const num2: number = dp[p2] * 2;
    const num3: number = dp[p3] * 3;
    const num5: number = dp[p5] * 5;
    // 取最小值作为下一个丑数
    const next: number = Math.min(num2, num3, num5);
    dp[i] = next;

    // 哪个指针产生的值被选中，就移动该指针（去重，用 if 不用 else）
    if (next === num2) p2++;
    if (next === num3) p3++;
    if (next === num5) p5++;
  }

  return dp[n - 1];
}

// 方法2：最小堆
// 每次取出最小丑数，将其乘以2、3、5后加入堆（需去重）
// 时间复杂度 O(n log n)，空间复杂度 O(n)
function nthUglyNumber2(n: number): number {
  const heap: number[] = [1];
  const seen: Set<number> = new Set<number>([1]);
  const factors: number[] = [2, 3, 5];
  let result: number = 1;

  for (let i: number = 0; i < n; i++) {
    // 取出堆顶最小元素
    result = heap.shift()!;
    // 重新调整堆（这里用简单的排序代替完整堆实现）
    for (const factor of factors) {
      const num: number = result * factor;
      if (!seen.has(num)) {
        seen.add(num);
        heap.push(num);
      }
    }
    heap.sort((a: number, b: number) => a - b);
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 042. 丑数 II =====");
console.log(nthUglyNumber(10)); // 期望结果: 12
console.log(nthUglyNumber(1)); // 期望结果: 1
console.log(nthUglyNumber(11)); // 期望结果: 15
console.log(nthUglyNumber(7)); // 期望结果: 8
console.log(nthUglyNumber2(10)); // 期望结果: 12

export {};
