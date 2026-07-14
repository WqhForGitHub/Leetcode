// ============================================================
// 069. 得分最高的单词集合
// ============================================================
// LeetCode 1255. Maximum Score Words Formed by Letters
// 给定单词数组、可用字母数组、每个字母的分数，求可选单词子集的最大得分。
// 每个字母最多使用给定次数。
// 时间复杂度：O(2^N * L), 空间复杂度：O(N + 26)

// 方法1：回溯 (子集枚举) (推荐)
// 枚举每个单词选或不选，维护字母剩余计数
// 时间复杂度 O(2^N * L), 空间复杂度 O(N + 26)
function maxScoreWords(words: string[], letters: string[], score: number[]): number {
  // 统计可用字母数
  const avail: number[] = new Array(26).fill(0);
  for (const ch of letters) avail[ch.charCodeAt(0) - 97]++;

  let best = 0;

  // 计算单词分数与字母使用情况
  const wordScore: number[] = [];
  const wordCount: number[][] = [];
  for (const w of words) {
    let s = 0;
    const cnt: number[] = new Array(26).fill(0);
    for (const ch of w) {
      const idx = ch.charCodeAt(0) - 97;
      cnt[idx]++;
      s += score[idx];
    }
    wordScore.push(s);
    wordCount.push(cnt);
  }

  const n = words.length;

  const backtrack = (idx: number, curScore: number, remaining: number[]): void => {
    if (idx === n) {
      if (curScore > best) best = curScore;
      return;
    }
    // 不选当前单词
    backtrack(idx + 1, curScore, remaining);
    // 选当前单词：检查字母是否够
    const cnt = wordCount[idx];
    let canChoose = true;
    for (let i = 0; i < 26; i++) {
      if (cnt[i] > remaining[i]) {
        canChoose = false;
        break;
      }
    }
    if (canChoose) {
      for (let i = 0; i < 26; i++) remaining[i] -= cnt[i];
      backtrack(idx + 1, curScore + wordScore[idx], remaining);
      for (let i = 0; i < 26; i++) remaining[i] += cnt[i];
    }
  };

  backtrack(0, 0, avail);
  return best;
}

// 方法2：位掩码枚举
// 枚举所有 2^N 个子集，对每个子集检查字母是否够并计算分数
// 时间复杂度 O(2^N * (N + 26)), 空间复杂度 O(26)
function maxScoreWords2(words: string[], letters: string[], score: number[]): number {
  const avail: number[] = new Array(26).fill(0);
  for (const ch of letters) avail[ch.charCodeAt(0) - 97]++;

  const n = words.length;
  // 预计算每个单词的字母计数与分数
  const wordCount: number[][] = [];
  const wordScore: number[] = [];
  for (const w of words) {
    const cnt: number[] = new Array(26).fill(0);
    let s = 0;
    for (const ch of w) {
      const idx = ch.charCodeAt(0) - 97;
      cnt[idx]++;
      s += score[idx];
    }
    wordCount.push(cnt);
    wordScore.push(s);
  }

  let best = 0;
  const total = 1 << n;
  for (let mask = 1; mask < total; mask++) {
    const used: number[] = new Array(26).fill(0);
    let s = 0;
    let ok = true;
    for (let i = 0; i < n; i++) {
      if ((mask >> i) & 1) {
        for (let c = 0; c < 26; c++) {
          used[c] += wordCount[i][c];
          if (used[c] > avail[c]) {
            ok = false;
            break;
          }
        }
        if (!ok) break;
        s += wordScore[i];
      }
    }
    if (ok && s > best) best = s;
  }
  return best;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 069. 得分最高的单词集合 =====");
console.log(
  maxScoreWords(
    ["dog", "cat", "dad", "good"],
    ["a", "a", "c", "d", "d", "d", "g", "o", "o"],
    [1, 0, 9, 5, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ),
); // 期望结果: 23
console.log(
  maxScoreWords2(
    ["dog", "cat", "dad", "good"],
    ["a", "a", "c", "d", "d", "d", "g", "o", "o"],
    [1, 0, 9, 5, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ),
); // 期望结果: 23

export {};
