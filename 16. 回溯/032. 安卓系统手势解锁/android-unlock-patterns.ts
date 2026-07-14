// ============================================================
// 032. 安卓系统手势解锁
// ============================================================
// LeetCode 351. Android Unlock Patterns
// 统计3x3网格上长度在[m,n]之间的解锁手势数量。不能跳过未访问的中间点（如1到3需要先访问2）。
// 时间复杂度：O(9!), 空间复杂度：O(9)

// 方法1：回溯+跳转规则表 (推荐)
// 使用skip表记录从i到j需要经过的中间点，回溯搜索所有合法手势
// 时间复杂度 O(9!), 空间复杂度 O(9)
function numberOfPatterns(m: number, n: number): number {
  // skip[i][j] = 从i到j需要经过的中间点，0表示不需要中间点
  const skip: number[][] = Array.from({ length: 10 }, () => Array(10).fill(0));
  skip[1][3] = skip[3][1] = 2;
  skip[1][7] = skip[7][1] = 4;
  skip[3][9] = skip[9][3] = 6;
  skip[7][9] = skip[9][7] = 8;
  skip[1][9] = skip[9][1] = 5;
  skip[3][7] = skip[7][3] = 5;
  skip[4][6] = skip[6][4] = 5;
  skip[2][8] = skip[8][2] = 5;

  const visited: boolean[] = Array(10).fill(false);
  let count: number = 0;

  // current: 当前所在点
  // length: 当前手势长度
  function backtrack(current: number, length: number): void {
    // 长度在[m,n]范围内，计数
    if (length >= m && length <= n) {
      count++;
    }
    // 达到最大长度，停止搜索
    if (length >= n) return;

    // 尝试访问每个未访问的点
    for (let next: number = 1; next <= 9; next++) {
      if (!visited[next]) {
        const mid: number = skip[current][next];
        // 如果需要经过中间点，中间点必须已访问
        if (mid === 0 || visited[mid]) {
          visited[next] = true;
          backtrack(next, length + 1);
          visited[next] = false;
        }
      }
    }
  }

  // 从每个点开始
  for (let start: number = 1; start <= 9; start++) {
    visited[start] = true;
    backtrack(start, 1);
    visited[start] = false;
  }

  return count;
}

// 方法2：对称性优化
// 利用对称性：1,3,7,9对称；2,4,6,8对称；5独立。只需计算3种情况
// 时间复杂度 O(9!)/4, 空间复杂度 O(9)
function numberOfPatterns2(m: number, n: number): number {
  const skip: number[][] = Array.from({ length: 10 }, () => Array(10).fill(0));
  skip[1][3] = skip[3][1] = 2;
  skip[1][7] = skip[7][1] = 4;
  skip[3][9] = skip[9][3] = 6;
  skip[7][9] = skip[9][7] = 8;
  skip[1][9] = skip[9][1] = 5;
  skip[3][7] = skip[7][3] = 5;
  skip[4][6] = skip[6][4] = 5;
  skip[2][8] = skip[8][2] = 5;

  const visited: boolean[] = Array(10).fill(false);

  // 返回从current开始、长度为length的合法手势数
  function backtrack(current: number, length: number): number {
    let cnt: number = 0;
    if (length >= m) cnt++;
    if (length >= n) return cnt;

    for (let next: number = 1; next <= 9; next++) {
      if (!visited[next]) {
        const mid: number = skip[current][next];
        if (mid === 0 || visited[mid]) {
          visited[next] = true;
          cnt += backtrack(next, length + 1);
          visited[next] = false;
        }
      }
    }
    return cnt;
  }

  let total: number = 0;
  // 从1开始（1,3,7,9对称，乘以4）
  visited[1] = true;
  total += 4 * backtrack(1, 1);
  visited[1] = false;
  // 从2开始（2,4,6,8对称，乘以4）
  visited[2] = true;
  total += 4 * backtrack(2, 1);
  visited[2] = false;
  // 从5开始（5独立，乘以1）
  visited[5] = true;
  total += backtrack(5, 1);
  visited[5] = false;

  return total;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 032. 安卓系统手势解锁 =====");
console.log(numberOfPatterns(1, 1)); // 期望结果: 9
console.log(numberOfPatterns(1, 2)); // 期望结果: 65
console.log(numberOfPatterns2(1, 1)); // 期望结果: 9
console.log(numberOfPatterns2(1, 2)); // 期望结果: 65

export {};
