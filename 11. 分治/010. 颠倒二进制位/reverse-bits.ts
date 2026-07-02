// ============================================================
// 010. 颠倒二进制位
// ============================================================
// LeetCode 190. Reverse Bits
// 颠倒给定的 32 位无符号整数的二进制位。
// 输入是一个 32 位二进制串，返回将其二进制位颠倒后的数字。
// 时间复杂度：O(1), 空间复杂度：O(1)

// 方法1：逐位反转（推荐）
// 从低位到高位依次取出每一位，放到结果的高位到低位
// 时间复杂度 O(32) = O(1)，空间复杂度 O(1)
function reverseBits(n: number): number {
  let result: number = 0;
  for (let i: number = 0; i < 32; i++) {
    // result 左移一位，腾出最低位
    result = result << 1;
    // 取出 n 的最低位，加到 result 最低位
    result = result | (n & 1);
    // n 右移一位（无符号右移处理负数）
    n = n >>> 1;
  }
  // 用 >>> 0 转为无符号 32 位整数
  return result >>> 0;
}

// 方法2：字节交换 + 查找表
// 先反转每个字节（用查表），再按字节交换顺序
// 时间复杂度 O(1)，空间复杂度 O(1)
function reverseBitsByteSwap(n: number): number {
  // 预计算 0~255 的字节反转查找表
  const reverseByteTable: number[] = new Array(256);
  for (let i: number = 0; i < 256; i++) {
    let v: number = i;
    let r: number = 0;
    for (let j: number = 0; j < 8; j++) {
      r = (r << 1) | (v & 1);
      v = v >>> 1;
    }
    reverseByteTable[i] = r;
  }

  let result: number = 0;
  let value: number = n >>> 0;
  for (let i: number = 0; i < 4; i++) {
    const byte: number = value & 0xff;
    // 字节内反转后，左移到对应的高位位置
    result = (result << 8) | reverseByteTable[byte];
    value = value >>> 8;
  }
  return result >>> 0;
}

// 方法3：分治位运算
// 通过交换相邻位、相邻2位组、相邻4位组...最终反转整个32位
// 时间复杂度 O(1)，空间复杂度 O(1)
function reverseBitsDivideConquer(n: number): number {
  let result: number = n >>> 0;

  // 第1步：交换奇偶位（每2位一组，交换相邻位）
  // 0x55555555 = 0101...0101（取奇数位）, 0xaaaaaaaa = 1010...1010（取偶数位）
  result = ((result & 0x55555555) << 1) | ((result & 0xaaaaaaaa) >>> 1);

  // 第2步：交换相邻的2位组（每4位一组，交换前后2位）
  // 0x33333333 = 0011...0011, 0xcccccccc = 1100...1100
  result = ((result & 0x33333333) << 2) | ((result & 0xcccccccc) >>> 2);

  // 第3步：交换相邻的4位组（每8位一组，交换前后4位）
  // 0x0f0f0f0f = 00001111..., 0xf0f0f0f0 = 11110000...
  result = ((result & 0x0f0f0f0f) << 4) | ((result & 0xf0f0f0f0) >>> 4);

  // 第4步：交换相邻的字节（每16位一组，交换前后8位）
  // 0x00ff00ff 取低字节, 0xff00ff00 取高字节
  result = ((result & 0x00ff00ff) << 8) | ((result & 0xff00ff00) >>> 8);

  // 第5步：交换相邻的16位组（交换前后16位）
  // 0x0000ffff 取低16位, 0xffff0000 取高16位
  result = ((result & 0x0000ffff) << 16) | ((result & 0xffff0000) >>> 16);

  return result >>> 0;
}

// 辅助函数：将数字格式化为 32 位二进制字符串
function toBinaryString(n: number): string {
  return (n >>> 0).toString(2).padStart(32, "0");
}

// ============================================================
// 测试
// ============================================================
console.log("===== 010. 颠倒二进制位 =====");
// 输入 00000010100101000001111010011100 (43261596)
// 输出 00111001011110000010100101000000 (964176192)
console.log(reverseBits(43261596)); // 期望结果: 964176192
console.log(toBinaryString(reverseBits(43261596))); // 期望: 00111001011110000010100101000000
// 输入 11111111111111111111111111111101 (-3，作为无符号为 4294967293)
// 输出 10111111111111111111111111111111 (3221225471)
console.log(reverseBits(4294967293)); // 期望结果: 3221225471
console.log("--- 方法2测试 ---");
console.log(reverseBitsByteSwap(43261596)); // 期望结果: 964176192
console.log(reverseBitsByteSwap(4294967293)); // 期望结果: 3221225471
console.log("--- 方法3测试 ---");
console.log(reverseBitsDivideConquer(43261596)); // 期望结果: 964176192
console.log(reverseBitsDivideConquer(4294967293)); // 期望结果: 3221225471
console.log(toBinaryString(reverseBitsDivideConquer(43261596))); // 期望: 00111001011110000010100101000000

export {};
