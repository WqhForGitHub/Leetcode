// ============================================================
// 052. 填充特殊网格
// ============================================================
// LeetCode 3524. Fill a Special Grid
// 给定整数 n，将 0 到 4^n - 1 的整数填入 2^n × 2^n 的网格，满足：
// 将当前网格均分为 4 个大小相同的象限，按
// 右上 (Top-Right)、右下 (Bottom-Right)、左下 (Bottom-Left)、左上 (Top-Left)
// 的顺序依次填入连续整数，每个象限递归地按相同方式填充。返回该网格。
// 时间复杂度：O(4^n), 空间复杂度：O(4^n)

// 方法1：分治递归（推荐）
// 将当前 m×m 子网格（左上角为 (r,c)）分为 4 个象限，
// 按 TR、BR、BL、TL 顺序递归填充连续编号，编号通过闭包变量 val 自增分配。
function fillSpecialGrid1(n: number): number[][] {
  const size: number = 1 << n; // 2^n
  const grid: number[][] = Array.from({ length: size }, (): number[] => new Array(size).fill(0));
  let val: number = 0;
  const solve = (r: number, c: number, m: number): void => {
    if (m === 1) {
      grid[r][c] = val++;
      return;
    }
    const half: number = m >> 1; // 2^(n-1)
    solve(r, c + half, half); // 右上 Top-Right
    solve(r + half, c + half, half); // 右下 Bottom-Right
    solve(r + half, c, half); // 左下 Bottom-Left
    solve(r, c, half); // 左上 Top-Left
  };
  solve(0, 0, size);
  return grid;
}

// 方法2：位交错坐标映射（迭代）
// 对格子 (r, c)，从最高位到最低位逐层确定其所在象限编号 q（0~3），
// 由该层 r 的位 rbit 与 c 的位 cbit 查表得到：
//   (rbit,cbit)=(0,1)->0, (1,1)->1, (1,0)->2, (0,0)->3
// 即 q = ((1-cbit)<<1) | (1-(rbit^cbit))。
// 每层贡献 2 个二进制位，按从高到低拼接即得填入值。
function fillSpecialGrid2(n: number): number[][] {
  const size: number = 1 << n;
  const grid: number[][] = Array.from({ length: size }, (): number[] => new Array(size).fill(0));
  for (let r: number = 0; r < size; r++) {
    for (let c: number = 0; c < size; c++) {
      let v: number = 0;
      for (let k: number = 0; k < n; k++) {
        const rbit: number = (r >> (n - 1 - k)) & 1; // 第 k 层 r 的位
        const cbit: number = (c >> (n - 1 - k)) & 1; // 第 k 层 c 的位
        // 象限编号：TR=0, BR=1, BL=2, TL=3
        const q: number = ((1 - cbit) << 1) | (1 - (rbit ^ cbit));
        v = (v << 2) | q; // 高位拼接
      }
      grid[r][c] = v;
    }
  }
  return grid;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 052. 填充特殊网格 =====");
console.log("方法1 n=0:", JSON.stringify(fillSpecialGrid1(0))); // 期望结果: [[0]]
console.log("方法2 n=0:", JSON.stringify(fillSpecialGrid2(0))); // 期望结果: [[0]]
console.log("方法1 n=1:", JSON.stringify(fillSpecialGrid1(1))); // 期望结果: [[3,0],[2,1]]
console.log("方法2 n=1:", JSON.stringify(fillSpecialGrid2(1))); // 期望结果: [[3,0],[2,1]]
console.log("方法1 n=2:", JSON.stringify(fillSpecialGrid1(2))); // 期望结果: [[15,12,3,0],[14,13,2,1],[11,8,7,4],[10,9,6,5]]
console.log("方法2 n=2:", JSON.stringify(fillSpecialGrid2(2))); // 期望结果: [[15,12,3,0],[14,13,2,1],[11,8,7,4],[10,9,6,5]]

export {};
