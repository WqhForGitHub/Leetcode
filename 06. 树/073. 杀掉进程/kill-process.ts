// ============================================================
// 073. 杀掉进程
// ============================================================
// LeetCode 582. Kill Process
// 给定 n 个进程的 PID 和 PPID，以及一个要杀掉的 PID，
// 返回杀掉该进程及其所有子进程的 PID 列表。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：DFS + 哈希表（推荐）
// 用哈希表建立父进程到子进程列表的映射，DFS 递归收集所有后代
function killProcess(pid: number[], ppid: number[], kill: number): number[] {
  // 构建父进程到子进程的映射
  const childrenMap: Map<number, number[]> = new Map();
  for (let i = 0; i < pid.length; i++) {
    const parent = ppid[i];
    const child = pid[i];
    if (!childrenMap.has(parent)) {
      childrenMap.set(parent, []);
    }
    childrenMap.get(parent)!.push(child);
  }
  const result: number[] = [];
  function dfs(node: number): void {
    result.push(node);
    const children = childrenMap.get(node);
    if (children !== undefined) {
      for (const child of children) {
        dfs(child);
      }
    }
  }
  dfs(kill);
  return result;
}

// 方法2：BFS + 哈希表
// 用队列进行广度优先遍历收集所有后代
function killProcessBFS(pid: number[], ppid: number[], kill: number): number[] {
  const childrenMap: Map<number, number[]> = new Map();
  for (let i = 0; i < pid.length; i++) {
    const parent = ppid[i];
    const child = pid[i];
    if (!childrenMap.has(parent)) {
      childrenMap.set(parent, []);
    }
    childrenMap.get(parent)!.push(child);
  }
  const result: number[] = [];
  const queue: number[] = [kill];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    const children = childrenMap.get(node);
    if (children !== undefined) {
      for (const child of children) {
        queue.push(child);
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 073. 杀掉进程 =====");
// pid = [1,3,10,5], ppid = [3,0,5,3]
// 进程树:
//        3
//       / \
//      1   5
//         /
//        10
// 杀掉 5: [5, 10]
console.log("DFS 杀5:", killProcess([1, 3, 10, 5], [3, 0, 5, 3], 5)); // [5, 10]
console.log("BFS 杀5:", killProcessBFS([1, 3, 10, 5], [3, 0, 5, 3], 5)); // [5, 10]

// 杀掉 3: [3, 1, 5, 10]
console.log("DFS 杀3:", killProcess([1, 3, 10, 5], [3, 0, 5, 3], 3)); // [3, 1, 5, 10]
console.log("BFS 杀3:", killProcessBFS([1, 3, 10, 5], [3, 0, 5, 3], 3)); // [3, 1, 5, 10]

// 单进程
console.log("DFS 单进程:", killProcess([1], [0], 1)); // [1]
console.log("BFS 单进程:", killProcessBFS([1], [0], 1)); // [1]

// 杀叶子进程
console.log("DFS 杀10:", killProcess([1, 3, 10, 5], [3, 0, 5, 3], 10)); // [10]
console.log("BFS 杀10:", killProcessBFS([1, 3, 10, 5], [3, 0, 5, 3], 10)); // [10]

export {};
