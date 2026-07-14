// 189. 电动车游城市
// 自定义题：n 城市图 edges 带距，电动车电量上限 capacity，充电桩位置，
//       从 start 到 end 的最少充电次数（电量按距离消耗）。
// 思路：Dijkstra，状态 = (城市, 当前电量)，键值 = 充电次数。
//       驾驶：电量 >= 距离则电量减距离，次数不变；充电桩城市可充满，次数 +1。
//       0-1 BFS / 优先队列按 (次数, 电量) 取优。

interface Edge189 {
  to: number;
  dist: number;
}

interface State189 {
  node: number;
  battery: number;
  charges: number;
}

class MinHeap189 {
  private data: State189[] = [];
  public size(): number {
    return this.data.length;
  }
  private less(a: State189, b: State189): boolean {
    if (a.charges !== b.charges) return a.charges < b.charges;
    return a.battery > b.battery; // 同次数电量越大越优
  }
  public push(x: State189): void {
    this.data.push(x);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.less(this.data[p], this.data[i])) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  public pop(): State189 | undefined {
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
        if (l < n && this.less(this.data[l], this.data[s])) s = l;
        if (r < n && this.less(this.data[r], this.data[s])) s = r;
        if (s === i) break;
        [this.data[s], this.data[i]] = [this.data[i], this.data[s]];
        i = s;
      }
    }
    return top;
  }
}

class ElectricCarTourCities {
  private n: number;
  private adj: Edge189[][];
  private capacity: number;
  private charger: boolean[];

  constructor(n: number, edges: [number, number, number][], capacity: number, chargers: number[]) {
    this.n = n;
    this.capacity = capacity;
    this.adj = Array.from({ length: n }, () => []);
    for (const [u, v, d] of edges) {
      this.adj[u].push({ to: v, dist: d });
      this.adj[v].push({ to: u, dist: d });
    }
    this.charger = new Array(n).fill(false);
    for (const c of chargers) this.charger[c] = true;
  }

  // 主方法：从 start 到 end 的最少充电次数；不可达返回 -1
  public minCharges(start: number, end: number): number {
    const heap = new MinHeap189();
    const best = Array.from({ length: this.n }, () => new Map<number, number>());
    heap.push({ node: start, battery: this.capacity, charges: 0 });
    best[start].set(this.capacity, 0);

    while (heap.size() > 0) {
      const cur = heap.pop()!;
      if (cur.node === end) return cur.charges;
      const prev = best[cur.node].get(cur.battery);
      if (prev === undefined || cur.charges > prev) continue;

      // 充电桩：充满
      if (this.charger[cur.node] && cur.battery < this.capacity) {
        const nb = this.capacity;
        const nc = cur.charges + 1;
        const p = best[cur.node].get(nb);
        if (p === undefined || nc < p) {
          best[cur.node].set(nb, nc);
          heap.push({ node: cur.node, battery: nb, charges: nc });
        }
      }

      // 驾驶
      for (const e of this.adj[cur.node]) {
        if (cur.battery < e.dist) continue;
        const v = e.to;
        const nb = cur.battery - e.dist;
        const nc = cur.charges;
        const p = best[v].get(nb);
        if (p === undefined || nc < p) {
          best[v].set(nb, nc);
          heap.push({ node: v, battery: nb, charges: nc });
        }
      }
    }
    return -1;
  }

  // 辅助方法：是否为充电桩城市
  public hasCharger(node: number): boolean {
    return this.charger[node];
  }
}

// 测试
(() => {
  // 样例：0-1(10)-2(10)-3(10)，容量 20，充电桩 [1]，start 0 end 3
  // 0(20)->1(10) 充电 ->2(20)->3(10)，充电 1 次
  const sol1 = new ElectricCarTourCities(
    4,
    [
      [0, 1, 10],
      [1, 2, 10],
      [2, 3, 10],
    ],
    20,
    [1],
  );
  console.log("Test1:", sol1.minCharges(0, 3)); // 1

  // 样例：容量足够直达，0 次
  const sol2 = new ElectricCarTourCities(
    3,
    [
      [0, 1, 5],
      [1, 2, 5],
    ],
    20,
    [],
  );
  console.log("Test2:", sol2.minCharges(0, 2)); // 0

  // 样例：电量不足以跨过最长边且无充电桩 -> -1
  const sol3 = new ElectricCarTourCities(
    3,
    [
      [0, 1, 5],
      [1, 2, 30],
    ],
    20,
    [],
  );
  console.log("Test3:", sol3.minCharges(0, 2)); // -1
})();

export {};
