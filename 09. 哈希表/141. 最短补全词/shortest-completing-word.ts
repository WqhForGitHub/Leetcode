// ============================================================
// 141. 最短补全词
// ============================================================
// LeetCode 748. Shortest Completing Word
// 给定车牌字符串 licensePlate（含字母和数字）和单词数组 words，
// 找到包含 licensePlate 所有字母（不区分大小写）的最短单词，相同长度返回第一个。
// 时间复杂度：O(N*L)，N 为单词数，L 为平均长度；空间复杂度：O(1)

function shortestCompletingWord(licensePlate: string, words: string[]): string {
  // 统计 licensePlate 中字母频率（忽略大小写、非字母）
  const target = new Array(26).fill(0);
  for (const ch of licensePlate) {
    if (/[a-zA-Z]/.test(ch)) {
      const lower = ch.toLowerCase();
      target[lower.charCodeAt(0) - 97]++;
    }
  }

  let best: string | null = null;

  for (const word of words) {
    if (best !== null && word.length >= best.length) continue;
    // 统计单词字母频率
    const cnt = new Array(26).fill(0);
    for (const ch of word) {
      cnt[ch.charCodeAt(0) - 97]++;
    }
    // 检查是否覆盖所有目标字母
    let ok = true;
    for (let i = 0; i < 26; i++) {
      if (cnt[i] < target[i]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      best = word;
    }
  }
  return best!;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 141. 最短补全词 =====");
console.log(shortestCompletingWord("1s3 PSt", ["step", "steps", "stripe", "stepple"])); // 期望: "steps"
console.log(shortestCompletingWord("1s3 456", ["looks", "pest", "stew", "show"])); // 期望: "pest"

export {};
