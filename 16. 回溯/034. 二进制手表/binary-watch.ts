// ============================================================
// 034. 二进制手表
// ============================================================
// LeetCode 401. Binary Watch
// 手表有4个LED表示小时(0-11)，6个LED表示分钟(0-59)。给定亮灯数turnedOn，返回所有可能的时间。
// 时间复杂度：O(C(10, turnedOn)), 空间复杂度：O(C(10, turnedOn))

// 方法1：回溯(从10个LED中选turnedOn个) (推荐)
// 将10个LED看作一个整体：前4个是小时，后6个是分钟。回溯选择turnedOn个LED。
// 时间复杂度 O(C(10, turnedOn)), 空间复杂度 O(C(10, turnedOn))
function readBinaryWatch(turnedOn: number): string[] {
  const result: string[] = [];

  // pos: 当前LED位置(0-3为小时, 4-9为分钟)
  // count: 已选择的LED数量
  // hours: 当前小时值
  // minutes: 当前分钟值
  function backtrack(pos: number, count: number, hours: number, minutes: number): void {
    // 选够了turnedOn个LED
    if (count === turnedOn) {
      if (hours <= 11 && minutes <= 59) {
        result.push(`${hours}:${minutes.toString().padStart(2, "0")}`);
      }
      return;
    }
    // 所有LED都考虑完了
    if (pos === 10) return;

    // 选择1：不选当前LED
    backtrack(pos + 1, count, hours, minutes);

    // 选择2：选当前LED
    if (pos < 4) {
      // 小时LED（第pos位，权重1<<pos）
      backtrack(pos + 1, count + 1, hours + (1 << pos), minutes);
    } else {
      // 分钟LED（第pos-4位，权重1<<(pos-4)）
      backtrack(pos + 1, count + 1, hours, minutes + (1 << (pos - 4)));
    }
  }

  backtrack(0, 0, 0, 0);
  return result;
}

// 方法2：枚举所有时间
// 枚举所有可能的小时(0-11)和分钟(0-59)，统计亮灯数等于turnedOn的组合
// 时间复杂度 O(12 * 60), 空间复杂度 O(1)
function readBinaryWatch2(turnedOn: number): string[] {
  const result: string[] = [];

  // 计算一个数的二进制中1的个数
  function countBits(n: number): number {
    let count: number = 0;
    while (n > 0) {
      count += n & 1;
      n >>= 1;
    }
    return count;
  }

  for (let h: number = 0; h <= 11; h++) {
    for (let m: number = 0; m <= 59; m++) {
      if (countBits(h) + countBits(m) === turnedOn) {
        result.push(`${h}:${m.toString().padStart(2, "0")}`);
      }
    }
  }

  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 034. 二进制手表 =====");
console.log(readBinaryWatch(1)); // 期望结果: ["0:01","0:02","0:04","0:08","0:16","0:32","1:00","2:00","4:00","8:00"]
console.log(readBinaryWatch(9)); // 期望结果: []
console.log(readBinaryWatch2(1)); // 期望结果: 同上
console.log(readBinaryWatch2(9)); // 期望结果: []

export {};
