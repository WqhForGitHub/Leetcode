// ============================================================
// 110. 全排列 III
// ============================================================
// 给定 n，生成 1..n 的所有排列，使得相邻元素的绝对差不超过 2。
// 按字典序排序返回。
// 时间复杂度：O(n!), 空间复杂度：O(n)

// 方法1：回溯 + used 数组（推荐）
// 逐位填充，检查相邻元素差值
// 时间复杂度 O(n!), 空间复杂度 O(n)
function permuteIII(n: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const used: boolean[] = new Array(n + 1).fill(false);

  function backtrack(): void {
    if (path.length === n) {
      result.push([...path]);
      return;
    }
    for (let i = 1; i <= n; i++) {
      if (used[i]) continue;
      // 检查相邻元素差值不超过 2
      if (path.length > 0 && Math.abs(path[path.length - 1] - i) > 2) continue;
      used[i] = true;
      path.push(i);
      backtrack();
      path.pop();
      used[i] = false;
    }
  }

  backtrack();
  return result;
}

// 方法2：回溯 + 交换法
// 通过交换生成排列，但需要额外验证相邻约束
// 时间复杂度 O(n!), 空间复杂度 O(n)
function permuteIIISwap(n: number): number[][] {
  const arr: number[] = [];
  for (let i = 1; i <= n; i++) arr.push(i);
  const result: number[][] = [];

  function isValid(a: number[]): boolean {
    for (let i = 1; i < a.length; i++) {
      if (Math.abs(a[i] - a[i - 1]) > 2) return false;
    }
    return true;
  }

  function backtrack(start: number): void {
    if (start === arr.length) {
      if (isValid(arr)) result.push([...arr]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      [arr[start], arr[i]] = [arr[i], arr[start]];
      // 剪枝：检查当前位置与前一个位置的差值
      if (start > 0 && Math.abs(arr[start] - arr[start - 1]) > 2) {
        [arr[start], arr[i]] = [arr[i], arr[start]];
        continue;
      }
      backtrack(start + 1);
      [arr[start], arr[i]] = [arr[i], arr[start]];
    }
  }

  backtrack(0);
  result.sort((a: number[], b: number[]) => {
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return a[i] - b[i];
    }
    return 0;
  });
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 110. 全排列 III =====");
console.log(permuteIII(3)); // 期望结果: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
console.log(permuteIII(4).length); // 期望结果: 排列数量
console.log("--- 方法2测试 ---");
console.log(permuteIIISwap(3)); // 期望结果: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

export {};
