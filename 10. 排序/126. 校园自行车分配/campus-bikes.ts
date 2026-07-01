// ============================================================
// 126. 校园自行车分配
// ============================================================
// LeetCode 1057. Campus Bikes
// 给定 workers 与 bikes 坐标，为每个工人分配一辆自行车，使总曼哈顿距离最小。
// 平局按工人下标、再按自行车下标决断。返回 result[worker] = bikeIndex。

// 方法1：生成所有 (距离, 工人, 自行车) 三元组后排序贪心（时间 O(W*B log(W*B))）
function assignBikes(workers: number[][], bikes: number[][]): number[] {
  const W = workers.length;
  const B = bikes.length;

  const pairs: Array<[number, number, number]> = []; // [dist, worker, bike]
  for (let i = 0; i < W; i++) {
    for (let j = 0; j < B; j++) {
      const dist =
        Math.abs(workers[i][0] - bikes[j][0]) +
        Math.abs(workers[i][1] - bikes[j][1]);
      pairs.push([dist, i, j]);
    }
  }
  // 按 (距离, 工人下标, 自行车型下标) 升序
  pairs.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);

  const result = new Array<number>(W).fill(-1);
  const bikeUsed = new Array<boolean>(B).fill(false);
  let assigned = 0;
  for (const [, w, bk] of pairs) {
    if (result[w] === -1 && !bikeUsed[bk]) {
      result[w] = bk;
      bikeUsed[bk] = true;
      assigned++;
      if (assigned === W) break;
    }
  }
  return result;
}

// 方法2：按距离分桶（时间 O(W*B + D)，D 为最大曼哈顿距离 2000）
// 坐标范围 0..1000，距离 0..2000。生成时工人为外层、自行车为内层，
// 同一桶内天然按 (worker, bike) 有序，省去排序。
function assignBikes2(workers: number[][], bikes: number[][]): number[] {
  const W = workers.length;
  const B = bikes.length;
  const MAX_D = 2001;
  const buckets: Array<Array<[number, number]>> = Array.from(
    { length: MAX_D },
    () => []
  );

  for (let i = 0; i < W; i++) {
    for (let j = 0; j < B; j++) {
      const d =
        Math.abs(workers[i][0] - bikes[j][0]) +
        Math.abs(workers[i][1] - bikes[j][1]);
      buckets[d].push([i, j]);
    }
  }

  const result = new Array<number>(W).fill(-1);
  const bikeUsed = new Array<boolean>(B).fill(false);
  let assigned = 0;
  for (let d = 0; d < MAX_D && assigned < W; d++) {
    for (const [w, bk] of buckets[d]) {
      if (result[w] === -1 && !bikeUsed[bk]) {
        result[w] = bk;
        bikeUsed[bk] = true;
        assigned++;
        if (assigned === W) break;
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 126. 校园自行车分配 =====");
console.log("方法1:", assignBikes([[0, 0], [2, 1]], [[1, 2], [3, 3]])); // 期望: [1,0]
console.log(
  "方法1:",
  assignBikes([[0, 0], [1, 1], [2, 0]], [[1, 0], [2, 2], [2, 1]])
); // 期望: [0,2,1]
console.log("方法2:", assignBikes2([[0, 0], [2, 1]], [[1, 2], [3, 3]])); // 期望: [1,0]
console.log(
  "方法2:",
  assignBikes2([[0, 0], [1, 1], [2, 0]], [[1, 0], [2, 2], [2, 1]])
); // 期望: [0,2,1]

export {};
