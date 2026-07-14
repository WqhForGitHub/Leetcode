// ============================================================
// 065. 判断子序列
// ============================================================
// LeetCode 392. Is Subsequence
// 判断字符串 s 是否为字符串 t 的子序列。
// 时间复杂度 O(n + m)，空间复杂度 O(1)

// 方法1：双指针（推荐）
// 用两个指针分别遍历 s 和 t，匹配则 s 指针前进
// 时间复杂度 O(n + m)，空间复杂度 O(1)
function isSubsequence(s: string, t: string): boolean {
  let i: number = 0; // s 的指针
  let j: number = 0; // t 的指针

  while (i < s.length && j < t.length) {
    // 字符匹配，s 指针前进
    if (s[i] === t[j]) {
      i++;
    }
    // t 指针总是前进
    j++;
  }

  // s 的所有字符都匹配完，说明是子序列
  return i === s.length;
}

// 方法2：动态规划（预处理 t，适合多次查询）
// 预处理 t 中每个位置之后各字符下一次出现的位置
// dp[j][c] = 在位置 j 之后字符 c 下一次出现的位置
// 状态转移：dp[j][c] = j if t[j] == c else dp[j+1][c]
// 时间复杂度 O(m * 26 + n)，空间复杂度 O(m * 26)
function isSubsequence2(s: string, t: string): boolean {
  const m: number = t.length;
  // nextPos[i][c] 表示 t 从位置 i 开始，字符 c 下一次出现的位置
  // i 的范围是 [0, m]，其中 m 表示 t 的末尾之后
  const nextPos: number[][] = new Array(m + 1);
  for (let i: number = 0; i <= m; i++) {
    nextPos[i] = new Array(26).fill(m); // 默认为 m 表示不存在
  }

  // 从后往前预处理
  for (let i: number = m - 1; i >= 0; i--) {
    for (let c: number = 0; c < 26; c++) {
      const charCode: number = t.charCodeAt(i) - 97;
      if (charCode === c) {
        nextPos[i][c] = i;
      } else {
        nextPos[i][c] = nextPos[i + 1][c];
      }
    }
  }

  // 在 t 中匹配 s
  let pos: number = 0;
  for (let i: number = 0; i < s.length; i++) {
    const c: number = s.charCodeAt(i) - 97;
    if (nextPos[pos][c] === m) {
      return false; // 字符不存在
    }
    pos = nextPos[pos][c] + 1; // 移动到匹配位置的下一位
  }

  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 065. 判断子序列 =====");
console.log(isSubsequence("abc", "ahbgdc")); // 期望结果: true
console.log(isSubsequence("axc", "ahbgdc")); // 期望结果: false
console.log(isSubsequence("", "ahbgdc")); // 期望结果: true
console.log(isSubsequence("b", "abc")); // 期望结果: true
console.log(isSubsequence("abc", "")); // 期望结果: false

export {};
