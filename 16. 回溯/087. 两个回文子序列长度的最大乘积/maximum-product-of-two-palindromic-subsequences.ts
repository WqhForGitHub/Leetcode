// ============================================================
// 087. 两个回文子序列长度的最大乘积
// ============================================================
// LeetCode 2002. Maximum Product of the Length of Two Palindromic Subsequences
// 给定字符串 s，找到两个不相交的回文子序列，使其长度乘积最大。
// 时间复杂度：O(3^n), 空间复杂度：O(2^n)

// 方法1：回溯 (枚举两个不相交子序列)
// 对每个字符，有三种选择：放入子序列1、放入子序列2、都不放。
// 同时维护两个子序列是否为回文。
// 时间复杂度 O(3^n), 空间复杂度 O(n)
function maxProduct(s: string): number {
  const n: number = s.length;
  let answer: number = 0;

  // seq1, seq2 是当前两个子序列对应的字符串
  const backtrack = (idx: number, seq1: string, seq2: string): void => {
    if (idx === n) {
      if (isPalindrome(seq1) && isPalindrome(seq2)) {
        answer = Math.max(answer, seq1.length * seq2.length);
      }
      return;
    }
    // 不放
    backtrack(idx + 1, seq1, seq2);
    // 放入 seq1
    backtrack(idx + 1, seq1 + s[idx], seq2);
    // 放入 seq2
    backtrack(idx + 1, seq1, seq2 + s[idx]);
  };

  const isPalindrome = (str: string): boolean => {
    let l: number = 0;
    let r: number = str.length - 1;
    while (l < r) {
      if (str[l] !== str[r]) return false;
      l++;
      r--;
    }
    return true;
  };

  backtrack(0, "", "");
  return answer;
}

// 方法2：状态压缩枚举+预处理
// 先枚举所有子集掩码，预处理出每个掩码是否构成回文以及其长度。
// 然后枚举两个不相交掩码取最大乘积。
// 时间复杂度 O(4^n), 空间复杂度 O(2^n)
function maxProduct2(s: string): number {
  const n: number = s.length;
  const total: number = 1 << n;
  // valid[mask] = 该子集构成回文的长度，否则为 0
  const valid: number[] = new Array(total).fill(0);

  for (let mask = 1; mask < total; mask++) {
    // 检查 mask 是否构成回文
    let l: number = -1;
    let r: number = -1;
    // 找最低位与最高位
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        if (l === -1) l = i;
        r = i;
      }
    }
    if (s[l] === s[r]) {
      // 内部掩码
      const inner: number = mask & ~(1 << l) & ~(1 << r);
      if (l === r) {
        // 单字符
        valid[mask] = 1;
      } else if (valid[inner] > 0 || inner === 0) {
        // inner === 0 表示仅剩两位相邻
        valid[mask] = valid[inner] + 2;
      }
    }
  }

  let answer: number = 0;
  // 枚举两个不相交子集
  for (let m1 = 1; m1 < total; m1++) {
    if (valid[m1] === 0) continue;
    for (let m2 = m1 + 1; m2 < total; m2++) {
      if ((m1 & m2) === 0 && valid[m2] > 0) {
        answer = Math.max(answer, valid[m1] * valid[m2]);
      }
    }
  }
  return answer;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 087. 两个回文子序列长度的最大乘积 =====");
console.log(maxProduct("leetcodecom")); // 期望结果: 9
console.log(maxProduct2("leetcodecom")); // 期望结果: 9
console.log(maxProduct("bb")); // 期望结果: 1
console.log(maxProduct2("bb")); // 期望结果: 1

export {};
