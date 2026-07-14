// ============================================================
// 011. 位1的个数
// ============================================================
// LeetCode 191. Number of 1 Bits
// 编写一个函数，输入是一个无符号整数（以二进制串的形式），
// 返回其二进制表达式中数字位数为 '1' 的个数（也被称为汉明重量）。
// 时间复杂度：O(popcount) / O(32) / O(1), 空间复杂度：O(1)

// 方法1：Brian Kernighan 算法（推荐）
// n & (n-1) 可以消除 n 中最低位的 1，循环次数恰好等于 1 的个数
function hammingWeight1(n: number): number {
  let count: number = 0;
  // 将 n 视为无符号 32 位整数
  let num: number = n >>> 0;
  while (num !== 0) {
    num &= num - 1;
    count++;
  }
  return count;
}

// 方法2：逐位检查
// 循环 32 次，每次检查最低位是否为 1
function hammingWeight2(n: number): number {
  let count: number = 0;
  let num: number = n >>> 0;
  for (let i: number = 0; i < 32; i++) {
    count += num & 1;
    num >>>= 1;
  }
  return count;
}

// 方法3：分治并行位计数（SWAR popcount）
// 利用位运算并行地累加各比特位，分治思想：先两两相加，再四四相加，最终汇总
function hammingWeight3(n: number): number {
  let num: number = n >>> 0;
  // 第一步：每 2 位一组，统计其中 1 的个数（最大为 2，占 2 位）
  num = num - ((num >>> 1) & 0x55555555);
  // 第二步：每 4 位一组，将相邻两个 2 位组的计数值相加
  num = (num & 0x33333333) + ((num >>> 2) & 0x33333333);
  // 第三步：每 8 位一组，将相邻两个 4 位组的计数值相加
  num = (num + (num >>> 4)) & 0x0f0f0f0f;
  // 第四步：将 4 个字节的计数值折叠累加到最低字节
  num = num + (num >>> 8);
  num = num + (num >>> 16);
  // 低 6 位即为最终结果（最大 32，6 位足够）
  return num & 0x3f;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 位1的个数 =====");
console.log("方法1:", hammingWeight1(0b00000000000000000000000000001011)); // 期望结果: 3
console.log("方法2:", hammingWeight2(0b00000000000000000000000010000000)); // 期望结果: 1
console.log("方法3:", hammingWeight3(0b11111111111111111111111111111101)); // 期望结果: 31
console.log("方法1:", hammingWeight1(0)); // 期望结果: 0
console.log("方法3:", hammingWeight3(4294967295)); // 期望结果: 32 (0xFFFFFFFF)
console.log("--- 三种方法一致性测试 ---");
console.log(hammingWeight1(123456789) === hammingWeight2(123456789), hammingWeight3(123456789)); // 期望结果: true 16
console.log(hammingWeight1(4294967293) === hammingWeight3(4294967293)); // 期望结果: true (31)

export {};
