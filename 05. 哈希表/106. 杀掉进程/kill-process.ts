// ============================================================
// 106. 杀掉进程
// ============================================================
// LeetCode 582. Kill Process
// 给定进程 pid 列表和其父进程 ppid 列表，以及一个要杀掉的进程 pid，
// 返回所有被杀掉的进程列表（包括其所有子孙进程）。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 思路：哈希表建父->子映射，BFS/DFS 遍历子树
function killProcess(pid: number[], ppid: number[], kill: number): number[] {
  // 父进程 -> 子进程列表
  const children = new Map<number, number[]>();
  for (let i = 0; i < pid.length; i++) {
    const parent = ppid[i];
    if (!children.has(parent)) {
      children.set(parent, []);
    }
    children.get(parent)!.push(pid[i]);
  }

  const result: number[] = [];
  // BFS 从 kill 开始遍历
  const queue: number[] = [kill];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    result.push(cur);
    if (children.has(cur)) {
      for (const child of children.get(cur)!) {
        queue.push(child);
      }
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 106. 杀掉进程 =====");
// 测试 1
console.log(killProcess([1, 3, 10, 5], [3, 0, 5, 3], 5)); // 期望: [5, 10]
// 测试 2
console.log(killProcess([1, 2, 3, 4, 5], [0, 1, 1, 1, 3], 1)); // 期望: [1, 2, 3, 4, 5]
// 测试 3: 杀根进程
console.log(killProcess([1], [0], 1)); // 期望: [1]

export {};
