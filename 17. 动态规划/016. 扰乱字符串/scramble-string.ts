// ============================================================
// 016. 扰乱字符串
// ============================================================
// LeetCode 87. Scramble String
// 判断字符串 s1 是否可以通过扰乱操作得到 s2。
// 扰乱定义：递归地将字符串分成两个非空子串，可以选择交换或不交换这两个子串，
// 然后对子串继续进行扰乱操作。
// 时间复杂度 O(n^4)，空间复杂度 O(n^3)

// 方法1：动态规划（推荐）
// dp[i][j][len] 表示 s1[i..i+len) 和 s2[j..j+len) 是否互为扰乱字符串
// 状态转移：对每个切分点 k (1 <= k < len)：
//   不交换：dp[i][j][len] = dp[i][j][k] && dp[i+k][j+k][len-k]
//   交换：  dp[i][j][len] = dp[i][j+len-k][k] && dp[i+k][j][len-k]
// 时间复杂度 O(n^4)，空间复杂度 O(n^3)
function isScramble(s1: string, s2: string): boolean {
  const n: number = s1.length;
  if (n !== s2.length) return false;
  if (s1 === s2) return true;

  // 快速剪枝：字符频次不同则不可能
  const count: number[] = new Array<number>(26).fill(0);
  for (let i: number = 0; i < n; i++) {
    count[s1.charCodeAt(i) - 97]++;
    count[s2.charCodeAt(i) - 97]--;
  }
  for (let i: number = 0; i < 26; i++) {
    if (count[i] !== 0) return false;
  }

  // dp[i][j][len] 表示 s1[i..i+len) 和 s2[j..j+len) 是否互为扰乱
  const dp: boolean[][][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => new Array<boolean>(n + 1).fill(false)),
  );

  // 初始化：长度为1的情况
  for (let i: number = 0; i < n; i++) {
    for (let j: number = 0; j < n; j++) {
      dp[i][j][1] = s1[i] === s2[j];
    }
  }

  // 枚举长度 len
  for (let len: number = 2; len <= n; len++) {
    // 枚举 s1 的起点 i
    for (let i: number = 0; i <= n - len; i++) {
      // 枚举 s2 的起点 j
      for (let j: number = 0; j <= n - len; j++) {
        // 枚举切分点 k
        for (let k: number = 1; k < len; k++) {
          // 情况1：不交换，s1[i..i+k) 对应 s2[j..j+k)
          if (dp[i][j][k] && dp[i + k][j + k][len - k]) {
            dp[i][j][len] = true;
            break;
          }
          // 情况2：交换，s1[i..i+k) 对应 s2[j+len-k..j+len)
          if (dp[i][j + len - k][k] && dp[i + k][j][len - k]) {
            dp[i][j][len] = true;
            break;
          }
        }
      }
    }
  }

  return dp[0][0][n];
}

// 方法2：递归 + 记忆化
// 递归地判断，用 memo 缓存已计算的结果
// 时间复杂度 O(n^4)，空间复杂度 O(n^3)
function isScramble2(s1: string, s2: string): boolean {
  const n: number = s1.length;
  if (n !== s2.length) return false;

  // 记忆化：key = "i,j,len"
  const memo: Map<string, boolean> = new Map();

  function helper(i: number, j: number, len: number): boolean {
    const key: string = `${i},${j},${len}`;
    if (memo.has(key)) return memo.get(key)!;

    // 判断两个子串是否相同
    let same: boolean = true;
    for (let k: number = 0; k < len; k++) {
      if (s1[i + k] !== s2[j + k]) {
        same = false;
        break;
      }
    }
    if (same) {
      memo.set(key, true);
      return true;
    }

    // 字符频次剪枝
    const freq: number[] = new Array<number>(26).fill(0);
    for (let k: number = 0; k < len; k++) {
      freq[s1.charCodeAt(i + k) - 97]++;
      freq[s2.charCodeAt(j + k) - 97]--;
    }
    for (let k: number = 0; k < 26; k++) {
      if (freq[k] !== 0) {
        memo.set(key, false);
        return false;
      }
    }

    // 枚举切分点
    for (let k: number = 1; k < len; k++) {
      // 不交换
      if (helper(i, j, k) && helper(i + k, j + k, len - k)) {
        memo.set(key, true);
        return true;
      }
      // 交换
      if (helper(i, j + len - k, k) && helper(i + k, j, len - k)) {
        memo.set(key, true);
        return true;
      }
    }

    memo.set(key, false);
    return false;
  }

  return helper(0, 0, n);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 扰乱字符串 =====");
console.log(isScramble("great", "rgeat")); // 期望结果: true
console.log(isScramble("abcde", "caebd")); // 期望结果: false
console.log(isScramble("a", "a")); // 期望结果: true
console.log(isScramble2("great", "rgeat")); // 期望结果: true
console.log(isScramble2("abcde", "caebd")); // 期望结果: false

export {};
