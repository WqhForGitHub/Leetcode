// 127. 统计完全连通分量的数量
// LC2685. Count the Number of Complete Components
// 题意：n 节点无向图 edges，完全连通分量指任意两点直连。求此类分量数量。
// 思路：DFS 求每个分量，若边数 = v(v-1)/2 则完全。

function countCompleteComponents(n: number, edges: number[][]): number {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }

  const visited: boolean[] = new Array(n).fill(false);
  let ans = 0;

  const bfs = (start: number): [number, number] => {
    const comp: number[] = [];
    const queue: number[] = [start];
    visited[start] = true;
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      comp.push(u);
      for (const v of adj[u]) {
        if (!visited[v]) {
          visited[v] = true;
          queue.push(v);
        }
      }
    }
    // 度数和
    let degreeSum = 0;
    for (const u of comp) degreeSum += adj[u].length;
    return [comp.length, degreeSum / 2];
  };

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      const [v, e] = bfs(i);
      if (e === (v * (v - 1)) / 2) ans++;
    }
  }
  return ans;
}

function test(): void {
  const case1 = countCompleteComponents(6, [
    [0, 1],
    [0, 2],
    [1, 2],
    [3, 4],
    [3, 5],
    [4, 5],
  ]);
  console.log("case1:", case1, "expected:", 2, case1 === 2);

  const case2 = countCompleteComponents(6, [
    [0, 1],
    [0, 2],
    [1, 2],
    [3, 4],
    [4, 5],
    [3, 5],
  ]);
  console.log("case2:", case2, "expected:", 1, case2 === 1);

  const case3 = countCompleteComponents(5, [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ]);
  console.log("case3:", case3, "expected:", 0, case3 === 0);
}

test();

export {};
