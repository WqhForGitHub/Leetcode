// ============================================================
// 020. 破解保险箱
// ============================================================
// LeetCode 753. Crack the Safe
// 保险箱 n 位密码，每位取自 0..k-1。返回能打开保险箱的最短字符串（包含所有 k^n 组合）
// 时间复杂度：O(k^n)；空间复杂度：O(k^n)
// 思路：在 de Bruijn 图上求欧拉回路（节点为 n-1 位串，边为 n 位密码）

// 方法1：Hierholzer 递归（推荐）
function crackSafe(n: number, k: number): string {
  const visited = new Set<string>();
  const result: string[] = [];
  const start = "0".repeat(n - 1);

  const dfs = (node: string): void => {
    for (let x = 0; x < k; x++) {
      const edge = node + x;
      if (!visited.has(edge)) {
        visited.add(edge);
        dfs(edge.slice(1)); // 下一节点为去掉首字符后的 n-1 位串
        result.push(String(x)); // 回溯时记录，最后逆序拼接
      }
    }
  };

  dfs(start);
  return start + result.reverse().join("");
}

// 方法2：Hierholzer 迭代（显式栈）
function crackSafeIterative(n: number, k: number): string {
  const visited = new Set<string>();
  const result: string[] = [];
  const start = "0".repeat(n - 1);

  // 栈帧：[当前节点, 进入该节点所用数字（起点为 -1）, 下一个待试数字]
  const stack: [string, number, number][] = [[start, -1, 0]];

  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    const [node, entryDigit, idx] = top;
    if (idx < k) {
      top[2] = idx + 1;
      const edge = node + idx;
      if (!visited.has(edge)) {
        visited.add(edge);
        stack.push([edge.slice(1), idx, 0]);
      }
    } else {
      stack.pop();
      if (entryDigit !== -1) result.push(String(entryDigit));
    }
  }
  return start + result.reverse().join("");
}

// 方法3：DFS 回溯（直接构造字符串，朴素法）
// 逐位尝试，利用“每个长度为 n 的窗口都需唯一”剪枝；最坏较慢但正确
function crackSafeBacktrack(n: number, k: number): string {
  if (n === 1) {
    let s = "";
    for (let i = 0; i < k; i++) s += i;
    return s;
  }
  const total = Math.pow(k, n);
  const seen = new Set<string>();
  let ans = "";

  const dfs = (cur: string): boolean => {
    if (cur.length === total + n - 1) {
      ans = cur;
      return true;
    }
    const prefix = cur.slice(cur.length - n + 1);
    for (let x = 0; x < k; x++) {
      const next = prefix + x;
      if (!seen.has(next)) {
        seen.add(next);
        if (dfs(cur + x)) return true;
        seen.delete(next);
      }
    }
    return false;
  };

  const init = "0".repeat(n);
  seen.add(init);
  dfs(init);
  return ans;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 020. 破解保险箱 =====");
console.log(crackSafe(1, 2)); // "01" 或 "10"
console.log(crackSafeIterative(1, 2)); // "01"
console.log(crackSafeBacktrack(1, 2)); // "01"
console.log(crackSafe(2, 2)); // "00110"（长度 5）
console.log(crackSafeIterative(2, 2)); // "00110"
console.log(crackSafeBacktrack(2, 2)); // "00110"
console.log(crackSafe(3, 2).length); // 10（2^3 + 3 - 1）
console.log(crackSafe(2, 3).length); // 10（3^2 + 2 - 1）

export {};
