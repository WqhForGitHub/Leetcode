// ============================================================
// 053. 将数组拆分成斐波那契序列
// ============================================================
// LeetCode 842. Split Array into Fibonacci Sequence
// 给定数字字符串，将其拆分成斐波那契式序列（任一合法解）。每个数在32位有符号整数范围内，无前导零。
// 时间复杂度：O(...), 空间复杂度：O(...)

// 方法1：回溯 (推荐)
// 依次尝试每段数字作为下一个元素，满足斐波那契递推关系即继续递归，否则回溯。
// 时间复杂度 O(n^2)（每个状态最多切n种长度，n个状态）, 空间复杂度 O(n)
function splitIntoFibonacci(num: string): number[] {
  const n = num.length;
  const result: number[] = [];
  const MAX = Math.pow(2, 31) - 1;

  const backtrack = (idx: number): boolean => {
    if (idx === n) {
      return result.length >= 3;
    }

    // 尝试以idx为起点的不同长度数字
    for (let len = 1; len <= n - idx; len++) {
      const sub = num.substring(idx, idx + len);
      // 前导零：长度>1但首字符为0不合法
      if (sub.length > 1 && sub[0] === "0") break;
      // 数字不能超过32位有符号整数上限
      const val = parseInt(sub, 10);
      if (val > MAX) break;

      if (result.length < 2) {
        // 前两个数随便选
        result.push(val);
        if (backtrack(idx + len)) return true;
        result.pop();
      } else {
        const sum = result[result.length - 1] + result[result.length - 2];
        if (val === sum) {
          result.push(val);
          if (backtrack(idx + len)) return true;
          result.pop();
        } else if (val > sum) {
          // 已经超过sum，再长只会更大，剪枝
          break;
        }
        // val < sum 时继续尝试更长的数字
      }
    }
    return false;
  };

  if (backtrack(0)) return result;
  return [];
}

// 方法2：枚举前两个数+验证
// 直接枚举前两个数的长度，然后按斐波那契规则验证剩余字符串。
// 时间复杂度 O(n^2), 空间复杂度 O(n)
function splitIntoFibonacciEnumerate(num: string): number[] {
  const n = num.length;
  const MAX = Math.pow(2, 31) - 1;

  // 验证给定前两个数后能否完整构造
  const verify = (first: number, second: number): number[] => {
    const seq: number[] = [first, second];
    let idx = String(first).length + String(second).length;
    while (idx < n) {
      const next = seq[seq.length - 1] + seq[seq.length - 2];
      if (next > MAX) return [];
      const nextStr = String(next);
      if (!num.startsWith(nextStr, idx)) return [];
      seq.push(next);
      idx += nextStr.length;
    }
    if (idx === n && seq.length >= 3) return seq;
    return [];
  };

  // 枚举第一个数结尾位置 i, 第二个数结尾位置 j
  for (let i = 1; i < n; i++) {
    const firstStr = num.substring(0, i);
    if (firstStr.length > 1 && firstStr[0] === "0") break;
    const first = parseInt(firstStr, 10);
    if (first > MAX) break;

    for (let j = i + 1; j < n; j++) {
      const secondStr = num.substring(i, j);
      if (secondStr.length > 1 && secondStr[0] === "0") break;
      const second = parseInt(secondStr, 10);
      if (second > MAX) break;

      const result = verify(first, second);
      if (result.length > 0) return result;
    }
  }
  return [];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 053. 将数组拆分成斐波那契序列 =====");
console.log(splitIntoFibonacci("11235813")); // 期望结果: [1,1,2,3,5,8,13]
console.log(splitIntoFibonacci("112358130")); // 期望结果: [] (末尾0无法满足8+13=21)
console.log(splitIntoFibonacciEnumerate("11235813")); // 期望结果: [1,1,2,3,5,8,13]
console.log(splitIntoFibonacciEnumerate("112358130")); // 期望结果: []

export {};
