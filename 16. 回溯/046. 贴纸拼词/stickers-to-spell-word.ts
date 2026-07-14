// ============================================================
// 046. 贴纸拼词
// ============================================================
// LeetCode 691. Stickers to Spell Word
// 给定 n 种贴纸（每种可使用多次）和目标字符串 target，求最少使用多少张贴纸才能拼出 target。
// 每张贴纸可以从中剪切字母使用，无法拼出返回 -1。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯+记忆化(状态为目标字符串的字符频率) (推荐)
// 将target用字符频率数组表示状态，递归尝试每个贴纸减少状态。
// 使用记忆化避免重复状态计算。对贴纸预处理为字符频率。
// 时间复杂度 O(状态数 * n * |target|), 空间复杂度 O(状态数 * |target|)
function minStickers(stickers: string[], target: string): number {
  // 预处理：将每个贴纸转成字符频率（仅target中的字符）
  const targetCount = new Array<number>(26).fill(0);
  for (const ch of target) targetCount[ch.charCodeAt(0) - 97]++;

  const stickerCounts: number[][] = stickers.map((s) => {
    const cnt = new Array<number>(26).fill(0);
    for (const ch of s) {
      const idx = ch.charCodeAt(0) - 97;
      if (targetCount[idx] > 0) cnt[idx]++;
    }
    return cnt;
  });

  // 状态：26长度的剩余需求字符串作为key
  const memo = new Map<string, number>();

  const stateKey = (cnt: number[]): string => cnt.join(",");

  const backtrack = (need: number[]): number => {
    // 判断是否所有字符都已凑齐
    let allZero = true;
    for (let i = 0; i < 26; i++) {
      if (need[i] > 0) {
        allZero = false;
        break;
      }
    }
    if (allZero) return 0;

    const key = stateKey(need);
    if (memo.has(key)) return memo.get(key)!;

    let result = Infinity;
    // 选择一个能减少需求量的贴纸
    for (const sc of stickerCounts) {
      // 找到第一个还有需求的字符，并要求该贴纸包含该字符，避免重复尝试等价状态
      let firstIdx = -1;
      for (let i = 0; i < 26; i++) {
        if (need[i] > 0) {
          firstIdx = i;
          break;
        }
      }
      if (sc[firstIdx] === 0) continue;

      const newNeed: number[] = [];
      for (let i = 0; i < 26; i++) {
        newNeed.push(Math.max(0, need[i] - sc[i]));
      }
      const sub = backtrack(newNeed);
      if (sub !== Infinity && 1 + sub < result) result = 1 + sub;
    }

    memo.set(key, result);
    return result;
  };

  const ans = backtrack([...targetCount]);
  return ans === Infinity ? -1 : ans;
}

// 方法2：BFS+状态压缩
// 使用target长度的位掩码表示已凑齐的字符位置，BFS逐层扩展状态。
// 时间复杂度 O(2^|target| * n * |target|), 空间复杂度 O(2^|target|)
function minStickersBFS(stickers: string[], target: string): number {
  const _n = target.length;
  // 预处理贴纸的字符位置映射（每个贴纸能贡献哪些位置）
  const stickerLetters: number[][] = stickers.map((s) => {
    const cnt = new Array<number>(26).fill(0);
    for (const ch of s) cnt[ch.charCodeAt(0) - 97]++;
    return cnt;
  });

  const targetLetters = new Array<number>(26).fill(0);
  for (const ch of target) targetLetters[ch.charCodeAt(0) - 97]++;

  // 检查target中的字符是否都能被贴纸覆盖
  for (let i = 0; i < 26; i++) {
    if (targetLetters[i] > 0) {
      let canCover = false;
      for (const sc of stickerLetters) {
        if (sc[i] > 0) {
          canCover = true;
          break;
        }
      }
      if (!canCover) return -1;
    }
  }

  const targetCnt = new Array<number>(26).fill(0);
  for (const ch of target) targetCnt[ch.charCodeAt(0) - 97]++;

  // BFS：状态是26个字符的剩余数量
  const startKey = targetCnt.join(",");
  const queue: { cnt: number[]; steps: number }[] = [{ cnt: [...targetCnt], steps: 0 }];
  const visited = new Set<string>([startKey]);

  while (queue.length > 0) {
    const { cnt, steps } = queue.shift()!;
    // 是否完成
    let done = true;
    for (let i = 0; i < 26; i++) {
      if (cnt[i] > 0) {
        done = false;
        break;
      }
    }
    if (done) return steps;

    // 找到第一个还有需求的位置
    let firstIdx = -1;
    for (let i = 0; i < 26; i++) {
      if (cnt[i] > 0) {
        firstIdx = i;
        break;
      }
    }

    for (const sc of stickerLetters) {
      if (sc[firstIdx] === 0) continue;
      const newCnt: number[] = [];
      for (let i = 0; i < 26; i++) {
        newCnt.push(Math.max(0, cnt[i] - sc[i]));
      }
      const k = newCnt.join(",");
      if (!visited.has(k)) {
        visited.add(k);
        queue.push({ cnt: newCnt, steps: steps + 1 });
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 贴纸拼词 =====");
console.log(minStickers(["with", "example", "science"], "thehat")); // 期望结果: 3
console.log(minStickers(["notice", "possible"], "basicbasic")); // 期望结果: -1
console.log(minStickersBFS(["with", "example", "science"], "thehat")); // 期望结果: 3
console.log(minStickersBFS(["notice", "possible"], "basicbasic")); // 期望结果: -1

export {};
