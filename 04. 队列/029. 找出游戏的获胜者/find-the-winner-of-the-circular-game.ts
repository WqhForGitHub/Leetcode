// ============================================================
// 029. 找出游戏的获胜者
// ============================================================
// LeetCode 1823. Find the Winner of the Circular Game
// n 个人围成一圈，从 1 开始数到 k 的人出圈，求最后剩下的人的编号。

// ------------------------------------------------------------
// 方法1：队列模拟
// ------------------------------------------------------------
// 用队列模拟约瑟夫环，每次把前 k-1 人移到队尾，第 k 人出队。
// 时间 O(n*k)，空间 O(n)。
function findTheWinner1(n: number, k: number): number {
  const queue: number[] = [];
  for (let i = 1; i <= n; i++) {
    queue.push(i);
  }
  while (queue.length > 1) {
    for (let i = 1; i < k; i++) {
      queue.push(queue.shift()!);
    }
    queue.shift();
  }
  return queue[0];
}

// ------------------------------------------------------------
// 方法2：数学递推（约瑟夫问题）
// ------------------------------------------------------------
// f(n, k) = (f(n-1, k) + k) % n，f(1, k) = 0。
// 结果需 +1（因为编号从 1 开始）。
// 时间 O(n)，空间 O(1)。
function findTheWinner2(n: number, k: number): number {
  let winner = 0;
  for (let i = 2; i <= n; i++) {
    winner = (winner + k) % i;
  }
  return winner + 1;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", findTheWinner1(5, 2), "期望: 3");
  console.log("测试2:", findTheWinner1(6, 5), "期望: 1");
  console.log("测试3:", findTheWinner2(5, 2), "期望: 3");
  console.log("测试4:", findTheWinner2(6, 5), "期望: 1");
  console.log("测试5:", findTheWinner2(1, 1), "期望: 1");
}

test();

export {};
