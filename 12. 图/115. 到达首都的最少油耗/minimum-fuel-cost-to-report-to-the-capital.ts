// 115. 到达首都的最少油耗 (LC2473)
// n 个城市组成树，0 为首都。每个城市有一代表需乘车前往首都。
// 每辆车最多坐 seats 人，城市间每条边耗油 1 升。
// 所有代表可中途换乘同一辆车。求所有代表到达首都的最少总油耗。
// 思路：DFS 从叶向根汇聚。子树 u 中需前往首都的代表数 = 子树代表和；
//       所需车辆数 = ceil(代表数 / seats)，每条父子边耗油 = 车辆数。
//       累加所有边贡献即可。

type Edge = [number, number];

class FuelCostSolution {
  private adj: number[][] = [];
  private seats = 1;
  private fuel = 0;

  /**
   * 主入口：返回所有代表到首都的最少油耗
   */
  minimumFuelCost(roads: number[][], seats: number): number {
    const n = roads.length + 1;
    this.adj = Array.from({ length: n }, () => []);
    for (const r of roads) {
      this.adj[r[0]].push(r[1]);
      this.adj[r[1]].push(r[0]);
    }
    this.seats = seats;
    this.fuel = 0;
    this.dfs(0, -1);
    return this.fuel;
  }

  /**
   * DFS 返回子树 u 中需到首都的代表数，并累加父子边的车辆耗油
   */
  private dfs(u: number, parent: number): number {
    let reps = 1;
    for (const v of this.adj[u]) {
      if (v === parent) {
        continue;
      }
      reps += this.dfs(v, u);
    }
    if (u !== 0) {
      // 向上走的车数 = ceil(reps / seats)
      this.fuel += Math.ceil(reps / this.seats);
    }
    return reps;
  }
}

// 测试
(function test(): void {
  const sol = new FuelCostSolution();
  const r1 = sol.minimumFuelCost(
    [
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    5,
  );
  console.log("Test1:", r1 === 3 ? "PASS" : "FAIL", r1);
  const r2 = sol.minimumFuelCost(
    [
      [3, 1],
      [3, 2],
      [1, 0],
      [0, 4],
      [0, 5],
      [4, 6],
    ],
    2,
  );
  console.log("Test2:", r2 === 7 ? "PASS" : "FAIL", r2);
  const r3 = sol.minimumFuelCost([], 1);
  console.log("Test3:", r3 === 0 ? "PASS" : "FAIL", r3);
})();

export {};
