// ============================================================
// 075. 最多邀请的个数
// ============================================================
// LeetCode 1820. Maximum Number of Accepted Invitations
// m 个男孩、n 个女孩，invitation 矩阵 mat[i][j] = 1 表示男孩 i 可邀请女孩 j。
// 每个男孩最多邀请 1 个女孩，每个女孩最多接受 1 个男孩的邀请。求最大匹配数。
// 时间复杂度：O(m * n * (m+n))（匈牙利），空间复杂度：O(n)

// 方法1：匈牙利算法 - 二分图最大匹配（推荐）
function maximumInvitations(mat: number[][]): number {
  const m = mat.length;
  const n = mat[0].length;
  const matchGirl = new Array<number>(n).fill(-1);

  function tryKuhn(boy: number, seen: boolean[]): boolean {
    for (let girl = 0; girl < n; girl++) {
      if (mat[boy][girl] === 1 && !seen[girl]) {
        seen[girl] = true;
        if (matchGirl[girl] === -1 || tryKuhn(matchGirl[girl], seen)) {
          matchGirl[girl] = boy;
          return true;
        }
      }
    }
    return false;
  }

  let result = 0;
  for (let boy = 0; boy < m; boy++) {
    const seen = new Array<boolean>(n).fill(false);
    if (tryKuhn(boy, seen)) result++;
  }
  return result;
}

// 方法2：Hopcroft-Karp 风格（适合较大数据，此处给出基础版封装）
function maximumInvitationsHK(mat: number[][]): number {
  const m = mat.length;
  const n = mat[0].length;
  const matchBoy = new Array<number>(m).fill(-1);
  const matchGirl = new Array<number>(n).fill(-1);
  const adj: number[][] = Array.from({ length: m }, () => []);
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 1) adj[i].push(j);
    }
  }
  let result = 0;
  let improved = true;
  while (improved) {
    improved = false;
    const seen = new Array<boolean>(n).fill(false);
    for (let i = 0; i < m; i++) {
      if (matchBoy[i] === -1) {
        if (dfs(i, seen, adj, matchBoy, matchGirl)) {
          result++;
          improved = true;
        }
      }
    }
  }
  return result;
}

function dfs(
  boy: number,
  seen: boolean[],
  adj: number[][],
  matchBoy: number[],
  matchGirl: number[],
): boolean {
  for (const girl of adj[boy]) {
    if (seen[girl]) continue;
    seen[girl] = true;
    if (matchGirl[girl] === -1 || dfs(matchGirl[girl], seen, adj, matchBoy, matchGirl)) {
      matchBoy[boy] = girl;
      matchGirl[girl] = boy;
      return true;
    }
  }
  return false;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 075. 最多邀请的个数 =====");
console.log(
  maximumInvitations([
    [1, 1, 1],
    [1, 0, 0],
    [0, 1, 0],
  ]),
); // 期望 3
console.log(
  maximumInvitations([
    [1, 0, 1],
    [1, 0, 0],
  ]),
); // 期望 2
console.log(
  maximumInvitationsHK([
    [1, 1, 1],
    [1, 0, 0],
    [0, 1, 0],
  ]),
); // 期望 3

export {};
