// ============================================================
// 030. 累加数
// ============================================================
// LeetCode 306. Additive Number
// 判断一个字符串是否是累加数：至少包含3个数字，从第3个数字开始，每个数字是前两个数字之和。
// 不能有前导零（除非数字本身就是"0"）。使用BigInt处理大数。
// 时间复杂度：O(n^3), 空间复杂度：O(n)

// 方法1：回溯 (推荐)
// 从左到右逐个构建数字，回溯搜索所有可能的分割方案
// 时间复杂度 O(n^3), 空间复杂度 O(n)
function isAdditiveNumber(num: string): boolean {
  const n: number = num.length;
  if (n < 3) return false;

  const path: bigint[] = [];

  // start: 当前开始位置
  function backtrack(start: number): boolean {
    // 所有字符都用完，检查是否有至少3个数字
    if (start === n) {
      return path.length >= 3;
    }

    // 尝试不同长度的数字
    for (let end: number = start + 1; end <= n; end++) {
      // 前导零检查：如果以0开头且长度大于1，不合法
      if (num[start] === "0" && end > start + 1) break;

      const cur: bigint = BigInt(num.substring(start, end));

      // 如果已有两个数字，检查是否满足累加条件
      if (path.length >= 2) {
        const sum: bigint = path[path.length - 1] + path[path.length - 2];
        if (cur < sum) continue; // 当前数太小，继续增加长度
        if (cur > sum) break; // 当前数太大，不可能满足，直接跳出
      }

      // 当前数满足条件（或还没两个数），加入路径
      path.push(cur);
      if (backtrack(end)) return true;
      path.pop();
    }
    return false;
  }

  return backtrack(0);
}

// 方法2：枚举前两个数+验证
// 枚举前两个数的位置，然后线性验证剩余部分是否满足累加条件
// 时间复杂度 O(n^3), 空间复杂度 O(n)
function isAdditiveNumber2(num: string): boolean {
  const n: number = num.length;
  if (n < 3) return false;

  // 验证从num1、num2开始的序列是否是累加数
  function verify(num1Str: string, num2Str: string): boolean {
    let a: bigint = BigInt(num1Str);
    let b: bigint = BigInt(num2Str);
    let pos: number = num1Str.length + num2Str.length;

    while (pos < n) {
      const sum: bigint = a + b;
      const sumStr: string = sum.toString();
      if (!num.startsWith(sumStr, pos)) return false;
      pos += sumStr.length;
      a = b;
      b = sum;
    }
    return pos === n;
  }

  // 枚举第一个数的长度i和第二个数的长度j
  for (let i: number = 1; i <= Math.floor(n / 2); i++) {
    // 前导零检查
    if (i > 1 && num[0] === "0") break;
    for (let j: number = 1; j <= Math.floor((n - i) / 2); j++) {
      // 前导零检查
      if (j > 1 && num[i] === "0") break;
      const num1: string = num.substring(0, i);
      const num2: string = num.substring(i, i + j);
      if (verify(num1, num2)) return true;
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 030. 累加数 =====");
console.log(isAdditiveNumber("112358")); // 期望结果: true
console.log(isAdditiveNumber("199100199")); // 期望结果: true
console.log(isAdditiveNumber("1023")); // 期望结果: false
console.log(isAdditiveNumber2("112358")); // 期望结果: true
console.log(isAdditiveNumber2("199100199")); // 期望结果: true
console.log(isAdditiveNumber2("1023")); // 期望结果: false

export {};
