// ============================================================
// 147. 重构字符串
// ============================================================
// LeetCode 767. Reorganize String
// 给定字符串 s，重排使相邻字符不同。若无法重排则返回空串。
// 时间复杂度：O(n)，空间复杂度：O(1)

function reorganizeString(s: string): string {
  // 哈希表统计字符频率
  const count = new Map<string, number>();
  for (const ch of s) {
    count.set(ch, (count.get(ch) || 0) + 1);
  }

  // 按频率降序排序
  const sorted = Array.from(count.entries()).sort((a, b) => b[1] - a[1]);

  // 若最大频率超过半数，则无法重排
  if (sorted[0][1] > Math.floor((s.length + 1) / 2)) return "";

  // 准备结果数组，先按间隔填充最高频字符
  const result: string[] = new Array(s.length);
  let idx = 0;
  // 偶数下标先填，再奇数下标
  for (const [ch, freq] of sorted) {
    for (let k = 0; k < freq; k++) {
      if (idx >= s.length) idx = 1; // 转到奇数位置
      result[idx] = ch;
      idx += 2;
    }
  }
  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 147. 重构字符串 =====");
console.log(reorganizeString("aaab")); // 期望: "" (无法重排)
const r1 = reorganizeString("aab");
console.log(r1, r1 === "aba"); // 期望: "aba"
const r2 = reorganizeString("aaabbc");
console.log(r2); // 期望: 形如 "ababac" 等无相邻重复

export {};
