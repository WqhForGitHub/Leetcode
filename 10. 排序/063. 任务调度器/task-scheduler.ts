// ============================================================
// 063. 任务调度器
// ============================================================
// LeetCode 621. Task Scheduler
// 给定用大写字母表示的任务数组 tasks 和冷却时间 n。
// 同一种任务执行后需要间隔 n 个单位时间才能再执行同种任务。
// 在间隔期间可执行其他任务或让 CPU 空闲。求完成所有任务的最少时间。

// 方法1：数学公式（推荐，O(n) 时间，O(26)=O(1) 空间）
// 设最大频次为 maxFreq，达到该频次的任务数为 maxCount。
// 最少时间 = max((maxFreq - 1) * (n + 1) + maxCount, tasks.length)。
// 前者构造 (maxFreq-1) 个完整冷却块 + 最后一组任务；后者表示无冷却时直接执行。
function leastInterval(tasks: string[], n: number): number {
  const freq = new Array<number>(26).fill(0);
  for (const t of tasks) {
    freq[t.charCodeAt(0) - "A".charCodeAt(0)]++;
  }

  let maxFreq = 0;
  for (const f of freq) {
    maxFreq = Math.max(maxFreq, f);
  }

  let maxCount = 0;
  for (const f of freq) {
    if (f === maxFreq) maxCount++;
  }

  return Math.max((maxFreq - 1) * (n + 1) + maxCount, tasks.length);
}

// 方法2：模拟 + 优先队列（O(time * 26) 时间，O(26) 空间）
// 每轮选择剩余次数最多且不在冷却中的任务执行；用数组模拟最大堆行为。
// time 为最终总时间，最坏 O(tasks.length * 26)。
function leastIntervalSimulate(tasks: string[], n: number): number {
  const freq = new Array<number>(26).fill(0);
  for (const t of tasks) {
    freq[t.charCodeAt(0) - "A".charCodeAt(0)]++;
  }

  // nextAvailable[i] 表示任务 i 下一次可执行的时间
  const nextAvailable = new Array<number>(26).fill(0);
  let remaining = tasks.length;
  let time = 0;

  while (remaining > 0) {
    let best = -1;
    // 在当前时刻可执行的任务中，挑选剩余次数最多者
    for (let i = 0; i < 26; i++) {
      if (freq[i] > 0 && nextAvailable[i] <= time) {
        if (best === -1 || freq[i] > freq[best]) {
          best = i;
        }
      }
    }

    if (best !== -1) {
      // 执行该任务
      freq[best]--;
      remaining--;
      nextAvailable[best] = time + n + 1;
    }
    // 无论执行任务还是空闲，时间都 +1
    time++;
  }
  return time;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 063. 任务调度器 =====");
console.log(
  "公式法 ['A','A','A','B','B','B'], n=2:",
  leastInterval(["A", "A", "A", "B", "B", "B"], 2),
); // 期望 8
console.log(
  "公式法 ['A','A','A','B','B','B'], n=0:",
  leastInterval(["A", "A", "A", "B", "B", "B"], 0),
); // 期望 6
console.log(
  "公式法 ['A','A','A','A','A','A','B','C','D','E','F','G'], n=2:",
  leastInterval(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2),
); // 期望 16
console.log(
  "模拟法 ['A','A','A','B','B','B'], n=2:",
  leastIntervalSimulate(["A", "A", "A", "B", "B", "B"], 2),
); // 期望 8
console.log(
  "模拟法 ['A','A','A','B','B','B'], n=0:",
  leastIntervalSimulate(["A", "A", "A", "B", "B", "B"], 0),
); // 期望 6
console.log(
  "模拟法 ['A','A','A','A','A','A','B','C','D','E','F','G'], n=2:",
  leastIntervalSimulate(["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"], 2),
); // 期望 16

export {};
