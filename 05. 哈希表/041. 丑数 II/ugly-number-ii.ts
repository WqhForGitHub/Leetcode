// ============================================================
// 041. 丑数 II
// ============================================================
// LeetCode 264. Ugly Number II
// 给定整数 n，返回第 n 个丑数。丑数是只包含质因数 2、3、5 的正整数。
// 时间复杂度：O(n)，空间复杂度：O(n)

function nthUglyNumber(n: number): number {
  // DP + 三指针去重
  // dp[i] 表示第 i+1 个丑数（0 索引）
  const dp: number[] = new Array(n).fill(0);
  dp[0] = 1;

  let p2 = 0; // 指向乘 2 的候选位置
  let p3 = 0; // 指向乘 3 的候选位置
  let p5 = 0; // 指向乘 5 的候选位置

  for (let i = 1; i < n; i++) {
    const next2 = dp[p2] * 2;
    const next3 = dp[p3] * 3;
    const next5 = dp[p5] * 5;
    // 取三者最小作为下一个丑数
    const next = Math.min(next2, next3, next5);
    dp[i] = next;
    // 去重：相等的候选都前进指针
    if (next === next2) p2++;
    if (next === next3) p3++;
    if (next === next5) p5++;
  }

  return dp[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 041. 丑数 II =====");
console.log(nthUglyNumber(10)); // 12
console.log(nthUglyNumber(1)); // 1
console.log(nthUglyNumber(100)); // 1536
console.log(nthUglyNumber(1690)); // 2123366400

export {};
