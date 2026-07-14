// ============================================================
// 049. 获取你好友已观看的视频
// ============================================================
// LeetCode 1311. Get Watched Videos by Your Friends
// watchedVideos[i]，friends 邻接，id 起始，level。
// 求第 level 层好友观看的视频，按频率升序、同名升序。
// 方法：BFS 找第 level 层好友，统计视频频率排序。
// 时间复杂度：O(n + V log V)，空间复杂度：O(n + V)

// 方法1：BFS 找第 level 层好友 + 频率排序（推荐）
function watchedVideosByFriends(
  watchedVideos: string[][],
  friends: number[][],
  id: number,
  level: number,
): string[] {
  // BFS 找第 level 层好友
  const visited: boolean[] = new Array(friends.length).fill(false);
  visited[id] = true;
  let queue: number[] = [id];
  let curLevel = 0;

  while (queue.length > 0 && curLevel < level) {
    const next: number[] = [];
    for (const u of queue) {
      for (const v of friends[u]) {
        if (!visited[v]) {
          visited[v] = true;
          next.push(v);
        }
      }
    }
    queue = next;
    curLevel++;
  }

  // 统计第 level 层好友观看的视频频率
  const freq: Map<string, number> = new Map();
  for (const f of queue) {
    for (const video of watchedVideos[f]) {
      freq.set(video, (freq.get(video) ?? 0) + 1);
    }
  }

  // 按频率升序、同名升序排序
  const result = [...freq.entries()].sort((a, b) => {
    if (a[1] !== b[1]) return a[1] - b[1];
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  });
  return result.map(([video]) => video);
}

// 方法2：BFS 记录层数 + 排序（等价实现）
function watchedVideosByFriendsV2(
  watchedVideos: string[][],
  friends: number[][],
  id: number,
  level: number,
): string[] {
  const n = friends.length;
  const dist: number[] = new Array(n).fill(-1);
  dist[id] = 0;
  const queue: number[] = [id];
  while (queue.length > 0) {
    const u = queue.shift()!;
    for (const v of friends[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }

  const freq: Map<string, number> = new Map();
  for (let i = 0; i < n; i++) {
    if (dist[i] === level) {
      for (const video of watchedVideos[i]) {
        freq.set(video, (freq.get(video) ?? 0) + 1);
      }
    }
  }

  return [...freq.entries()]
    .sort((a, b) => (a[1] !== b[1] ? a[1] - b[1] : a[0].localeCompare(b[0])))
    .map(([video]) => video);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 049. 获取你好友已观看的视频 =====");
console.log(
  "BFS:",
  JSON.stringify(
    watchedVideosByFriends(
      [["A", "B"], ["C"], ["B", "C"], ["D"]],
      [
        [1, 2],
        [0, 3],
        [0, 3],
        [1, 2],
      ],
      0,
      1,
    ),
  ),
); // 期望 ["B","C"]
console.log(
  "V2:",
  JSON.stringify(
    watchedVideosByFriendsV2(
      [["A", "B"], ["C"], ["B", "C"], ["D"]],
      [
        [1, 2],
        [0, 3],
        [0, 3],
        [1, 2],
      ],
      0,
      2,
    ),
  ),
); // 期望 ["D"]
console.log(
  "BFS 同频按名:",
  JSON.stringify(
    watchedVideosByFriends(
      [
        ["x", "y"],
        ["a", "b"],
      ],
      [[1], [0]],
      0,
      1,
    ),
  ),
); // 期望 ["a","b"]

export {};
