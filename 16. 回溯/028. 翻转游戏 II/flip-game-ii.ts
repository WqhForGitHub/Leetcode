// ============================================================
// 028. 翻转游戏 II
// ============================================================
// LeetCode 294. Flip Game II
// 你在和朋友玩一个字符串翻转游戏，字符串只包含 '+' 和 '-'。
// 每回合可以翻转两个连续的 "++" 为 "--"。第一个无法操作的玩家输。
// 判断先手是否能保证获胜。
// 时间复杂度：O(N!)，空间复杂度：O(N)

// 方法1：回溯 + 记忆化 (推荐)
// 对每个可能的 "++" 位置进行翻转，递归判断对手是否能赢
// 先手获胜条件：存在一个翻转使得对手无法获胜（即对手必输）
// 使用记忆化缓存已计算过的字符串状态
// 时间复杂度 O(N!), 空间复杂度 O(N)
function canWin(currentState: string): boolean {
  const memo: Map<string, boolean> = new Map();

  function canWinHelper(s: string): boolean {
    // 如果已计算过，直接返回
    if (memo.has(s)) {
      return memo.get(s)!;
    }

    // 尝试每个可能的 "++" 位置
    for (let i = 0; i < s.length - 1; i++) {
      if (s[i] === "+" && s[i + 1] === "+") {
        // 翻转 "++" 为 "--"
        const flipped: string = s.substring(0, i) + "--" + s.substring(i + 2);
        // 如果对手在这种状态下无法获胜，则先手获胜
        if (!canWinHelper(flipped)) {
          memo.set(s, true);
          return true;
        }
      }
    }

    // 没有任何翻转能让对手输，先手输
    memo.set(s, false);
    return false;
  }

  return canWinHelper(currentState);
}

// 方法2：回溯（朴素）
// 不使用记忆化的纯回溯实现（适用于短字符串）
// 时间复杂度 O(N!), 空间复杂度 O(N) 递归栈
function canWin2(currentState: string): boolean {
  // 尝试每个可能的 "++" 位置
  for (let i = 0; i < currentState.length - 1; i++) {
    if (currentState[i] === "+" && currentState[i + 1] === "+") {
      // 翻转 "++" 为 "--"
      const flipped: string = currentState.substring(0, i) + "--" + currentState.substring(i + 2);
      // 如果对手在这种状态下无法获胜，则先手获胜
      if (!canWin2(flipped)) {
        return true;
      }
    }
  }

  // 没有任何翻转能让对手输，先手输
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 028. 翻转游戏 II =====");
console.log(canWin("++++")); // 期望结果: true
console.log(canWin2("++++")); // 期望结果: true
console.log(canWin("+")); // 期望结果: false
console.log(canWin2("+")); // 期望结果: false
console.log(canWin("++")); // 期望结果: true (先手翻转后对手无法操作)
console.log(canWin2("++")); // 期望结果: true
console.log(canWin("+++")); // 期望结果: false (先手翻转后对手仍有一个 "++" 可翻)
console.log(canWin2("+++")); // 期望结果: false
console.log(canWin("+++++")); // 期望结果: false
console.log(canWin2("+++++")); // 期望结果: false

export {};
