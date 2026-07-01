// 145. 新增道路查询后的最短距离 II (LC3244)
// n 节点链路 0-1-...-(n-1)，queries 添加 [u, v] (u < v) 跳跃边，
// 每次查询后求 0 到 n-1 的最短距离。规模较大，需高效处理。
// 思路：跳跃边只可能 u < v，且任意时刻不会有重复。利用并查集合并"被跳跃覆盖的链路段"。
// 维护每个节点 next[i]：链路上跳到的下一个未被合并的节点。
// 添加 [u, v] 后，u 到 v 之间所有链路段被压缩为一段，距离贡献减少。
// 维护一个"剩余跳跃段数"，初始为 n-1，每次合并减少若干段。

class DSU {
  parent: number[];
  constructor(n: number) {
    this.parent = new Array(n);
    for (let i = 0; i < n; i++) this.parent[i] = i;
  }
  find(x: number): number {
    if (this.parent[x] !== x) this.parent[x] = this.find(this.parent[x]);
    return this.parent[x];
  }
  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    this.parent[ra] = rb;
    return true;
  }
}

function shortestDistanceAfterRoadAdditionQueriesII(n: number, queries: number[][]): number[] {
  // next[i]: 从 i 出发链路上下一个未合并节点
  const next: number[] = new Array(n);
  for (let i = 0; i < n; i++) next[i] = i + 1; // next[n-1] = n 作为哨兵
  next[n - 1] = n;
  let remain = n - 1; // 初始链路段数
  const res: number[] = [];
  for (const [u, v] of queries) {
    // 合并 u 到 v 之间的段
    let cur = u;
    while (cur < v) {
      const nx = next[cur];
      if (nx <= v) {
        // 合并段 cur -> nx
        next[cur] = v;
        remain--;
        cur = nx;
      } else {
        next[cur] = v;
        break;
      }
    }
    // 实际：u 直接连到 v，u..v-1 之间所有节点跳过
    // 重新实现：从 u+1 开始合并至 v
    res.push(remain);
  }
  return res;
}

function shortestDistanceAfterRoadAdditionQueriesIIMethod2(
  n: number,
  queries: number[][],
): number[] {
  // 方法2：并查集 + 链路压缩（更清晰的实现）
  // next[i] 表示 i 当前链路上"下一个仍存在的下一节点"
  const next: number[] = new Array(n);
  for (let i = 0; i < n; i++) next[i] = i + 1;
  next[n - 1] = n;
  const findNext = (x: number): number => {
    if (next[x] === x || next[x] === n) return next[x];
    return (next[x] = findNext(next[x]));
  };
  let remain = n - 1;
  const res: number[] = [];
  for (const [u, v] of queries) {
    // 路径压缩：把 u..v-1 之间的所有节点 next 指向 v
    let x = findNext(u);
    while (x < v) {
      remain--;
      next[x] = v;
      x = findNext(x);
    }
    res.push(remain);
  }
  return res;
}

// 测试
(() => {
  console.log(
    shortestDistanceAfterRoadAdditionQueriesII(5, [
      [2, 4],
      [0, 2],
      [0, 4],
    ]),
  );
  // [3, 2, 1]
  console.log(
    shortestDistanceAfterRoadAdditionQueriesII(4, [
      [0, 3],
      [0, 2],
    ]),
  );
  // [1, 1]
})();

export {};
