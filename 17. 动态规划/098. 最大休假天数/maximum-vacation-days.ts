// ============================================================
// 098. 最大休假天数
// ============================================================
// LeetCode 568. Maximum Vacation Days
// n 个城市，每周可飞到另一个城市（若通航），
// days[city][week] 表示在 city 度过第 week 周的休假天数。
// 求从城市0出发 k 周内最大休假天数。
// 时间复杂度：O(n^2 * k)，空间复杂度：O(n)

// 方法1：DP（推荐）
// dp[city] 表示当前周在城市 city 的最大休假天数
// 时间复杂度 O(n^2 * k)，空间复杂度 O(n)
function maxVacationDays(flights: number[][], days: number[][]): number {
  const n: number = flights.length; // 城市数
  if (n === 0) return 0;
  const k: number = days[0].length; // 周数

  // dp[city] 表示当前周在城市 city 的最大休假天数
  // 初始化为 -1 表示不可达
  let dp: number[] = new Array(n).fill(-1);
  dp[0] = 0; // 从城市0出发

  for (let week: number = 0; week < k; week++) {
    const nextDp: number[] = new Array(n).fill(-1);

    for (let city: number = 0; city < n; city++) {
      if (dp[city] < 0) continue; // 不可达

      for (let nextCity: number = 0; nextCity < n; nextCity++) {
        // 可以留在当前城市或飞到通航的城市
        if (city === nextCity || flights[city][nextCity] === 1) {
          nextDp[nextCity] = Math.max(nextDp[nextCity], dp[city] + days[nextCity][week]);
        }
      }
    }

    dp = nextDp;
  }

  return Math.max(...dp);
}

// 方法2：DFS + 记忆化
// dfs(city, week) 表示从第 week 周在城市 city 出发的最大休假天数
// 时间复杂度 O(n^2 * k)，空间复杂度 O(n * k)
function maxVacationDaysDFS(flights: number[][], days: number[][]): number {
  const n: number = flights.length;
  const k: number = days[0].length;
  const memo: number[][] = [];
  for (let i: number = 0; i < n; i++) {
    memo.push(new Array(k).fill(-1));
  }

  const dfs = (city: number, week: number): number => {
    // 所有周都过完了
    if (week === k) return 0;
    if (memo[city][week] !== -1) return memo[city][week];

    let result: number = 0;
    for (let nextCity: number = 0; nextCity < n; nextCity++) {
      if (city === nextCity || flights[city][nextCity] === 1) {
        result = Math.max(result, days[nextCity][week] + dfs(nextCity, week + 1));
      }
    }

    memo[city][week] = result;
    return result;
  };

  return dfs(0, 0);
}

// ============================================================
// 测试
// ============================================================
console.log("===== 098. 最大休假天数 =====");
console.log(
  maxVacationDays(
    [
      [1, 1],
      [0, 0],
    ],
    [
      [1, 3],
      [2, 1],
    ],
  ),
); // 期望结果: 4
console.log(
  maxVacationDays(
    [
      [1, 0],
      [0, 1],
    ],
    [
      [3, 2],
      [1, 2],
    ],
  ),
); // 期望结果: 4
console.log(
  maxVacationDays(
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 3],
      [2, 1],
    ],
  ),
); // 期望结果: 5
console.log("--- 方法2测试 ---");
console.log(
  maxVacationDaysDFS(
    [
      [1, 1],
      [0, 0],
    ],
    [
      [1, 3],
      [2, 1],
    ],
  ),
); // 期望结果: 4
console.log(
  maxVacationDaysDFS(
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 3],
      [2, 1],
    ],
  ),
); // 期望结果: 5

export {};
