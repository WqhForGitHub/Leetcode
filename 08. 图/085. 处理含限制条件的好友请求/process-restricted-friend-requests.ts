// ============================================================
// 085. 处理含限制条件的好友请求
// ============================================================
// LeetCode 2076. Process Restricted Friend Requests
// restrictions 中两人不能同组，requests 依次合并两人所在组，
// 若合并会违反限制则拒绝。带限制检查的并查集。
// 时间复杂度：O((R + Q) * n * α(n))，空间复杂度：O(n)

function friendRequests(n: number, restrictions: number[][], requests: number[][]): boolean[] {
  // 并查集
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const ans: boolean[] = [];
  for (const [u, v] of requests) {
    const ru: number = find(u);
    const rv: number = find(v);
    if (ru === rv) {
      ans.push(true);
      continue;
    }
    // 检查合并是否违反限制
    let ok: boolean = true;
    for (const [x, y] of restrictions) {
      const rx: number = find(x);
      const ry: number = find(y);
      if ((rx === ru && ry === rv) || (rx === rv && ry === ru)) {
        ok = false;
        break;
      }
    }
    if (ok) {
      parent[ru] = rv;
      ans.push(true);
    } else {
      ans.push(false);
    }
  }
  return ans;
}

// 方法1：并查集 + 限制检查
function f1(n: number, restrictions: number[][], requests: number[][]): boolean[] {
  return friendRequests(n, restrictions, requests);
}

// 方法2：并查集，合并前用集合缓存限制（路径压缩更激进）
function f2(n: number, restrictions: number[][], requests: number[][]): boolean[] {
  const parent: number[] = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const ans: boolean[] = [];
  for (const [u, v] of requests) {
    const ru: number = find(u);
    const rv: number = find(v);
    if (ru === rv) {
      ans.push(true);
      continue;
    }
    let ok: boolean = true;
    for (const [x, y] of restrictions) {
      const rx: number = find(x);
      const ry: number = find(y);
      if ((rx === ru && ry === rv) || (rx === rv && ry === ru)) {
        ok = false;
        break;
      }
    }
    if (ok) {
      parent[ru] = rv;
      ans.push(true);
    } else {
      ans.push(false);
    }
  }
  return ans;
}

console.log("===== 085. 处理含限制条件的好友请求 =====");
// 测试
console.log(
  f1(
    3,
    [[0, 1]],
    [
      [0, 2],
      [2, 1],
    ],
  ),
); // [true, false]
console.log(
  f2(
    3,
    [[0, 1]],
    [
      [0, 2],
      [2, 1],
    ],
  ),
); // [true, false]
console.log(
  f1(
    5,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    [
      [0, 4],
      [1, 2],
      [3, 1],
      [3, 4],
    ],
  ),
); // [true,false,true,false] 之一
console.log(
  f2(
    5,
    [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    [
      [0, 4],
      [1, 2],
      [3, 1],
      [3, 4],
    ],
  ),
);

export {};
