// ============================================================
// 063. K 距离间隔重排字符串
// ============================================================
// LeetCode 358. Rearrange String k Distance Apart
// 重排字符串，使相同字符之间至少间隔 k。若无法重排则返回空串。
// 时间复杂度：O(N log A)，A 为字符种类数
// 空间复杂度：O(A)

// 堆节点：字符及其剩余可用次数
interface CharCount {
  ch: string;
  count: number;
}

function rearrangeString(s: string, k: number): string {
  if (k <= 1) return s; // k <= 1 时任意排列都满足

  // 1. 统计字符频率
  const freq = new Map<string, number>();
  for (const ch of s) {
    freq.set(ch, (freq.get(ch) ?? 0) + 1);
  }

  // 2. 按频率降序排序后用作"堆"（数组 + 排序模拟优先队列）
  const heap: CharCount[] = [];
  for (const [ch, count] of freq) {
    heap.push({ ch, count });
  }
  heap.sort((a, b) => b.count - a.count);

  const result: string[] = [];
  // 冷却队列：存放本轮被使用、还需等待的字符
  // 元素：{ charCount, readyAt }
  const cooldown: Array<{ charCount: CharCount; readyAt: number }> = [];

  let pos = 0; // 当前结果位置
  while (heap.length > 0 || cooldown.length > 0) {
    // 把到达冷却结束时间的字符放回堆
    while (cooldown.length > 0 && cooldown[0].readyAt <= pos) {
      const item = cooldown.shift()!;
      if (item.charCount.count > 0) {
        heap.push(item.charCount);
        // 重新排序保持按频率降序
        heap.sort((a, b) => b.count - a.count);
      }
    }

    if (heap.length === 0) {
      // 没有可用字符但还没排完 -> 无法满足间隔要求
      return "";
    }

    // 贪心：取频率最高的字符
    const top = heap.shift()!;
    result.push(top.ch);
    top.count--;
    // 若仍有剩余，加入冷却队列，k 步后可再用
    if (top.count > 0) {
      cooldown.push({ charCount: top, readyAt: pos + k });
    }
    pos++;
  }

  return result.join("");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. K 距离间隔重排字符串 =====");

// 测试 1：可重排
// "aabbcc" k=3 -> 一种合法结果如 "abcabc"，相同字符间隔正好 3
const r1 = rearrangeString("aabbcc", 3);
console.log("test1:", r1); // 期望形如 "abcabc"
console.log("test1 valid:", r1 === "abcabc" || r1 === "acbacb");

// 测试 2：无法重排
// "aaabc" k=3，a 出现 3 次但只有 5 个位置，间隔 3 无法放下
const r2 = rearrangeString("aaabc", 3);
console.log("test2:", JSON.stringify(r2)); // 期望 ""

// 测试 3：k=1 时原样返回
const r3 = rearrangeString("aabbcc", 1);
console.log("test3:", r3); // 期望 "aabbcc"

// 测试 4：相同字符间隔满足
const r4 = rearrangeString("aaadbbcc", 2);
console.log("test4:", r4); // 期望类似 "abacabcd" 之类的合法串

export {};
