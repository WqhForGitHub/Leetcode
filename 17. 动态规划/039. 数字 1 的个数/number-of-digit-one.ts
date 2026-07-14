// ============================================================
// 039. 数字 1 的个数
// ============================================================
// LeetCode 233. Number of Digit One
// 给定 n，统计所有 <= n 的非负整数中数字 1 出现的次数
// 时间复杂度 O(log n)

// 方法1：数位统计（推荐）
// 按位计算每一位上数字1出现的次数
// 对于第i位（个位为第0位），设 high=n/(10^(i+1)), cur=(n/10^i)%10, low=n%10^i
// cur==0: 该位1出现 high*10^i 次
// cur==1: 该位1出现 high*10^i + low + 1 次
// cur>1:  该位1出现 (high+1)*10^i 次
// 时间复杂度 O(log n)，空间复杂度 O(1)
function countDigitOne(n: number): number {
  if (n <= 0) return 0;
  let count: number = 0;
  let factor: number = 1; // 当前位的权值 10^i
  let high: number = Math.floor(n / 10); // 当前位左边的高位数字
  let current: number = n % 10; // 当前位的数字
  let low: number = 0; // 当前位右边的低位数字

  while (high !== 0 || current !== 0) {
    if (current === 0) {
      // 当前位为0，1的个数 = high * factor
      count += high * factor;
    } else if (current === 1) {
      // 当前位为1，1的个数 = high * factor + low + 1
      count += high * factor + low + 1;
    } else {
      // 当前位>1，1的个数 = (high + 1) * factor
      count += (high + 1) * factor;
    }
    // 移到更高一位
    low += current * factor;
    current = high % 10;
    high = Math.floor(high / 10);
    factor *= 10;
  }
  return count;
}

// 方法2：动态规划-按位分解
// f[i] 表示 i 位数（0~10^i-1）中数字1出现的总次数
// f[i] = i * 10^(i-1)（每一位上1出现10^(i-1)次，共i位）
// 然后从高位到低位分解n，逐位计算贡献
// 时间复杂度 O(log n)，空间复杂度 O(log n)
function countDigitOneDP(n: number): number {
  if (n <= 0) return 0;
  const s: string = n.toString();
  const len: number = s.length;

  // power[i] = 10^i，位权
  const power: number[] = new Array<number>(len + 1).fill(0);
  power[0] = 1;
  for (let i: number = 1; i <= len; i++) {
    power[i] = power[i - 1] * 10;
  }

  // f[i] 表示0~10^i-1（即i位数）中1出现的总次数
  // f[i] = i * 10^(i-1)
  const f: number[] = new Array<number>(len + 1).fill(0);
  for (let i: number = 1; i <= len; i++) {
    f[i] = i * power[i - 1];
  }

  let count: number = 0;
  let remaining: number = n;

  // 从最高位到最低位逐位处理
  for (let i: number = len; i >= 1; i--) {
    const factor: number = power[i - 1];
    const digit: number = Math.floor(remaining / factor); // 当前位的数字
    remaining = remaining % factor; // 剩余低位部分

    if (digit === 0) {
      // 当前位为0，没有1的贡献，继续处理低位
      continue;
    }

    // 完整的低位组（0~digit-1）中，低位i-1位的1总个数
    count += digit * f[i - 1];

    if (digit > 1) {
      // 当前位>1，高位为1时，当前位出现10^(i-1)次
      count += power[i - 1];
    } else {
      // digit === 1，高位为1时，当前位出现 remaining+1 次
      count += remaining + 1;
    }
  }

  return count;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 039. 数字 1 的个数 =====");
console.log(countDigitOne(13)); // 期望结果: 6
console.log(countDigitOne(0)); // 期望结果: 0
console.log(countDigitOne(100)); // 期望结果: 21
console.log(countDigitOneDP(13)); // 期望结果: 6
console.log(countDigitOneDP(100)); // 期望结果: 21

export {};
