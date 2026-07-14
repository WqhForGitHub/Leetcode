// ============================================================
// 049. 滑动谜题
// ============================================================
// LeetCode 773. Sliding Puzzle
// 给定 2x3 棋盘（0 表示空格），每次可与相邻格交换，求最少步数到达 [[1,2,3],[4,5,0]]。
// 无解返回 -1。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：BFS (推荐)
// 将棋盘序列化为字符串，BFS搜索所有可达状态。每次将0与相邻格交换。
// 时间复杂度 O(6! * 6) = O(720 * 6), 空间复杂度 O(6!)
function slidingPuzzle(board: number[][]): number {
  const target = "123450";
  // 将2x3棋盘转为一维字符串
  const start = board[0].concat(board[1]).join("");
  // 每个位置在2x3棋盘上的可交换邻居位置
  const neighbors: number[][] = [
    [1, 3], // 0
    [0, 2, 4], // 1
    [1, 5], // 2
    [0, 4], // 3
    [1, 3, 5], // 4
    [2, 4], // 5
  ];

  const visited = new Set<string>();
  const queue: { state: string; steps: number }[] = [{ state: start, steps: 0 }];
  visited.add(start);

  while (queue.length > 0) {
    const { state, steps } = queue.shift()!;
    if (state === target) return steps;

    const zero = state.indexOf("0");
    for (const nb of neighbors[zero]) {
      // 交换0与邻居
      const arr = state.split("");
      [arr[zero], arr[nb]] = [arr[nb], arr[zero]];
      const next = arr.join("");
      if (!visited.has(next)) {
        visited.add(next);
        queue.push({ state: next, steps: steps + 1 });
      }
    }
  }
  return -1;
}

// 方法2：A*搜索
// 使用曼哈顿距离作为启发式函数，优先扩展更接近目标的状态。
// 时间复杂度 O(状态数 * log 状态数), 空间复杂度 O(状态数)
function slidingPuzzleAStar(board: number[][]): number {
  const target = "123450";
  const start = board[0].concat(board[1]).join("");
  const neighbors: number[][] = [
    [1, 3],
    [0, 2, 4],
    [1, 5],
    [0, 4],
    [1, 3, 5],
    [2, 4],
  ];

  // 目标位置映射：数字 -> [row, col]
  const targetPos: Record<number, [number, number]> = {
    1: [0, 0],
    2: [0, 1],
    3: [0, 2],
    4: [1, 0],
    5: [1, 1],
    0: [1, 2],
  };

  // 曼哈顿距离启发式
  const heuristic = (state: string): number => {
    let h = 0;
    for (let i = 0; i < 6; i++) {
      const num = parseInt(state[i], 10);
      if (num === 0) continue;
      const curRow = Math.floor(i / 3);
      const curCol = i % 3;
      const [tRow, tCol] = targetPos[num];
      h += Math.abs(curRow - tRow) + Math.abs(curCol - tCol);
    }
    return h;
  };

  // 优先队列（使用数组模拟，按f值排序）
  const visited = new Set<string>();
  const pq: { state: string; g: number; f: number }[] = [
    { state: start, g: 0, f: heuristic(start) },
  ];

  while (pq.length > 0) {
    // 取f最小
    pq.sort((a, b) => a.f - b.f);
    const { state, g } = pq.shift()!;
    if (state === target) return g;
    if (visited.has(state)) continue;
    visited.add(state);

    const zero = state.indexOf("0");
    for (const nb of neighbors[zero]) {
      const arr = state.split("");
      [arr[zero], arr[nb]] = [arr[nb], arr[zero]];
      const next = arr.join("");
      if (visited.has(next)) continue;
      const ng = g + 1;
      const nf = ng + heuristic(next);
      pq.push({ state: next, g: ng, f: nf });
    }
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 滑动谜题 =====");
console.log(
  slidingPuzzle([
    [1, 2, 3],
    [4, 0, 5],
  ]),
); // 期望结果: 1
console.log(
  slidingPuzzle([
    [4, 1, 2],
    [5, 0, 3],
  ]),
); // 期望结果: 5
console.log(
  slidingPuzzleAStar([
    [1, 2, 3],
    [4, 0, 5],
  ]),
); // 期望结果: 1
console.log(
  slidingPuzzleAStar([
    [4, 1, 2],
    [5, 0, 3],
  ]),
); // 期望结果: 5

export {};
