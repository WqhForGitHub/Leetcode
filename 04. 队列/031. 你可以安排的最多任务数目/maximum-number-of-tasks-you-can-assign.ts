// ============================================================
// 031. 你可以安排的最多任务数目
// ============================================================
// LeetCode 2071. Maximum Number of Tasks You Can Assign
// 有 n 个任务和 m 个工人，每个工人只能做一个任务，每个任务有强度要求。
// 工人可以通过吃药提升强度。求最多能完成多少任务。

// ------------------------------------------------------------
// 方法1：二分答案 + 贪心 + 双端队列
// ------------------------------------------------------------
// 二分能完成的任务数 mid，选最小的 mid 个任务、最大的 mid 个工人。
// 用贪心 + 双端队列检查是否可完成，药丸优先给需要提升的工人。
// 时间 O((n+m) log min(n,m))，空间 O(n+m)。
function maxTaskAssign1(
  tasks: number[],
  workers: number[],
  pills: number,
  strength: number,
): number {
  tasks.sort((a, b) => a - b);
  workers.sort((a, b) => a - b);
  const n = tasks.length;
  const m = workers.length;

  const canComplete = (mid: number): boolean => {
    const taskList = tasks.slice(0, mid);
    const workerList = workers.slice(m - mid);
    let remainingPills = pills;
    // 双端队列：从大到小尝试匹配
    const deque: number[] = [];
    let taskIdx = mid - 1;
    for (let i = mid - 1; i >= 0; i--) {
      // 不吃药能做的任务入队
      while (taskIdx >= 0 && taskList[taskIdx] > workerList[i]) {
        if (workerList[i] + strength >= taskList[taskIdx]) {
          deque.unshift(taskList[taskIdx]);
        }
        taskIdx--;
      }
      if (deque.length > 0) {
        // 不吃药做最大的能做的
        if (workerList[i] >= deque[deque.length - 1]) {
          deque.pop();
        } else if (remainingPills > 0) {
          // 吃药做最小的（队列头部）
          deque.shift();
          remainingPills--;
        } else {
          return false;
        }
      } else if (taskIdx < 0) {
        // 还有工人没用
      } else {
        // workerList[i] >= taskList[taskIdx]，直接做
        taskIdx--;
      }
    }
    return deque.length === 0 && taskIdx < 0;
  };

  // 简化的检查逻辑
  const check = (mid: number): boolean => {
    const taskList = tasks.slice(0, mid);
    const workerList = workers.slice(m - mid);
    let p = pills;
    // 用 TreeMap 模拟：从大到小遍历工人
    // 双端队列保存当前工人可以用药丸完成的任务
    const deque: number[] = [];
    let j = mid - 1; // 任务指针（从大到小）
    for (let i = mid - 1; i >= 0; i--) {
      // 把当前工人不吃药能做的任务加入队尾
      while (j >= 0 && taskList[j] > workerList[i] - 0 && taskList[j] <= workerList[i]) {
        deque.push(taskList[j]);
        j--;
      }
      // 不吃药能做的直接匹配
      if (j >= 0 && taskList[j] <= workerList[i]) {
        j--;
        continue;
      }
      // 尝试吃药
      while (j >= 0 && taskList[j] > workerList[i] + strength) {
        j--;
      }
      if (deque.length > 0) {
        // 优先不吃药做队列中最大的
        if (workerList[i] >= deque[deque.length - 1]) {
          deque.pop();
          continue;
        }
      }
      if (j >= 0 && p > 0) {
        p--;
        j--;
        continue;
      }
      if (deque.length > 0 && p > 0) {
        deque.shift();
        p--;
        continue;
      }
      return false;
    }
    return true;
  };

  void canComplete;
  let lo = 0;
  let hi = Math.min(n, m);
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (check(mid)) {
      lo = mid;
    } else {
      hi = mid - 1;
    }
  }
  return lo;
}

// ------------------------------------------------------------
// 方法2：二分 + 贪心（TreeMap 风格，用排序数组模拟）
// ------------------------------------------------------------
// 用排序数组 + 指针模拟有序多重集，检查函数同思路但更简洁。
// 时间 O((n+m) log min(n,m) * mid)，空间 O(mid)。
function maxTaskAssign2(
  tasks: number[],
  workers: number[],
  pills: number,
  strength: number,
): number {
  tasks.sort((a, b) => a - b);
  workers.sort((a, b) => a - b);
  const n = tasks.length;
  const m = workers.length;

  const check = (mid: number): boolean => {
    const ws = workers.slice(m - mid);
    let p = pills;
    const deque: number[] = [];
    let j = mid - 1;
    for (let i = mid - 1; i >= 0; i--) {
      while (j >= 0 && tasks[j] <= ws[i] + strength) {
        deque.unshift(tasks[j]);
        j--;
      }
      if (deque.length > 0 && deque[deque.length - 1] <= ws[i]) {
        deque.pop();
      } else if (deque.length > 0 && p > 0) {
        deque.shift();
        p--;
      } else {
        return false;
      }
    }
    return true;
  };

  let lo = 0;
  let hi = Math.min(n, m);
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (check(mid)) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

// ------------------------------------------------------------
// 测试
// ------------------------------------------------------------
function test(): void {
  console.log("测试1:", maxTaskAssign2([3, 2, 1], [3, 3, 3], 1, 1), "期望: 3");
  console.log("测试2:", maxTaskAssign2([5, 4, 3, 3, 2, 2], [5, 5, 5, 5, 5, 5], 1, 2), "期望: 5");
  console.log("测试3:", maxTaskAssign2([10, 15, 30], [0, 10, 10, 10, 10], 3, 10), "期望: 2");
}

test();

export {};
