// ============================================================
// 096. 最优除法
// ============================================================
// LeetCode 553. Optimal Division
// 给定正整数数组，nums[0]/nums[1]/.../nums[n-1]，
// 通过加括号使结果最大。返回加括号的字符串。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：数学（推荐）
// a/b/c/d... 最大值为 a/(b*c*d*...)
// 即在第二个数前面加左括号，最后一个数后面加右括号
// 时间复杂度 O(n)，空间复杂度 O(1)
function optimalDivision(nums: number[]): string {
  const n: number = nums.length;
  if (n === 1) return String(nums[0]);
  if (n === 2) return nums[0] + "/" + nums[1];

  // 将 nums[0] / (nums[1] / nums[2] / ... / nums[n-1]) 即可最大化
  let result: string = nums[0] + "/(" + nums[1];
  for (let i: number = 2; i < n; i++) {
    result += "/" + nums[i];
  }
  result += ")";
  return result;
}

// 方法2：DP
// dp_max[i][j] 和 dp_min[i][j] 记录区间最大最小值及对应表达式
// 时间复杂度 O(n^3)，空间复杂度 O(n^2)
function optimalDivisionDP(nums: number[]): string {
  const n: number = nums.length;
  // maxVal[i][j], minVal[i][j] 存储 nums[i..j] 的最大/最小值
  const maxVal: number[][] = [];
  const minVal: number[][] = [];
  const maxStr: string[][] = [];
  const minStr: string[][] = [];

  for (let i: number = 0; i < n; i++) {
    maxVal.push(new Array(n).fill(0));
    minVal.push(new Array(n).fill(0));
    maxStr.push(new Array(n).fill(""));
    minStr.push(new Array(n).fill(""));
    maxVal[i][i] = nums[i];
    minVal[i][i] = nums[i];
    maxStr[i][i] = String(nums[i]);
    minStr[i][i] = String(nums[i]);
  }

  // 按区间长度填充
  for (let len: number = 2; len <= n; len++) {
    for (let i: number = 0; i + len - 1 < n; i++) {
      const j: number = i + len - 1;
      maxVal[i][j] = -Infinity;
      minVal[i][j] = Infinity;

      for (let k: number = i; k < j; k++) {
        // 最大值 = 左边最大 / 右边最小
        const val: number = maxVal[i][k] / minVal[k + 1][j];
        if (val > maxVal[i][j]) {
          maxVal[i][j] = val;
          const left: string = maxStr[i][k];
          const right: string = minStr[k + 1][j];
          // 需要加括号的情况
          if (k + 1 === j) {
            maxStr[i][j] = left + "/" + right;
          } else {
            maxStr[i][j] = left + "/(" + right + ")";
          }
        }
        // 最小值 = 左边最小 / 右边最大
        const minV: number = minVal[i][k] / maxVal[k + 1][j];
        if (minV < minVal[i][j]) {
          minVal[i][j] = minV;
          const left: string = minStr[i][k];
          const right: string = maxStr[k + 1][j];
          if (k + 1 === j) {
            minStr[i][j] = left + "/" + right;
          } else {
            minStr[i][j] = left + "/(" + right + ")";
          }
        }
      }
    }
  }

  return maxStr[0][n - 1];
}

// ============================================================
// 测试
// ============================================================
console.log("===== 096. 最优除法 =====");
console.log(optimalDivision([1000, 100, 10, 2])); // 期望结果: 1000/(100/10/2)
console.log(optimalDivision([2, 3, 4])); // 期望结果: 2/(3/4)
console.log(optimalDivision([2])); // 期望结果: 2
console.log("--- 方法2测试 ---");
console.log(optimalDivisionDP([1000, 100, 10, 2])); // 期望结果: 1000/(100/10/2)
console.log(optimalDivisionDP([2, 3, 4])); // 期望结果: 2/(3/4)

export {};
