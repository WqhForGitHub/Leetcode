// ============================================================
// 171. 你可以安排的最多任务数目
// ============================================================
// LeetCode 2071. Maximum Number of Tasks You Can Assign
// tasks[i] 为任务难度，workers[j] 为工人能力。
// 每个工人最多完成一个任务，有 pills 个药丸，服用后能力 + strength。
// 求最多能完成的任务数。

// 方法1：二分答案 + 贪心 + 双端队列
function maxTaskAssign(tasks: number[], workers: number[], pills: number, strength: number): number {
  tasks.sort((a, b) => a - b);
  workers.sort((a, b) => a - b);

  function canComplete(k: number): boolean {
    // 取 k 个最简单的任务和 k 个最强的工人
    const taskList = tasks.slice(0, k);
    const workerList = workers.slice(workers.length - k);
    let pillsLeft = pills;
    const deque: number[] = []; // 存放可以用药丸完成当前任务的工人索引
    let wIdx = 0;
    // 从最难的任务往最简单的处理
    for (let i = k - 1; i >= 0; i--) {
      // 加入所有可以用药丸完成此任务的工人
      while (wIdx < k && workerList[wIdx] + strength >= taskList[i]) {
        deque.push(wIdx);
        wIdx++;
      }
      if (deque.length === 0) return false;
      // 如果最强的工人可以不用药丸完成，优先不用药丸
      if (workerList[deque[deque.length - 1]] >= taskList[i]) {
        deque.pop();
      } else {
        // 否则用药丸让最弱的工人完成
        if (pillsLeft <= 0) return false;
        deque.shift();
        pillsLeft--;
      }
    }
    return true;
  }

  let left = 0;
  let right = Math.min(tasks.length, workers.length);
  while (left < right) {
    const mid = Math.ceil((left + right) / 2);
    if (canComplete(mid)) {
      left = mid;
    } else {
      right = mid - 1;
    }
  }
  return left;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 171. 你可以安排的最多任务数目 =====");
console.log("[3,2,1],[3,3,3],1,1:", maxTaskAssign([3, 2, 1], [3, 3, 3], 1, 1)); // 3
console.log("[5,4,3,2,1],[2,1,1],1,3:", maxTaskAssign([5, 4, 3, 2, 1], [2, 1, 1], 1, 3)); // 3
console.log("[10,15,30],[0,10,10,10,10],3,10:", maxTaskAssign([10, 15, 30], [0, 10, 10, 10, 10], 3, 10)); // 2

export {};
