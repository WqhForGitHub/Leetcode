// ============================================================
// 027. 钥匙和房间
// ============================================================
// LeetCode 841. Keys and Rooms
// rooms[i] 是房间 i 内能拿到的钥匙列表。0 号房间未锁，其余锁着。
// 判断能否进入所有房间。
// 时间复杂度：O(V+E)，空间复杂度：O(V)

// 方法1：DFS（推荐）
// 思路：从 0 号房间 DFS，标记已访问房间，最后检查是否访问了全部 n 个房间。
function canVisitAllRoomsDFS(rooms: number[][]): boolean {
  const n = rooms.length;
  const visited: boolean[] = new Array(n).fill(false);

  function dfs(u: number): void {
    visited[u] = true;
    for (const v of rooms[u]) {
      if (!visited[v]) dfs(v);
    }
  }

  dfs(0);
  return visited.every(Boolean);
}

// 方法2：BFS
// 思路：用队列从 0 开始扩散，取钥匙入队，统计访问数。
function canVisitAllRoomsBFS(rooms: number[][]): boolean {
  const n = rooms.length;
  const visited: boolean[] = new Array(n).fill(false);
  const queue: number[] = [0];
  visited[0] = true;
  let count = 1;

  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of rooms[u]) {
      if (!visited[v]) {
        visited[v] = true;
        count++;
        queue.push(v);
      }
    }
  }
  return count === n;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 027. 钥匙和房间 =====");

console.log(canVisitAllRoomsDFS([[1], [2], [3], []])); // 期望: true
console.log(canVisitAllRoomsDFS([[1, 3], [3, 0, 1], [2], [0]])); // 期望: false

console.log(canVisitAllRoomsBFS([[1], [2], [3], []])); // 期望: true
console.log(canVisitAllRoomsBFS([[1, 3], [3, 0, 1], [2], [0]])); // 期望: false

export {};
