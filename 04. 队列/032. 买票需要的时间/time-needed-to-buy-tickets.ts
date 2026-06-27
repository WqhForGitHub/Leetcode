// ============================================================
// 032. 买票需要的时间
// ============================================================
// LeetCode 2073. Time Needed to Buy Tickets
// n 个人排队买票，第 i 个人需要买 tickets[i] 张，每次轮到的人买 1 张并排到队尾。
// 求位于位置 k 的人买完票需要的时间。

// ------------------------------------------------------------
// 方法1：队列模拟
// ------------------------------------------------------------
// 用队列模拟买票过程，直到第 k 个人买完。
// 时间 O(sum(tickets))，空间 O(n)。
function timeRequiredToBuy1(tickets: number[], k: number): number {
  const queue: number[] = tickets.map((_, i) => i);
  let time = 0;
  while (queue.length > 0) {
    const front = queue.shift()!;
    tickets[front]--;
    time++;
    if (tickets[front] === 0) {
      if (front === k) return time;
    } else {
      queue.push(front);
    }
  }
  return time;
}

// ------------------------------------------------------------
// 方法2：数学计算
// ------------------------------------------------------------
// 第 k 个人买完时，排在他前面的人最多买 tickets[k] 张，
// 排在他后面的人最多买 tickets[k]-1 张。
// 时间 O(n)，空间 O(1)。
function timeRequiredToBuy2(tickets: number[], k: number): number {
  let time = 0;
  const target = tickets[k];
  for (let i = 0; i < tickets.length; i++) {
    if (i <= k) {
      time += Math.min(tickets[i], target);
    } else {
      time += Math.min(tickets[i], target - 1);
    }
  }
  return time;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", timeRequiredToBuy1([2, 3, 2], 2), "期望: 6");
  console.log("测试2:", timeRequiredToBuy1([5, 1, 1, 1], 0), "期望: 8");
  console.log("测试3:", timeRequiredToBuy2([2, 3, 2], 2), "期望: 6");
  console.log("测试4:", timeRequiredToBuy2([5, 1, 1, 1], 0), "期望: 8");
}

test();

export {};
