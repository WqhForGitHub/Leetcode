// ============================================================
// 078. 统计重复个数
// ============================================================
// LeetCode 466. Count The Repetitions
// 给定 s1, n1, s2, n2，s1 重复 n1 次得到的 S1 中，
// s2 重复 n2 次的 S2 出现的最大次数。
// 时间复杂度：O(|s1| * |s2|)，空间复杂度：O(|s1|)

// 方法1：DP 找循环节（推荐）
// 记录 s1 重复若干次后 s2 被匹配的位置，找到循环节后直接计算
// 时间复杂度 O(|s1| * |s2|)，空间复杂度 O(|s1|)
function getMaxRepetitions(s1: string, n1: number, s2: string, n2: number): number {
  if (n1 === 0 || n2 === 0) return 0;

  const len1: number = s1.length;
  const len2: number = s2.length;

  // repeatCount[i] 表示从 s1 第 i 个字符开始匹配，经过一个 s1 后，
  // s2 被完整匹配了多少次，以及下一个匹配从 s1 的哪个位置开始
  const nextIdx: number[] = new Array(len1).fill(0);
  const repeatCount: number[] = new Array(len1).fill(0);

  // 预处理：从 s1 的每个位置开始匹配 s2
  for (let start: number = 0; start < len1; start++) {
    let j: number = 0;
    let count: number = 0;
    for (let i: number = start; i < len1; i++) {
      if (s1[i] === s2[j]) {
        j++;
        if (j === len2) {
          j = 0;
          count++;
        }
      }
    }
    nextIdx[start] = j; // s2 中下一个要匹配的位置
    repeatCount[start] = count;
  }

  // 模拟 n1 个 s1，寻找循环节
  let totalRepeat: number = 0;
  let s2Pos: number = 0; // s2 中当前匹配到的位置

  // 记录每个 s2 匹配位置出现的时间（第几个 s1）和此时的累计次数
  const seenTime: Map<number, number> = new Map(); // s2Pos -> 第几个s1
  const seenCount: Map<number, number> = new Map(); // s2Pos -> 累计匹配次数

  let s1Used: number = 0;
  let hasCycle: boolean = false;

  while (s1Used < n1) {
    const key: number = s2Pos;
    if (seenTime.has(key) && !hasCycle) {
      // 发现循环节
      const prevS1: number = seenTime.get(key)!;
      const prevCount: number = seenCount.get(key)!;
      const cycleLen: number = s1Used - prevS1;
      const cycleCount: number = totalRepeat - prevCount;

      if (cycleLen > 0 && cycleCount > 0) {
        const cycles: number = Math.floor((n1 - s1Used) / cycleLen);
        s1Used += cycles * cycleLen;
        totalRepeat += cycles * cycleCount;
        hasCycle = true;
      }
    }

    if (!hasCycle) {
      seenTime.set(key, s1Used);
      seenCount.set(key, totalRepeat);
    }

    if (s1Used >= n1) break;

    // 处理当前 s1，从 s2Pos 开始
    totalRepeat += repeatCount[s2Pos];
    s2Pos = nextIdx[s2Pos];
    s1Used++;
  }

  return Math.floor(totalRepeat / n2);
}

// 方法2：暴力模拟
// 直接模拟匹配过程
// 时间复杂度 O(n1 * |s1|)，空间复杂度 O(1)
function getMaxRepetitionsBrute(s1: string, n1: number, s2: string, n2: number): number {
  let s1Count: number = 0;
  let s2Count: number = 0;
  let pos: number = 0;

  while (s1Count < n1) {
    for (let i: number = 0; i < s1.length; i++) {
      if (s1[i] === s2[pos]) {
        pos++;
        if (pos === s2.length) {
          pos = 0;
          s2Count++;
        }
      }
    }
    s1Count++;
  }

  return Math.floor(s2Count / n2);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 078. 统计重复个数 =====");
console.log(getMaxRepetitions("acb", 4, "ab", 2)); // 期望结果: 2
console.log(getMaxRepetitions("aaa", 3, "aa", 1)); // 期望结果: 4
console.log(getMaxRepetitions("baba", 11, "baab", 1)); // 期望结果: 0
console.log("--- 方法2测试 ---");
console.log(getMaxRepetitionsBrute("acb", 4, "ab", 2)); // 期望结果: 2
console.log(getMaxRepetitionsBrute("aaa", 3, "aa", 1)); // 期望结果: 4

export {};
