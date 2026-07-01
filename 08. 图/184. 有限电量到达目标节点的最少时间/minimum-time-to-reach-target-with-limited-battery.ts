// 184. 有限电量到达目标节点的最少时间
// 自定义题：n 节点图，边有耗时与耗电量；电池容量 B；充电站节点可瞬间充满。
//       从 0 到 target 的最少时间，途中电量不可耗尽。
// 思路：Dijkstra，状态 = (节点, 当前电量)，键值为累计时间。
//       边转移：若电量 >= 边耗电则推进；站点节点可转移至 (node, B) 不增时间。
//       注意电量越大越优，剪枝：仅记录每个节点见过的"更优(时间更小或电量更大)"状态。

interface Edge184 {
  to: number;
  time: number;
  batt: number;
}

interface State184 {
  node: number;
  battery: number;
  time: number;
}

class MinHeap184 {
  private data: State184[] = [];
  public size(): number {
    return this.data.length;
  }
  public push(x: State184): void {
    this.data.push(x);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p].time <= this.data[i].time) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  public pop(): State184 | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      const n = this.data.length;
      while (true) {
        const l = 2 * i + 1,
          r = 2 * i + 2;
        let s = i;
        if (l < n && this.data[l].time < this.data[s].time) s = l;
        if (r < n && this.data[r].time < this.data[s].time) s = r;
        if (s === i) break;
        [this.data[s], this.data[i]] = [this.data[i], this.data[s]];
        i = s;
      }
    }
    return top;
  }
}

class MinimumTimeToReachTargetWithLimitedBattery {
  private n: number;
  private adj: Edge184[][];
  private capacity: number;
  private station: boolean[];

  constructor(
    n: number,
    edges: [number, number, number, number][],
    capacity: number,
    stations: number[],
  ) {
    this.n = n;
    this.capacity = capacity;
    this.adj = Array.from({ length: n }, () => []);
    for (const [u, v, t, b] of edges) {
      this.adj[u].push({ to: v, time: t, batt: b });
      this.adj[v].push({ to: u, time: t, batt: b });
    }
    this.station = new Array(n).fill(false);
    for (const s of stations) this.station[s] = true;
  }

  // 主方法：从 0 到 target 的最少时间
  public minTime(target: number): number {
    const startB = this.station[0] ? this.capacity : this.capacity;
    const heap = new MinHeap184();
    // best[node] = Map<battery, minTime>，剪枝用
    const best = Array.from({ length: this.n }, () => new Map<number, number>());
    heap.push({ node: 0, battery: startB, time: 0 });
    best[0].set(startB, 0);

    while (heap.size() > 0) {
      const cur = heap.pop()!;
      if (cur.node === target) return cur.time;
      if (best[cur.node].get(cur.battery)! < cur.time) continue;

      // 充电站：充满
      if (this.station[cur.node] && cur.battery < this.capacity) {
        const nb = this.capacity;
        const prev = best[cur.node].get(nb);
        if (prev === undefined || cur.time < prev) {
          best[cur.node].set(nb, cur.time);
          heap.push({ node: cur.node, battery: nb, time: cur.time });
        }
      }

      for (const e of this.adj[cur.node]) {
        if (cur.battery < e.batt) continue;
        const v = e.to;
        const nb = cur.battery - e.batt;
        const nt = cur.time + e.time;
        const prev = best[v].get(nb);
        if (prev === undefined || nt < prev) {
          best[v].set(nb, nt);
          heap.push({ node: v, battery: nb, time: nt });
        }
      }
    }
    return -1;
  }

  // 辅助方法：判断节点是否为充电站
  public isStation(node: number): boolean {
    return this.station[node];
  }
}

// 测试
(() => {
  // 样例：0 - 1(time=2,batt=1) - 2(time=3,batt=1)，容量 2，无站点，0->2
  // 电量：2 ->1 ->0，时间 2+3=5
  const sol1 = new MinimumTimeToReachTargetWithLimitedBattery(
    3,
    [
      [0, 1, 2, 1],
      [1, 2, 3, 1],
    ],
    2,
    [],
  );
  console.log("Test1:", sol1.minTime(2)); // 5

  // 样例：边耗电超过容量，不可达
  const sol2 = new MinimumTimeToReachTargetWithLimitedBattery(
    3,
    [
      [0, 1, 2, 5],
      [1, 2, 3, 1],
    ],
    2,
    [],
  );
  console.log("Test2:", sol2.minTime(2)); // -1

  // 样例：1 为充电站，0->1->2->1(充)->更远
  const sol3 = new MinimumTimeToReachTargetWithLimitedBattery(
    4,
    [
      [0, 1, 1, 2],
      [1, 2, 2, 2],
      [2, 3, 1, 2],
    ],
    2,
    [1, 2],
  );
  console.log("Test3:", sol3.minTime(3)); // 1+2+1=4
})();

export {};
