// ============================================================
// 035. 寻找排列
// ============================================================
// LeetCode 484. Find Permutation
// 给定一个只含 'I'（递增）和 'D'（递减）的字符串，返回字典序最小的 1..n+1 排列。

// ------------------------------------------------------------
// 方法1：栈（反转 D 段）
// ------------------------------------------------------------
// 顺序压栈，遇到 'I' 时把栈中元素全部弹出（反转 D 连续段），保证字典序最小。
// 时间 O(n)，空间 O(n)。
function findPermutation(s: string): number[] {
  const result: number[] = [];
  const stack: number[] = [];
  let num = 1;
  for (const ch of s) {
    stack.push(num++);
    if (ch === "I") {
      while (stack.length > 0) result.push(stack.pop()!);
    }
  }
  stack.push(num); // 最后一个数
  while (stack.length > 0) result.push(stack.pop()!);
  return result;
}

// ------------------------------------------------------------
// 方法2：直接反转区间（O(1) 额外空间）
// ------------------------------------------------------------
function findPermutationDirect(s: string): number[] {
  const n = s.length + 1;
  const result: number[] = [];
  for (let i = 1; i <= n; i++) result.push(i);
  let i = 0;
  while (i < s.length) {
    if (s[i] === "D") {
      const start = i;
      while (i < s.length && s[i] === "D") i++;
      // 反转 [start, i] 这段
      let l = start,
        r = i;
      while (l < r) {
        [result[l], result[r]] = [result[r], result[l]];
        l++;
        r--;
      }
    } else {
      i++;
    }
  }
  return result;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1 - 栈法:", findPermutation("I"), "期望: [1,2]");
  console.log("测试2 - 栈法:", findPermutation("DI"), "期望: [2,1,3]");
  console.log("测试3 - 直接:", findPermutationDirect("DDI"), "期望: [3,2,1,4]");
}

test();

export {};
