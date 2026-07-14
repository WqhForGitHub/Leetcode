// 122. 收集树中金币
// LC2603. Collect Coins in a Tree
// 题意：n 节点树 edges，coins[i] 表示该节点有金币。
//      距离 <= 2 可收集，从 0 出发收集所有金币最少边数（最后回到 0）。
// 思路：拓扑剥离无金币叶子 2 层后，剩余连通块边数 * 2。

function collectTheCoins(coins: number[], edges: number[][]): number {
  const n = coins.length;
  if (n <= 1) return 0;

  const adj: Set<number>[] = Array.from({ length: n }, () => new Set<number>());
  const deg: number[] = new Array(n).fill(0);
  for (const [u, v] of edges) {
    adj[u].add(v);
    adj[v].add(u);
    deg[u]++;
    deg[v]++;
  }

  // 1) 剥离所有无金币叶子
  const degCopy = deg.slice();
  const queue: number[] = [];
  for (let i = 0; i < n; i++) {
    if (degCopy[i] === 1 && coins[i] === 0) queue.push(i);
  }
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of adj[u]) {
      adj[v].delete(u);
      degCopy[v]--;
      if (degCopy[v] === 1 && coins[v] === 0) {
        queue.push(v);
      }
    }
    adj[u].clear();
    degCopy[u] = 0;
  }

  // 2) 再剥离 2 层叶子（无论是否有金币）
  for (let layer = 0; layer < 2; layer++) {
    const leaves: number[] = [];
    for (let i = 0; i < n; i++) {
      if (degCopy[i] === 1) leaves.push(i);
    }
    for (const u of leaves) {
      for (const v of adj[u]) {
        adj[v].delete(u);
        degCopy[v]--;
      }
      adj[u].clear();
      degCopy[u] = 0;
    }
  }

  let edgeCnt = 0;
  for (let i = 0; i < n; i++) {
    edgeCnt += degCopy[i];
  }
  // 每条边计数两次，剩余边数 = edgeCnt / 2，往返 *2
  const remain = edgeCnt / 2;
  return remain <= 0 ? 0 : (remain - 1) * 2;
}

function test(): void {
  const case1 = collectTheCoins(
    [1, 0, 0, 0, 0, 1],
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  );
  console.log("case1:", case1, "expected:", 2, case1 === 2);

  const case2 = collectTheCoins(
    [0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
    [
      [0, 1],
      [0, 2],
      [1, 3],
      [1, 4],
      [2, 5],
      [2, 6],
      [4, 7],
      [6, 8],
      [8, 9],
    ],
  );
  console.log("case2:", case2, "expected:", 6, case2 === 6);
}

test();

export {};
