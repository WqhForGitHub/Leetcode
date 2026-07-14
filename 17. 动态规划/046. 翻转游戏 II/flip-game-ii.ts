// ============================================================
// 046. 翻转游戏 II
// ============================================================
// LeetCode 294. Flip Game II
// 给定只含 '+' 和 '-' 的字符串，两人轮流将 "++" 翻转为 "--"，不能翻转者输。判断先手是否必胜。
// 时间复杂度 O(n²)，空间复杂度 O(n)

// 方法1：记忆化递归 / DP（推荐）
// 对于每个 "++" 位置，尝试翻转后判断对手是否必败
// 如果对手必败，则当前玩家必胜
// 状态转移：canWin(s) = 存在某个 "++" 位置使得翻转后 canWin(翻转后的串) 为 false
// 时间复杂度 O(n²)，空间复杂度 O(n)
function canWin(currentState: string): boolean {
  const memo: Map<string, boolean> = new Map<string, boolean>();

  // 递归函数：判断当前玩家是否能赢
  function helper(s: string): boolean {
    if (memo.has(s)) {
      return memo.get(s)!;
    }

    const chars: string[] = s.split("");
    for (let i: number = 0; i < chars.length - 1; i++) {
      // 找到连续的 "++"，尝试翻转
      if (chars[i] === "+" && chars[i + 1] === "+") {
        // 翻转为 "--"
        chars[i] = "-";
        chars[i + 1] = "-";
        const next: string = chars.join("");
        // 如果对手在翻转后的局面必败，则当前玩家必胜
        if (!helper(next)) {
          memo.set(s, true);
          chars[i] = "+";
          chars[i + 1] = "+";
          return true;
        }
        // 回溯
        chars[i] = "+";
        chars[i + 1] = "+";
      }
    }

    // 没有任何翻转能导致对手必败，当前玩家必败
    memo.set(s, false);
    return false;
  }

  return helper(currentState);
}

// 方法2：Sprague-Grundy 定理（数学解法）
// 利用博弈论中的 SG 定理，将连续的 '+' 段长度作为独立的游戏
// 时间复杂度 O(n²)，空间复杂度 O(n)
function canWin2(currentState: string): boolean {
  // 将字符串按 '-' 分割，得到每段连续 '+' 的长度
  const segments: number[] = [];
  let count: number = 0;
  for (const ch of currentState) {
    if (ch === "+") {
      count++;
    } else {
      if (count > 0) segments.push(count);
      count = 0;
    }
  }
  if (count > 0) segments.push(count);

  // 预计算 SG 值
  const maxLen: number = Math.max(...segments, 0);
  const sg: number[] = new Array<number>(maxLen + 1).fill(0);

  for (let i: number = 2; i <= maxLen; i++) {
    const seen: Set<number> = new Set<number>();
    for (let j: number = 0; j <= i - 2; j++) {
      // 翻转位置 j, j+1 后，分成左右两段
      seen.add(sg[j] ^ sg[i - 2 - j]);
    }
    // 计算 mex（最小排除值）
    let mex: number = 0;
    while (seen.has(mex)) mex++;
    sg[i] = mex;
  }

  // 各段 SG 值异或，非零则先手必胜
  let xorSum: number = 0;
  for (const len of segments) {
    xorSum ^= sg[len];
  }

  return xorSum !== 0;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 046. 翻转游戏 II =====");
console.log(canWin("++++")); // 期望结果: true
console.log(canWin("+")); // 期望结果: false
console.log(canWin("++")); // 期望结果: true
console.log(canWin("+++")); // 期望结果: false
console.log(canWin2("++++")); // 期望结果: true

export {};
