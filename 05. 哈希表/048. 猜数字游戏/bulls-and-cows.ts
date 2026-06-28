// ============================================================
// 048. 猜数字游戏
// ============================================================
// LeetCode 299. Bulls and Cows
// 猜数字游戏：secret 为答案，guess 为猜测。
// Bulls (A)：数字和位置都对的个数；Cows (B)：数字对但位置不对的个数。
// 返回格式 "xAyB"。
// 时间复杂度：O(n)，空间复杂度：O(1)（数字 0-9 有限）

function getHint(secret: string, guess: string): string {
  let bulls = 0;
  let cows = 0;
  // 哈希表统计非 bull 位置上各数字的出现次数
  const secretCount = new Map<string, number>();
  const guessCount = new Map<string, number>();

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) {
      bulls++; // 位置和数字都对
    } else {
      // 统计非 bull 位置的数字频次
      secretCount.set(secret[i], (secretCount.get(secret[i]) ?? 0) + 1);
      guessCount.set(guess[i], (guessCount.get(guess[i]) ?? 0) + 1);
    }
  }

  // Cows = 两者频次的最小值之和
  for (const [digit, cnt] of guessCount) {
    const sCnt = secretCount.get(digit) ?? 0;
    cows += Math.min(cnt, sCnt);
  }

  return `${bulls}A${cows}B`;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 048. 猜数字游戏 =====");
console.log(getHint("1807", "7810")); // "1A3B"
console.log(getHint("1123", "0111")); // "1A1B"
console.log(getHint("1", "0")); // "0A0B"
console.log(getHint("1122", "2211")); // "0A4B"

export {};
