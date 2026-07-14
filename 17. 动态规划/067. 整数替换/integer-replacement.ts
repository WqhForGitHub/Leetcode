// ============================================================
// 067. 整数替换
// ============================================================
// LeetCode 397. Integer Replacement
// 给定正整数 n，偶数可除以2，奇数可+1或-1，求变成1的最少操作数。
// 时间复杂度 O(log n)，空间复杂度 O(log n)

// 方法1：递归 + 记忆化（推荐）
// 偶数直接除以2，奇数取 min(n+1, n-1) 的最小操作数
// 时间复杂度 O(log n)，空间复杂度 O(log n)
function integerReplacement(n: number): number {
  const memo: Map<number, number> = new Map();

  function dfs(num: number): number {
    if (num === 1) return 0; // 已经是1，不需要操作
    if (memo.has(num)) return memo.get(num)!;

    let result: number;
    if (num % 2 === 0) {
      // 偶数：直接除以2
      result = 1 + dfs(num / 2);
    } else {
      // 奇数：取 +1 和 -1 的最小值
      // 注意 num+1 可能溢出，用 num-1 + 2 代替分析
      result = 1 + Math.min(dfs(num + 1), dfs(num - 1));
    }

    memo.set(num, result);
    return result;
  }

  return dfs(n);
}

// 方法2：贪心/位运算
// 奇数时看低两位决定 +1 还是 -1：
// - n == 3 或 n 的低两位是 01（即 n % 4 == 1）：选择 -1
// - n 的低两位是 11（即 n % 4 == 3 且 n != 3）：选择 +1（因为 +1 后能连续除2）
// 时间复杂度 O(log n)，空间复杂度 O(1)
function integerReplacement2(n: number): number {
  let count: number = 0;
  let num: number = n;

  while (num !== 1) {
    if (num % 2 === 0) {
      // 偶数：直接除以2
      num = Math.floor(num / 2);
    } else if (num === 3) {
      // 特殊情况：3 直接减1变成2
      num--;
    } else if (num % 4 === 1) {
      // 末尾是 ...01，减1变成 ...00 可以连续除
      num--;
    } else {
      // 末尾是 ...11，加1变成 ...00 可以连续除
      num++;
    }
    count++;
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 067. 整数替换 =====");
console.log(integerReplacement(8)); // 期望结果: 3 (8->4->2->1)
console.log(integerReplacement(7)); // 期望结果: 4 (7->8->4->2->1)
console.log(integerReplacement(4)); // 期望结果: 2 (4->2->1)
console.log(integerReplacement(100000000)); // 期望结果: 31

export {};
