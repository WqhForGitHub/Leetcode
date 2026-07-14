// ============================================================
// 156. 获取你好友已观看的视频
// ============================================================
// LeetCode 1311. Get Watched Videos by Your Friends
// 给定观看视频列表、好友关系图、起始 id 和层级 level，
// 返回恰好第 level 层好友观看的视频，按频次升序、频次相同按名字字典序。

// 方法1：BFS 找第 level 层好友 + 计数 + 排序（O(n + V log V)）
function watchedVideosByFriends(
  watchedVideos: string[][],
  friends: number[][],
  id: number,
  level: number,
): string[] {
  const n = friends.length;
  const visited: boolean[] = new Array(n).fill(false);
  visited[id] = true;
  let queue: number[] = [id];
  let currLevel = 0;

  // BFS 逐层扩展，直到到达目标层级
  while (currLevel < level) {
    const next: number[] = [];
    for (const u of queue) {
      for (const f of friends[u]) {
        if (!visited[f]) {
          visited[f] = true;
          next.push(f);
        }
      }
    }
    queue = next;
    currLevel++;
  }

  // 统计第 level 层好友观看的视频频次
  const freq = new Map<string, number>();
  for (const f of queue) {
    for (const v of watchedVideos[f]) {
      freq.set(v, (freq.get(v) ?? 0) + 1);
    }
  }

  // 按频次升序，频次相同按名字字典序
  return [...freq.entries()]
    .sort((a, b) => (a[1] !== b[1] ? a[1] - b[1] : a[0].localeCompare(b[0])))
    .map(([v]) => v);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 156. 获取你好友已观看的视频 =====");
// 好友图: 0-1, 0-2, 1-3, 2-3
// 第 1 层好友(从 0 出发): 1 和 2
// 1 看了 ["C"], 2 看了 ["B","C"] => B:1, C:2
const watchedVideos = [["A", "B"], ["C"], ["B", "C"], ["D"]];
const friends = [
  [1, 2],
  [0, 3],
  [0, 3],
  [1, 2],
];
console.log("level=1:", watchedVideosByFriends(watchedVideos, friends, 0, 1)); // ["B","C"]
console.log("level=2:", watchedVideosByFriends(watchedVideos, friends, 0, 2)); // ["D"]

export {};
