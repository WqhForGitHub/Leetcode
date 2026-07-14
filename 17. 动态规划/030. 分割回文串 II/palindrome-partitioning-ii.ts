// ============================================================
// 030. 分割回文串 II
// ============================================================
// LeetCode 132. Palindrome Partitioning II
// 给定字符串 s，返回最少分割次数使其都是回文。
// 时间复杂度 O(n²)，空间复杂度 O(n²)

// 方法1：DP + 回文预处理（推荐）
// dp[i] 表示 s[0..i] 的最少分割次数
// 先预处理 isPalin[i][j] 判断 s[i..j] 是否回文
// 状态转移：如果 s[j..i] 是回文，dp[i] = min(dp[i], dp[j-1] + 1)
// 时间复杂度 O(n²)，空间复杂度 O(n²)
function minCut(s: string): number {
  const n: number = s.length;

  // isPalin[i][j] 表示 s[i..j] 是否为回文
  const isPalin: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));

  // 预处理回文判断
  for (let i: number = n - 1; i >= 0; i--) {
    for (let j: number = i; j < n; j++) {
      if (s[i] === s[j] && (j - i <= 1 || isPalin[i + 1][j - 1])) {
        isPalin[i][j] = true;
      }
    }
  }

  // dp[i] 表示 s[0..i] 的最少分割次数
  const dp: number[] = new Array<number>(n).fill(0);

  for (let i: number = 0; i < n; i++) {
    if (isPalin[0][i]) {
      // s[0..i] 本身是回文，不需要分割
      dp[i] = 0;
    } else {
      dp[i] = i; // 最坏情况：每个字符都分割
      for (let j: number = 1; j <= i; j++) {
        if (isPalin[j][i]) {
          // s[j..i] 是回文，在 j-1 和 j 之间分割
          dp[i] = Math.min(dp[i], dp[j - 1] + 1);
        }
      }
    }
  }

  return dp[n - 1];
}

// 方法2：中心扩展 + DP
// 用中心扩展法判断回文，同时更新 dp 数组
// 时间复杂度 O(n²)，空间复杂度 O(n)
function minCut2(s: string): number {
  const n: number = s.length;
  // dp[i] 表示 s[0..i] 的最少分割次数
  const dp: number[] = new Array<number>(n);
  for (let i: number = 0; i < n; i++) {
    dp[i] = i; // 最坏情况：分割 i 次
  }

  // 以每个位置为中心向外扩展，更新 dp
  for (let center: number = 0; center < n; center++) {
    // 奇数长度回文：以 center 为中心
    let left: number = center;
    let right: number = center;
    while (left >= 0 && right < n && s[left] === s[right]) {
      if (left === 0) {
        dp[right] = 0;
      } else {
        dp[right] = Math.min(dp[right], dp[left - 1] + 1);
      }
      left--;
      right++;
    }

    // 偶数长度回文：以 center 和 center+1 为中心
    left = center;
    right = center + 1;
    while (left >= 0 && right < n && s[left] === s[right]) {
      if (left === 0) {
        dp[right] = 0;
      } else {
        dp[right] = Math.min(dp[right], dp[left - 1] + 1);
      }
      left--;
      right++;
    }
  }

  return dp[n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 030. 分割回文串 II =====");
console.log(minCut("aab")); // 期望结果: 1
console.log(minCut("a")); // 期望结果: 0
console.log(minCut("ab")); // 期望结果: 1
console.log(minCut2("aab")); // 期望结果: 1
console.log(minCut2("ab")); // 期望结果: 1

export {};
