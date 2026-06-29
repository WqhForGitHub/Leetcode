// ============================================================
// 019. 按递增顺序显示卡牌
// ============================================================
// LeetCode 950. Reveal Cards In Increasing Order
// 牌组按特定规则显示：每次显示牌组第一张，然后把新的第一张放到底部，重复。
// 给定结果序列，求原始牌组排列（使得按此规则显示后为递增序）。

// ------------------------------------------------------------
// 方法1：队列模拟逆过程
// ------------------------------------------------------------
// 将牌排序，用队列模拟位置：每次取一个位置放牌，下一个位置移到队尾。
// 时间 O(n log n)，空间 O(n)。
function deckRevealedIncreasing1(deck: number[]): number[] {
  deck.sort((a, b) => a - b);
  const n = deck.length;
  const indices: number[] = [];
  for (let i = 0; i < n; i++) indices.push(i);
  const result: number[] = new Array(n);
  const queue: number[] = [...indices];
  for (const card of deck) {
    result[queue.shift()!] = card;
    if (queue.length > 0) {
      queue.push(queue.shift()!);
    }
  }
  return result;
}

// ------------------------------------------------------------
// 方法2：双端队列模拟
// ------------------------------------------------------------
// 逆序思考：从最后一张开始，每次把前一张放到结果头部，
// 再把结果最后一张移到头部。
// 时间 O(n log n)，空间 O(n)。
function deckRevealedIncreasing2(deck: number[]): number[] {
  deck.sort((a, b) => a - b);
  const n = deck.length;
  const result: number[] = [];
  for (let i = n - 1; i >= 0; i--) {
    if (result.length > 0) {
      result.unshift(result.pop()!);
    }
    result.unshift(deck[i]);
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log(
    "测试1:",
    JSON.stringify(deckRevealedIncreasing1([17, 13, 11, 2, 3, 5, 7])),
    "期望: [2,13,3,11,5,17,7]",
  );
  console.log("测试2:", JSON.stringify(deckRevealedIncreasing1([1, 1000])), "期望: [1,1000]");
  console.log(
    "测试3:",
    JSON.stringify(deckRevealedIncreasing2([17, 13, 11, 2, 3, 5, 7])),
    "期望: [2,13,3,11,5,17,7]",
  );
  console.log("测试4:", JSON.stringify(deckRevealedIncreasing2([1, 1000])), "期望: [1,1000]");
}

test();

export {};
