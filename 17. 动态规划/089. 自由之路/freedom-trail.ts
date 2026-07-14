// ============================================================
// 089. 自由之路
// ============================================================
// LeetCode 514. Freedom Trail
// 给定圆环上的字符 ring 和钥匙 key，指针初始在12点位置，每次可顺/逆时针转到相邻位置，转到对应字符按按钮。求最少步数。
// 时间复杂度：O(n * m^2)

// 方法1：动态规划（推荐）
// dp[i][j] = 匹配完 key[0..i-1] 后，指针停在 ring[j] 的最少步数
// 状态转移：dp[i+1][pos] = min(dp[i][j] + rotate(j, pos) + 1)
// 其中 rotate(j, pos) = min(|j-pos|, n-|j-pos|) 为圆环上两点间最短旋转步数
// 时间复杂度 O(n * m^2)，空间复杂度 O(n * m)
function findRotateSteps(ring: string, key: string): number {
  const n: number = ring.length;
  const m: number = key.length;

  // 记录每个字符在 ring 中的所有出现位置
  const charPositions: Map<string, number[]> = new Map();
  for (let i: number = 0; i < n; i++) {
    if (!charPositions.has(ring[i])) {
      charPositions.set(ring[i], []);
    }
    charPositions.get(ring[i])!.push(i);
  }

  // dp[i][j] = 匹配完 key[0..i-1]，指针在 ring[j] 的最少步数
  const dp: number[][] = new Array(m + 1);
  for (let i: number = 0; i <= m; i++) {
    dp[i] = new Array(n).fill(Infinity);
  }
  dp[0][0] = 0; // 初始状态：指针在 12 点（ring 的位置 0），已匹配 0 个字符

  // 逐个匹配 key 的每个字符
  for (let i: number = 0; i < m; i++) {
    const targetChar: string = key[i];
    const positions: number[] = charPositions.get(targetChar) || [];

    // 遍历目标字符在 ring 中的所有出现位置
    for (const pos of positions) {
      // 从所有可能的前一个指针位置 j 转移过来
      for (let j: number = 0; j < n; j++) {
        if (dp[i][j] === Infinity) continue;

        // 从位置 j 旋转到位置 pos 的最短步数（顺时针或逆时针取较小值）
        const diff: number = Math.abs(j - pos);
        const rotateSteps: number = Math.min(diff, n - diff);

        // 旋转步数 + 1 步按按钮
        dp[i + 1][pos] = Math.min(dp[i + 1][pos], dp[i][j] + rotateSteps + 1);
      }
    }
  }

  // 匹配完所有字符后的最小步数
  let result: number = Infinity;
  for (let j: number = 0; j < n; j++) {
    result = Math.min(result, dp[m][j]);
  }
  return result;
}

// 方法2：DFS + 记忆化
// dfs(keyIndex, ringPos) = 从匹配 key[keyIndex] 开始，指针在 ringPos 的最少剩余步数
// 对每个目标字符的所有出现位置，计算旋转步数并递归
// 时间复杂度 O(n * m^2)，空间复杂度 O(n * m)
function findRotateStepsDFS(ring: string, key: string): number {
  const n: number = ring.length;
  const m: number = key.length;

  // 记录每个字符在 ring 中的所有出现位置
  const charPositions: Map<string, number[]> = new Map();
  for (let i: number = 0; i < n; i++) {
    if (!charPositions.has(ring[i])) {
      charPositions.set(ring[i], []);
    }
    charPositions.get(ring[i])!.push(i);
  }

  const memo: Map<string, number> = new Map();

  function dfs(keyIndex: number, ringPos: number): number {
    // 所有字符都已匹配完毕，无需更多步数
    if (keyIndex === m) return 0;

    const stateKey: string = keyIndex + "," + ringPos;
    if (memo.has(stateKey)) return memo.get(stateKey)!;

    const targetChar: string = key[keyIndex];
    const positions: number[] = charPositions.get(targetChar) || [];

    let result: number = Infinity;
    // 遍历目标字符的所有出现位置
    for (const pos of positions) {
      // 从 ringPos 旋转到 pos 的最短步数
      const diff: number = Math.abs(ringPos - pos);
      const rotateSteps: number = Math.min(diff, n - diff);

      // 旋转步数 + 1 步按按钮 + 递归匹配剩余字符
      const totalSteps: number = rotateSteps + 1 + dfs(keyIndex + 1, pos);
      result = Math.min(result, totalSteps);
    }

    memo.set(stateKey, result);
    return result;
  }

  return dfs(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 089. 自由之路 =====");
console.log(findRotateSteps("godding", "gd")); // 期望结果: 4
console.log(findRotateSteps("godding", "godding")); // 期望结果: 13
console.log(findRotateStepsDFS("godding", "gd")); // 期望结果: 4
console.log(findRotateSteps("ab", "ba")); // 期望结果: 4
console.log(findRotateSteps("abc", "abc")); // 期望结果: 5

export {};
