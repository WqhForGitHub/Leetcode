// ============================================================
// 066. 循环码排列
// ============================================================
// LeetCode 1238. Circular Permutation in Binary Representation
// 给定 n 和 start，返回长度 2^n 的循环排列，满足：
// 1) 每个元素是 gray code（相邻两数二进制恰好 1 位不同）
// 2) 首尾也满足 1 位不同
// 3) 第一个元素为 start
// 时间复杂度：O(2^n), 空间复杂度：O(2^n)

// 方法1：格雷码公式 + 重排 (推荐)
// 标准格雷码 g(i) = i ^ (i >> 1)
// 构造以 0 开头的格雷码序列，找到 start 的位置后旋转
// 时间复杂度 O(2^n), 空间复杂度 O(2^n)
function circularPermutation(n: number, start: number): number[] {
  const size = 1 << n;
  const gray: number[] = [];
  for (let i = 0; i < size; i++) {
    gray.push(i ^ (i >> 1));
  }
  // 找到 start 的位置，旋转数组使其成为起点
  let idx = 0;
  for (let i = 0; i < size; i++) {
    if (gray[i] === start) {
      idx = i;
      break;
    }
  }
  // 旋转：[idx, idx+1, ..., size-1, 0, 1, ..., idx-1]
  return gray.slice(idx).concat(gray.slice(0, idx));
}

// 方法2：回溯构造
// 直接从 start 出发，逐步添加与当前末尾差一位的、未使用的数
// 时间复杂度 O(2^n) (借助 gray code 性质回溯能很快找到解), 空间复杂度 O(2^n)
function circularPermutation2(n: number, start: number): number[] {
  const size = 1 << n;
  const used: boolean[] = new Array(size).fill(false);
  const path: number[] = [start];
  used[start] = true;

  const backtrack = (): boolean => {
    if (path.length === size) {
      // 检查首尾是否相差一位
      const xor = path[0] ^ path[path.length - 1];
      return xor !== 0 && (xor & (xor - 1)) === 0;
    }
    const last = path[path.length - 1];
    // 枚举翻转哪一位
    for (let i = 0; i < n; i++) {
      const next = last ^ (1 << i);
      if (!used[next]) {
        used[next] = true;
        path.push(next);
        if (backtrack()) return true;
        path.pop();
        used[next] = false;
      }
    }
    return false;
  };

  backtrack();
  return path;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 066. 循环码排列 =====");
console.log(circularPermutation(2, 3)); // 期望结果: [3,2,0,1] (或任意以3开头的合法循环格雷码)
console.log(circularPermutation2(2, 3)); // 期望结果: 以3开头的合法循环格雷码
console.log(circularPermutation(3, 2)); // 期望结果: 以2开头的合法循环格雷码，长度8

export {};
