// ============================================================
// 086. 祖玛游戏
// ============================================================
// LeetCode 488. Zuma Game
// 给定桌面球串 board 和手中球 hand，每次插入一个球，三个或以上连续同色球被消除。求最少插入球数。
// 时间复杂度：DFS+剪枝 状态数较多，BFS 同理

// 方法1：DFS + 记忆化 + 剪枝（推荐）
// 对每个状态 (board, hand)，尝试在所有有效位置插入每种颜色的球
// 剪枝：只在有同色球相邻的位置插入，跳过同色组中间位置避免重复
// 时间复杂度 O(状态数 * 分支数)，空间复杂度 O(状态数)
function findMinStep(board: string, hand: string): number {
  // 统计手中每种颜色的球数
  const handCount: Record<string, number> = {};
  for (const ch of hand) {
    handCount[ch] = (handCount[ch] || 0) + 1;
  }

  const memo: Map<string, number> = new Map();

  // 消除连续3个及以上的同色球（处理连锁反应）
  function eliminate(s: string): string {
    let changed: boolean = true;
    while (changed) {
      changed = false;
      let i: number = 0;
      while (i < s.length) {
        let j: number = i;
        while (j < s.length && s[j] === s[i]) {
          j++;
        }
        // 找到3个及以上连续同色球，消除并重新检查
        if (j - i >= 3) {
          s = s.slice(0, i) + s.slice(j);
          changed = true;
          break;
        }
        i = j;
      }
    }
    return s;
  }

  // 序列化手牌状态，作为记忆化 key 的一部分
  function serializeHand(h: Record<string, number>): string {
    return Object.keys(h)
      .sort()
      .map((k: string) => k + h[k])
      .join("");
  }

  // DFS：返回清空 currentBoard 所需的最少插入数
  function dfs(currentBoard: string, currentHand: Record<string, number>): number {
    // 球串已清空，无需再插入
    if (currentBoard.length === 0) return 0;

    const stateKey: string = currentBoard + "#" + serializeHand(currentHand);
    if (memo.has(stateKey)) return memo.get(stateKey)!;

    let result: number = Infinity;

    // 遍历所有可能的插入位置
    for (let i: number = 0; i <= currentBoard.length; i++) {
      // 剪枝：跳过同色组中间位置，只在组的起始位置尝试插入，避免重复
      if (i > 0 && i < currentBoard.length && currentBoard[i] === currentBoard[i - 1]) {
        continue;
      }

      // 遍历手中每种颜色的球
      for (const color in currentHand) {
        if (currentHand[color] <= 0) continue;

        // 剪枝：只在与同色球相邻的位置插入，避免无意义的插入
        const hasLeft: boolean = i > 0 && currentBoard[i - 1] === color;
        const hasRight: boolean = i < currentBoard.length && currentBoard[i] === color;
        if (!hasLeft && !hasRight) continue;

        // 插入一个球
        const newBoard: string = currentBoard.slice(0, i) + color + currentBoard.slice(i);
        const newHand: Record<string, number> = { ...currentHand };
        newHand[color]--;

        // 消除连锁反应
        const eliminated: string = eliminate(newBoard);

        // 递归求解子问题
        const subResult: number = dfs(eliminated, newHand);
        if (subResult !== -1) {
          result = Math.min(result, subResult + 1);
        }
      }
    }

    const ans: number = result === Infinity ? -1 : result;
    memo.set(stateKey, ans);
    return ans;
  }

  return dfs(board, handCount);
}

// 方法2：BFS 逐层搜索
// 从初始状态出发，每层尝试所有可能的插入操作，最先到达空串的步数即为答案
// 时间复杂度 O(状态数 * 分支数)，空间复杂度 O(状态数)
function findMinStepBFS(board: string, hand: string): number {
  // 统计手中每种颜色的球数
  const handCount: Record<string, number> = {};
  for (const ch of hand) {
    handCount[ch] = (handCount[ch] || 0) + 1;
  }

  // 消除连续3个及以上的同色球
  function eliminate(s: string): string {
    let changed: boolean = true;
    while (changed) {
      changed = false;
      let i: number = 0;
      while (i < s.length) {
        let j: number = i;
        while (j < s.length && s[j] === s[i]) {
          j++;
        }
        if (j - i >= 3) {
          s = s.slice(0, i) + s.slice(j);
          changed = true;
          break;
        }
        i = j;
      }
    }
    return s;
  }

  // 序列化手牌状态
  function serializeHand(h: Record<string, number>): string {
    return Object.keys(h)
      .sort()
      .map((k: string) => k + h[k])
      .join("");
  }

  function getStateKey(b: string, h: Record<string, number>): string {
    return b + "#" + serializeHand(h);
  }

  // 生成所有可能的下一状态
  function getNextStates(
    b: string,
    h: Record<string, number>,
  ): Array<[string, Record<string, number>]> {
    const states: Array<[string, Record<string, number>]> = [];
    for (let i: number = 0; i <= b.length; i++) {
      // 跳过同色组中间位置
      if (i > 0 && i < b.length && b[i] === b[i - 1]) continue;
      for (const color in h) {
        if (h[color] <= 0) continue;
        // 剪枝：只在与同色球相邻的位置插入
        const hasLeft: boolean = i > 0 && b[i - 1] === color;
        const hasRight: boolean = i < b.length && b[i] === color;
        if (!hasLeft && !hasRight) continue;

        const newBoard: string = b.slice(0, i) + color + b.slice(i);
        const newHand: Record<string, number> = { ...h };
        newHand[color]--;
        const eliminated: string = eliminate(newBoard);
        states.push([eliminated, newHand]);
      }
    }
    return states;
  }

  // BFS 逐层搜索，最先到达空串的步数即为最少插入数
  const visited: Set<string> = new Set();
  const queue: Array<[string, Record<string, number>, number]> = [[board, handCount, 0]];
  visited.add(getStateKey(board, handCount));

  while (queue.length > 0) {
    const current: [string, Record<string, number>, number] = queue.shift()!;
    const b: string = current[0];
    const h: Record<string, number> = current[1];
    const steps: number = current[2];

    if (b.length === 0) return steps;

    const nextStates: Array<[string, Record<string, number>]> = getNextStates(b, h);
    for (const state of nextStates) {
      const nb: string = state[0];
      const nh: Record<string, number> = state[1];
      const key: string = getStateKey(nb, nh);
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([nb, nh, steps + 1]);
      }
    }
  }

  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 086. 祖玛游戏 =====");
console.log(findMinStep("WRRBBW", "RB")); // 期望结果: -1
console.log(findMinStep("WWRRBBWW", "WRBRW")); // 期望结果: 2
console.log(findMinStep("G", "GGGGG")); // 期望结果: 2
console.log(findMinStep("RBYYBBRRB", "YRBGB")); // 期望结果: 3
console.log(findMinStepBFS("WWRRBBWW", "WRBRW")); // 期望结果: 2

export {};
