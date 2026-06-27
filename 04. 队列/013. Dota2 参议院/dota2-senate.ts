// ============================================================
// 013. Dota2 参议院
// ============================================================
// LeetCode 649. Dota2 Senate
// 参议院由两党 'R'（Radiant）和 'D'（Dire）组成，每轮每名参议员可以禁止另一名参议员的权利。
// 预测哪一党最终宣布胜利。

// ------------------------------------------------------------
// 方法1：两个队列模拟
// ------------------------------------------------------------
// 用两个队列分别保存两党议员的投票顺序，每轮比较队首，
// 编号小的禁止编号大的，胜者编号加 n 重新入队。
// 时间 O(n)，空间 O(n)。
function predictPartyVictory1(senate: string): string {
  const radiant: number[] = [];
  const dire: number[] = [];
  const n = senate.length;
  for (let i = 0; i < n; i++) {
    if (senate[i] === "R") radiant.push(i);
    else dire.push(i);
  }
  while (radiant.length > 0 && dire.length > 0) {
    const r = radiant.shift()!;
    const d = dire.shift()!;
    if (r < d) {
      radiant.push(r + n);
    } else {
      dire.push(d + n);
    }
  }
  return radiant.length > 0 ? "Radiant" : "Dire";
}

// ------------------------------------------------------------
// 方法2：贪心轮询
// ------------------------------------------------------------
// 用数组模拟活着的议员，每轮遍历并标记被禁言的议员，
// 直到一方全部被禁言。
// 时间 O(n^2) 最坏，空间 O(n)。
function predictPartyVictory2(senate: string): string {
  const arr = senate.split("");
  const banned: boolean[] = new Array(arr.length).fill(false);
  let rCount = 0;
  let dCount = 0;
  for (const ch of arr) {
    if (ch === "R") rCount++;
    else dCount++;
  }
  let i = 0;
  while (rCount > 0 && dCount > 0) {
    if (banned[i]) {
      i = (i + 1) % arr.length;
      continue;
    }
    // 当前议员禁言下一个对方议员
    let j = (i + 1) % arr.length;
    while (banned[j] || arr[j] === arr[i]) {
      j = (j + 1) % arr.length;
    }
    banned[j] = true;
    if (arr[j] === "R") rCount--;
    else dCount--;
    i = (i + 1) % arr.length;
  }
  return rCount > 0 ? "Radiant" : "Dire";
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", predictPartyVictory1("RD"), "期望: Radiant");
  console.log("测试2:", predictPartyVictory1("RDD"), "期望: Dire");
  console.log("测试3:", predictPartyVictory2("RD"), "期望: Radiant");
  console.log("测试4:", predictPartyVictory2("RDD"), "期望: Dire");
  console.log("测试5:", predictPartyVictory1("RRDDD"), "期望: Radiant");
}

test();

export {};
