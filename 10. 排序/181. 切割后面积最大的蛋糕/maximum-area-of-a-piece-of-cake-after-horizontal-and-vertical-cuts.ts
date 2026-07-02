// ============================================================
// 181. 切割后面积最大的蛋糕
// ============================================================
// LeetCode 1465. Maximum Area of a Piece of Cake After Horizontal and Vertical Cuts
// 给定蛋糕尺寸 h x w，以及若干水平切和垂直切位置。
// 切完后所有切口，求最大块面积 mod 1e9+7。

// 方法1：排序切点 + 找最大间隔（O(H log H + V log V)）
// 排序后比较相邻切口间距，加上边界距离，取最大水平/垂直间距相乘。
function maxArea(h: number, w: number, horizontalCuts: number[], verticalCuts: number[]): number {
  const MOD = 1e9 + 7;
  horizontalCuts.sort((a, b) => a - b);
  verticalCuts.sort((a, b) => a - b);
  let maxH = Math.max(horizontalCuts[0], h - horizontalCuts[horizontalCuts.length - 1]);
  for (let i = 1; i < horizontalCuts.length; i++) {
    maxH = Math.max(maxH, horizontalCuts[i] - horizontalCuts[i - 1]);
  }
  let maxW = Math.max(verticalCuts[0], w - verticalCuts[verticalCuts.length - 1]);
  for (let i = 1; i < verticalCuts.length; i++) {
    maxW = Math.max(maxW, verticalCuts[i] - verticalCuts[i - 1]);
  }
  return Number((BigInt(maxH) * BigInt(maxW)) % BigInt(MOD));
}

// 方法2：排序 + 统一处理边界（O(H log H + V log V)）
// 把 0 和 h/w 也加入切点数组，统一求相邻差最大值。
function maxArea2(h: number, w: number, horizontalCuts: number[], verticalCuts: number[]): number {
  const MOD = 1e9 + 7;
  const allH = [0, ...horizontalCuts, h].sort((a, b) => a - b);
  const allV = [0, ...verticalCuts, w].sort((a, b) => a - b);
  let maxH = 0;
  for (let i = 1; i < allH.length; i++) {
    maxH = Math.max(maxH, allH[i] - allH[i - 1]);
  }
  let maxW = 0;
  for (let i = 1; i < allV.length; i++) {
    maxW = Math.max(maxW, allV[i] - allV[i - 1]);
  }
  return Number((BigInt(maxH) * BigInt(maxW)) % BigInt(MOD));
}

// ============================================================
// 测试
// ============================================================
console.log("===== 181. 切割后面积最大的蛋糕 =====");
console.log("方法1 h=5 w=4 hC=[1,2,4] vC=[1,3]:", maxArea(5, 4, [1, 2, 4], [1, 3])); // 4
console.log("方法1 h=5 w=4 hC=[3,1] vC=[1]:", maxArea(5, 4, [3, 1], [1])); // 6
console.log("方法1 h=5 w=4 hC=[3] vC=[3]:", maxArea(5, 4, [3], [3])); // 9
console.log("方法2 h=5 w=4 hC=[1,2,4] vC=[1,3]:", maxArea2(5, 4, [1, 2, 4], [1, 3])); // 4
console.log("方法2 h=5 w=4 hC=[3,1] vC=[1]:", maxArea2(5, 4, [3, 1], [1])); // 6
console.log("方法2 h=5 w=4 hC=[3] vC=[3]:", maxArea2(5, 4, [3], [3])); // 9

export {};
