// ============================================================
// 036. 祖玛游戏
// ============================================================
// LeetCode 488. Zuma Game
// 你有一颗球的发射器和一串彩色球序列 board，手上有一串 hand 的球，
// 每次插入一颗球使出现连续 3+ 同色时消除。求最少插入球数使 board 全部消除，否则 -1。

// ------------------------------------------------------------
// 方法1：DFS + 剪枝（栈模拟消除）
// ------------------------------------------------------------
// 用哈希表记录手牌数量，DFS 枚举插入位置和颜色。插入后用 shrink 函数模拟连续消除。
// 时间指数级（搜索），空间 O(n)。
function findMinStep(board: string, hand: string): number {
  const handCount: Record<string, number> = {};
  for (const ch of hand) handCount[ch] = (handCount[ch] || 0) + 1;

  const memo = new Map<string, number>();

  function dfs(b: string, h: Record<string, number>): number {
    if (b.length === 0) return 0;
    const key = b + '#' + JSON.stringify(h);
    if (memo.has(key)) return memo.get(key)!;

    let res = Infinity;
    let i = 0;
    while (i < b.length) {
      let j = i;
      while (j < b.length && b[j] === b[i]) j++;
      const need = 3 - (j - i); // 还需插入几颗同色球
      const color = b[i];
      if ((h[color] || 0) >= need) {
        // 尝试在此处插入 need 颗 color
        h[color] -= need;
        const newBoard = shrink(b.slice(0, i) + b.slice(j));
        const sub = dfs(newBoard, h);
        if (sub !== -1) res = Math.min(res, need + sub);
        h[color] += need;
      }
      i = j;
    }

    const ans = res === Infinity ? -1 : res;
    memo.set(key, ans);
    return ans;
  }

  // 模拟连续消除
  function shrink(s: string): string {
    let changed = true;
    while (changed) {
      changed = false;
      let i = 0;
      let result = '';
      while (i < s.length) {
        let j = i;
        while (j < s.length && s[j] === s[i]) j++;
        if (j - i >= 3) {
          changed = true;
        } else {
          result += s.slice(i, j);
        }
        i = j;
      }
      s = result;
    }
    return s;
  }

  return dfs(board, handCount);
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', findMinStep('WRRBBW', 'RB'), '期望: -1');
  console.log('测试2:', findMinStep('WWRRBBWW', 'WRBRW'), '期望: 2');
  console.log('测试3:', findMinStep('G', 'GGGGG'), '期望: 2');
  console.log('测试4:', findMinStep('RBYYBBRRB', 'YRBGB'), '期望: 3');
}

test();

export {};
