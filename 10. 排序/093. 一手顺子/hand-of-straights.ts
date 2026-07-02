// ============================================================
// 093. 一手顺子
// ============================================================
// LeetCode 846. Hand of Straights
// 给定扑克牌数组 hand 和正整数 groupSize，判断能否将所有牌分成若干组，
// 每组 groupSize 张且点数连续。

// 方法1：排序 + 计数哈希 + 贪心（推荐，O(n log n) 时间，O(n) 空间）
// 统计每张牌出现次数，按点数升序处理。
// 对当前最小点数 s（次数 k>0），它只能作为某组起点，故必须用掉 k 个
// s, s+1, ..., s+groupSize-1；若任一点数不足 k 则失败。
function isNStraightHand(hand: number[], groupSize: number): boolean {
  const n = hand.length;
  if (n % groupSize !== 0) return false;

  const count = new Map<number, number>();
  for (const c of hand) {
    count.set(c, (count.get(c) ?? 0) + 1);
  }

  const keys = Array.from(count.keys()).sort((a, b) => a - b);
  for (const s of keys) {
    const k = count.get(s)!;
    if (k === 0) continue;
    for (let i = 0; i < groupSize; i++) {
      const need = s + i;
      const have = count.get(need) ?? 0;
      if (have < k) return false;
      count.set(need, have - k);
    }
  }
  return true;
}

// 方法2：计数哈希 + 回退找起点（摊还 O(n) 时间，O(n) 空间）
// 不显式排序，遍历原始数组；对每张未用完的牌 c，向左回退到真正起点 s
// （即 count[s-1] == 0），再一次性形成 count[s] 个以 s 开头的组。
// 因每张牌计数最多被减到 0 一次，整体摊还为 O(n)。
function isNStraightHandMap(hand: number[], groupSize: number): boolean {
  const n = hand.length;
  if (n % groupSize !== 0) return false;

  const count = new Map<number, number>();
  for (const c of hand) {
    count.set(c, (count.get(c) ?? 0) + 1);
  }

  for (const c of hand) {
    if ((count.get(c) ?? 0) === 0) continue;
    // 回退找到这段连续牌的真正起点
    let s = c;
    while ((count.get(s - 1) ?? 0) > 0) {
      s--;
    }
    const k = count.get(s)!;
    for (let i = 0; i < groupSize; i++) {
      const need = s + i;
      const have = count.get(need) ?? 0;
      if (have < k) return false;
      count.set(need, have - k);
    }
  }
  return true;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 093. 一手顺子 =====");
console.log("排序贪心 [1,2,3,6,2,3,4,7,8],3:", isNStraightHand([1, 2, 3, 6, 2, 3, 4, 7, 8], 3)); // 期望 true
console.log("排序贪心 [1,2,3,4,5],4:", isNStraightHand([1, 2, 3, 4, 5], 4)); // 期望 false
console.log(
  "排序贪心 [3,2,1,2,3,4,3,4,5,9,10,11],3:",
  isNStraightHand([3, 2, 1, 2, 3, 4, 3, 4, 5, 9, 10, 11], 3),
); // 期望 true
console.log("回退法 [1,2,3,6,2,3,4,7,8],3:", isNStraightHandMap([1, 2, 3, 6, 2, 3, 4, 7, 8], 3)); // 期望 true
console.log("回退法 [1,2,3,4,5],4:", isNStraightHandMap([1, 2, 3, 4, 5], 4)); // 期望 false
console.log(
  "回退法 [3,2,1,2,3,4,3,4,5,9,10,11],3:",
  isNStraightHandMap([3, 2, 1, 2, 3, 4, 3, 4, 5, 9, 10, 11], 3),
); // 期望 true

export {};
