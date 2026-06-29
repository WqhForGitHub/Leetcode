// ============================================================
// 016. 强密码检验器
// ============================================================
// LeetCode 420. Strong Password Checker
// 密码需满足：长度 6-20；至少一个小写字母、大写字母、数字；不能有连续3个相同字符。返回使密码变强所需的最少操作数。
// 时间复杂度：O(n)，空间复杂度：O(1)

// 方法1：分类讨论
function strongPasswordChecker(password: string): number {
  const n = password.length;
  let lower = 0, upper = 0, digit = 0;
  for (const ch of password) {
    if (ch >= "a" && ch <= "z") lower = 1;
    else if (ch >= "A" && ch <= "Z") upper = 1;
    else if (ch >= "0" && ch <= "9") digit = 1;
  }
  const missing = 3 - (lower + upper + digit);
  // 找出重复序列
  const repeats: number[] = [];
  let i = 0;
  while (i < n) {
    let j = i;
    while (j < n && password[j] === password[i]) j++;
    if (j - i >= 3) repeats.push(j - i);
    i = j;
  }
  if (n < 6) {
    return Math.max(missing, 6 - n);
  } else if (n <= 20) {
    let replace = 0;
    for (const len of repeats) replace += Math.floor(len / 3);
    return Math.max(replace, missing);
  } else {
    const toDelete = n - 20;
    let replace = 0;
    // 优先对长度 %3==0 的序列删除1个，%3==1 删2个，可减少替换次数
    for (let pass = 0; pass < 2; pass++) {
      for (let k = 0; k < repeats.length; k++) {
        if (toDelete <= 0) break;
        const need = (pass === 0) ? 1 : 2;
        if (repeats[k] >= 3 && repeats[k] % 3 === pass) {
          const d = Math.min(toDelete, need);
          repeats[k] -= d;
          toDelete -= d;
        }
      }
    }
    for (const len of repeats) replace += Math.floor(len / 3);
    return (n - 20) + Math.max(replace, missing);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 016. 强密码检验器 =====");
console.log("检查:", strongPasswordChecker("a")); // 期望 5
console.log("检查:", strongPasswordChecker("aA1")); // 期望 3
console.log("检查:", strongPasswordChecker("1337C0d3")); // 期望 0

export {};
