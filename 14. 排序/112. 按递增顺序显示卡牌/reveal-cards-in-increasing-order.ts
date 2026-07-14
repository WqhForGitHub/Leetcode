// ============================================================
// 112. 按递增顺序显示卡牌
// ============================================================
// LeetCode 950. Reveal Cards In Increasing Order
// 牌组牌面朝下。重复操作：翻开顶牌（移除并展示），把下一张移到底部，
// 直到所有牌翻开。给定牌组，返回能使翻开顺序为递增的初始牌组排列。

// 方法1：排序 + 队列模拟（O(n log n) 时间，O(n) 空间）
// 排序后用下标队列模拟翻牌过程：每次队首下标放入当前最小牌，
// 再把下一个队首下标移到队尾（模拟"把下一张移到底部"）。
function deckRevealedIncreasing(deck: number[]): number[] {
  deck.sort((a, b) => a - b);
  const n = deck.length;
  const queue: number[] = [];
  for (let i = 0; i < n; i++) queue.push(i);
  const result = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    // 第 i 小的牌放到当前队首下标位置（模拟翻开顶牌）
    result[queue.shift()!] = deck[i];
    // 把下一张牌移到底部（模拟移动操作）
    if (queue.length > 0) {
      queue.push(queue.shift()!);
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 112. 按递增顺序显示卡牌 =====");
console.log(JSON.stringify(deckRevealedIncreasing([17, 13, 11, 2, 3, 5, 7]))); // 期望 [2,13,3,11,5,17,7]
console.log(JSON.stringify(deckRevealedIncreasing([1, 1000]))); // 期望 [1,1000]

export {};
