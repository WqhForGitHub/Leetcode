// ============================================================
// 151. 找到需要补充粉笔的学生编号
// ============================================================
// LeetCode 1894. Find the Student that Will Replace the Chalk
// 学生轮流用粉笔，每轮消耗 chalk[i]，粉笔不够时返回该学生编号。

// 方法1：前缀和 + 二分查找
function chalkReplacer(chalk: number[], k: number): number {
  const n = chalk.length;
  // 计算一轮总消耗
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) {
    prefix[i + 1] = prefix[i] + chalk[i];
  }
  const total = prefix[n];
  // k 对一轮取模
  const remaining = k % total;
  // 二分找第一个 prefix[i+1] > remaining 的位置
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (prefix[mid + 1] > remaining) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return lo;
}

// 方法2：模拟
function chalkReplacerSim(chalk: number[], k: number): number {
  const n = chalk.length;
  let remaining = k;
  let i = 0;
  while (remaining >= chalk[i]) {
    remaining -= chalk[i];
    i = (i + 1) % n;
  }
  return i;
}

// 方法3：前缀和 + 取模 + 线性查找
function chalkReplacerLinear(chalk: number[], k: number): number {
  const n = chalk.length;
  let sum = 0;
  for (const c of chalk) sum += c;
  k = k % sum;
  for (let i = 0; i < n; i++) {
    if (k < chalk[i]) return i;
    k -= chalk[i];
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 151. 找到需要补充粉笔的学生编号 =====");
console.log("二分 [5,1,5],22:", chalkReplacer([5, 1, 5], 22)); // 0
console.log("二分 [3,4,1,2],25:", chalkReplacer([3, 4, 1, 2], 25)); // 1
console.log("模拟 [5,1,5],22:", chalkReplacerSim([5, 1, 5], 22)); // 0

export {};
