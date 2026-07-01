// 190. 志愿者调配
// 自定义题：n 地点图，每地点需若干志愿者；相邻地点的志愿者可互相覆盖（闭邻域覆盖）。
//       求满足所有需求的最小总志愿者数。
// 思路：二分答案 + 贪心。二分总数 T，判定能否分配 x[i]>=0, sum x=T，
//       使得对每个 i：x[i] + sum_{j in N(i)} x[j] >= need[i]。
//       贪心判定：按需求降序处理，对不足节点把差额补到自身（同时惠及邻居），统计总额 <= T。

class VolunteerAllocation {
  private n: number;
  private adj: number[][];
  private need: number[];

  constructor(n: number, edges: [number, number][], need: number[]) {
    this.n = n;
    this.need = need;
    this.adj = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      this.adj[u].push(v);
      this.adj[v].push(u);
    }
  }

  // 主方法：返回满足所有需求的最小总志愿者数
  public minTotal(): number {
    let lo = 0;
    let hi = this.need.reduce((s, x) => s + x, 0);
    // 单点覆盖自身闭邻域，上界取 sum(need) 必然可行（每点放 need[i]）
    let ans = hi;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (this.canSatisfy(mid)) {
        ans = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }
    return ans;
  }

  // 辅助方法：贪心判定总数 T 是否可行
  private canSatisfy(T: number): boolean {
    const n = this.n;
    const x = new Array<number>(n).fill(0);
    // 闭邻域覆盖值 = 自身 + 邻居
    const cover = (i: number): number => {
      let s = x[i];
      for (const j of this.adj[i]) s += x[j];
      return s;
    };
    // 按需求降序处理
    const order = Array.from({ length: n }, (_, i) => i).sort(
      (a, b) => this.need[b] - this.need[a],
    );
    let used = 0;
    for (const i of order) {
      const cur = cover(i);
      if (cur >= this.need[i]) continue;
      const add = this.need[i] - cur;
      x[i] += add;
      used += add;
      if (used > T) return false;
    }
    return used <= T;
  }
}

// 测试
(() => {
  // 样例：3 节点链 0-1-2, need=[1,2,1]
  // 在 1 放 2 可覆盖全部（闭邻域 1 覆盖 0,1,2），但 need[0]=1,need[2]=1 已满足
  // 实际 x[1]=2 覆盖 0(2>=1)1(2>=2)2(2>=1) -> 总 2
  const sol1 = new VolunteerAllocation(
    3,
    [
      [0, 1],
      [1, 2],
    ],
    [1, 2, 1],
  );
  console.log("Test1:", sol1.minTotal()); // 2

  // 样例：孤立点 need=[3]，无邻边，需 3
  const sol2 = new VolunteerAllocation(1, [], [3]);
  console.log("Test2:", sol2.minTotal()); // 3

  // 样例：完全图 0-1-2-0, need=[2,2,2]，中心放任一点 2 覆盖不全
  // 但 0 放 2 覆盖 0,1,2 各得 2，满足 -> 2
  const sol3 = new VolunteerAllocation(
    3,
    [
      [0, 1],
      [1, 2],
      [0, 2],
    ],
    [2, 2, 2],
  );
  console.log("Test3:", sol3.minTotal()); // 2
})();

export {};
