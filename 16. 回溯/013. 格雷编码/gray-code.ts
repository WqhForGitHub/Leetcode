// ============================================================
// 013. 格雷编码
// ============================================================
// LeetCode 89. Gray Code
// 给定 n，返回任一 n 位格雷码序列。格雷码相邻两个数恰好有一位二进制不同。
// 时间复杂度：O(2^n)

// 方法1：回溯
// 依次尝试翻转每一位，若得到的新数未出现过则继续
// 时间复杂度 O(2^n)，空间复杂度 O(2^n)
function grayCode(n: number): number[] {
  const result: number[] = [0];
  const used: Set<number> = new Set([0]);
  const total: number = 1 << n;

  const backtrack = (): boolean => {
    // 已生成所有 2^n 个格雷码
    if (result.length === total) {
      return true;
    }
    const last: number = result[result.length - 1];
    // 尝试翻转 last 的每一位
    for (let i = 0; i < n; i++) {
      const next: number = last ^ (1 << i);
      if (!used.has(next)) {
        used.add(next);
        result.push(next);
        if (backtrack()) {
          return true;
        }
        result.pop();
        used.delete(next);
      }
    }
    return false;
  };

  backtrack();
  return result;
}

// 方法2：公式法 G(i) = i ^ (i >> 1)
// 第 i 个格雷码直接由公式计算得到
// 时间复杂度 O(2^n)，空间复杂度 O(2^n)
function grayCodeFormula(n: number): number[] {
  const result: number[] = [];
  const total: number = 1 << n;
  for (let i = 0; i < total; i++) {
    // i ^ (i >> 1) 即为格雷码
    result.push(i ^ (i >> 1));
  }
  return result;
}

// 方法3：镜像法
// n 位格雷码 = (n-1) 位格雷码 + 其逆序每位加前缀 1
// 时间复杂度 O(2^n)，空间复杂度 O(2^n)
function grayCodeMirror(n: number): number[] {
  let result: number[] = [0];
  for (let i = 0; i < n; i++) {
    // 取当前结果逆序，并在高位加 1
    const mirror: number[] = [];
    for (let j = result.length - 1; j >= 0; j--) {
      mirror.push(result[j] | (1 << i));
    }
    result = result.concat(mirror);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 013. 格雷编码 =====");
console.log(grayCode(2)); // 期望结果: [0,1,3,2] 或其他合法格雷码
console.log(grayCode(1)); // 期望结果: [0,1]
console.log(grayCodeFormula(2)); // 期望结果: [0,1,3,2]
console.log(grayCodeFormula(3)); // 期望结果: [0,1,3,2,6,7,5,4]
console.log(grayCodeMirror(2)); // 期望结果: [0,1,3,2]
console.log(grayCodeMirror(3)); // 期望结果: [0,1,3,2,6,7,5,4]

export {};
