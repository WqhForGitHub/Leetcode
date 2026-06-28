// ============================================================
// 125. 贴纸拼词
// ============================================================
// LeetCode 691. Stickers to Spell Word
// 给定 n 种贴纸（每种无限张）和目标字符串 target，求拼出 target 所需的最少贴纸数。
// 时间复杂度：O(2^T * T * n)，T 为 target 长度；空间复杂度：O(2^T)

// 思路：状态压缩 DP + 哈希表（记忆化）
// 状态：当前 target 已被覆盖的字符位置集合（用位掩码表示）
function minStickers(stickers: string[], target: string): number {
  const n = target.length;
  const N = 1 << n; // 所有状态

  // dp[state] = 已覆盖 state 状态时，还需最少贴纸数
  const dp = new Array(N).fill(Infinity);
  dp[0] = 0; // 空状态需要 0 张

  // 预处理每个贴纸的字符计数
  const stickerCounts = stickers.map((s) => countChars(s));

  for (let state = 0; state < N; state++) {
    if (dp[state] === Infinity) continue;
    // 尝试用每张贴纸推进状态
    for (const sc of stickerCounts) {
      // 复制计数
      const cnt = [...sc];
      let next = state;
      for (let i = 0; i < n; i++) {
        // 若 target[i] 尚未被覆盖且贴纸有该字符
        if (!(state & (1 << i)) && cnt[target.charCodeAt(i) - 97] > 0) {
          cnt[target.charCodeAt(i) - 97]--;
          next |= 1 << i;
        }
      }
      if (next !== state) {
        dp[next] = Math.min(dp[next], dp[state] + 1);
      }
    }
  }

  return dp[N - 1] === Infinity ? -1 : dp[N - 1];
}

function countChars(s: string): number[] {
  const cnt = new Array(26).fill(0);
  for (const ch of s) {
    cnt[ch.charCodeAt(0) - 97]++;
  }
  return cnt;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 125. 贴纸拼词 =====");
console.log(minStickers(["with", "example", "science"], "thehat")); // 期望: 3
console.log(minStickers(["notice", "possible"], "basicbasic")); // 期望: -1

export {};
