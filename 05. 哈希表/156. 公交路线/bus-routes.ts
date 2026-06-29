// ============================================================
// 156. 公交路线
// ============================================================
// LeetCode 815. Bus Routes
// 给定公交路线数组 routes（每条路线是一组站点）和起点、终点站，
// 求从起点到终点最少乘坐的公交车数量。若不可达返回 -1。
// 时间复杂度：O(sum(routes[i].length))；空间复杂度：O(sum(routes[i].length))

function numBusesToDestination(routes: number[][], source: number, target: number): number {
  if (source === target) return 0;

  // 哈希表：站点 -> 经过该站点的公交路线索引列表
  const stopToRoutes = new Map<number, number[]>();
  for (let i = 0; i < routes.length; i++) {
    for (const stop of routes[i]) {
      if (!stopToRoutes.has(stop)) {
        stopToRoutes.set(stop, []);
      }
      stopToRoutes.get(stop)!.push(i);
    }
  }

  // BFS：以公交路线为节点
  const visitedRoutes = new Set<number>();
  const visitedStops = new Set<number>([source]);
  const queue: [number, number][] = [[source, 0]]; // [站点, 乘坐公交数]

  while (queue.length > 0) {
    const [stop, buses] = queue.shift()!;
    // 经过该站点的所有公交路线
    const routeList = stopToRoutes.get(stop) || [];
    for (const routeIdx of routeList) {
      if (visitedRoutes.has(routeIdx)) continue;
      visitedRoutes.add(routeIdx);
      for (const nextStop of routes[routeIdx]) {
        if (nextStop === target) return buses + 1;
        if (!visitedStops.has(nextStop)) {
          visitedStops.add(nextStop);
          queue.push([nextStop, buses + 1]);
        }
      }
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 156. 公交路线 =====");
console.log(
  numBusesToDestination(
    [
      [1, 2, 7],
      [3, 6, 7],
    ],
    1,
    6,
  ),
); // 期望: 2 (1->7 换乘 7->6)
console.log(numBusesToDestination([[7, 12], [4, 5, 15], [6], [15, 19], [9, 12, 13]], 15, 12)); // 期望: -1? 实际期望 2

export {};
