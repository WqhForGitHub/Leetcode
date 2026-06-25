// ============================================================
// 030. 移掉 K 位数字
// ============================================================
// LeetCode 402. Remove K Digits
// 给定一个以字符串表示的非负整数 num，移除其中 k 位数字，使剩下的数字最小。

// ------------------------------------------------------------
// 方法1：单调栈（贪心）
// ------------------------------------------------------------
// 维护单调递增栈，当当前数字比栈顶小且还能删除时，弹出栈顶。
// 时间 O(n)，空间 O(n)。
function removeKdigits(num: string, k: number): string {
  const stack: string[] = [];
  for (const ch of num) {
    while (k > 0 && stack.length > 0 && stack[stack.length - 1] > ch) {
      stack.pop();
      k--;
    }
    stack.push(ch);
  }
  // 若 k 还没用完，从末尾删除
  while (k > 0) {
    stack.pop();
    k--;
  }
  // 去除前导零
  let result = stack.join('').replace(/^0+/, '');
  return result === '' ? '0' : result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log('测试1:', removeKdigits('1432219', 3), '期望: 1219');
  console.log('测试2:', removeKdigits('10200', 1), '期望: 200');
  console.log('测试3:', removeKdigits('10', 2), '期望: 0');
  console.log('测试4:', removeKdigits('9', 1), '期望: 0');
}

test();

export {};
