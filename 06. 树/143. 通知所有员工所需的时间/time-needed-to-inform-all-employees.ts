// ============================================================
// 143. 通知所有员工所需的时间
// ============================================================
// LeetCode 1376. Time Needed to Inform All Employees
// 公司有 n 名员工，编号 0 到 n-1。headID 是总负责人。
// manager[i] 是员工 i 的直接领导，informTime[i] 是领导通知员工 i 所需时间。
// 返回通知所有员工所需的总时间。
// 时间复杂度：O(n)，空间复杂度：O(n)

// 方法1：DFS递归（推荐）
// 对每个员工递归计算从该员工到根的总时间，答案取最大值
// 也可反向建树从根DFS
function numOfMinutes(
  n: number,
  headID: number,
  manager: number[],
  informTime: number[]
): number {
  // 反向建图：每个领导 -> 直接下属列表
  const subordinates: number[][] = new Array(n).fill(0).map(() => []);
  for (let i = 0; i < n; i++) {
    if (manager[i] !== -1) {
      subordinates[manager[i]].push(i);
    }
  }

  function dfs(emp: number): number {
    let maxTime = 0;
    for (const sub of subordinates[emp]) {
      maxTime = Math.max(maxTime, dfs(sub));
    }
    return informTime[emp] + maxTime;
  }

  return dfs(headID);
}

// 方法2：BFS
// 从根开始BFS，记录到达每个员工的时间，取最大值
function numOfMinutesBFS(
  n: number,
  headID: number,
  manager: number[],
  informTime: number[]
): number {
  const subordinates: number[][] = new Array(n).fill(0).map(() => []);
  for (let i = 0; i < n; i++) {
    if (manager[i] !== -1) {
      subordinates[manager[i]].push(i);
    }
  }

  // 队列: [员工, 到达该员工时的累计时间]
  const queue: [number, number][] = [[headID, 0]];
  let maxTime = 0;

  while (queue.length > 0) {
    const [emp, time] = queue.shift()!;
    const arriveTime = time + informTime[emp];
    maxTime = Math.max(maxTime, arriveTime);
    for (const sub of subordinates[emp]) {
      queue.push([sub, arriveTime]);
    }
  }

  return maxTime;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 143. 通知所有员工所需的时间 =====");

// 测试1: n=1, headID=0, manager=[-1], informTime=[0]
// 只有总负责人，无需通知，时间0
console.log("测试1 DFS:", numOfMinutes(1, 0, [-1], [0])); // 0
console.log("测试1 BFS:", numOfMinutesBFS(1, 0, [-1], [0])); // 0

// 测试2: n=6, headID=2, manager=[2,2,-1,2,2,2], informTime=[0,0,1,0,0,0]
// 员工2是根，通知时间1，下属0,1,3,4,5通知时间0
// 总时间=1
console.log("测试2 DFS:", numOfMinutes(6, 2, [2, 2, -1, 2, 2, 2], [0, 0, 1, 0, 0, 0])); // 1
console.log("测试2 BFS:", numOfMinutesBFS(6, 2, [2, 2, -1, 2, 2, 2], [0, 0, 1, 0, 0, 0])); // 1

// 测试3: n=7, headID=6, manager=[1,2,3,4,5,6,-1], informTime=[0,1,2,3,4,5,6]
// 6<-5<-4<-3<-2<-1<-0 链式
// 总时间 = 6+5+4+3+2+1 = 21
console.log("测试3 DFS:", numOfMinutes(7, 6, [1, 2, 3, 4, 5, 6, -1], [0, 1, 2, 3, 4, 5, 6])); // 21
console.log("测试3 BFS:", numOfMinutesBFS(7, 6, [1, 2, 3, 4, 5, 6, -1], [0, 1, 2, 3, 4, 5, 6])); // 21

// 测试4: n=15, headID=0, manager=[-1,0,0,1,1,2,2,3,3,4,4,5,5,6,6], informTime=[1,2,3,4,5,6,7,0,0,0,0,0,0,0,0]
// 根0通知时间1，子1(2),2(3)
// 子1: 子3(4),4(5); 子2: 子5(6),6(7)
// 路径0->1->3: 1+2+4=7
// 路径0->2->6: 1+3+7=11
// 最大11
console.log("测试4 DFS:", numOfMinutes(15, 0, [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6], [1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0])); // 11
console.log("测试4 BFS:", numOfMinutesBFS(15, 0, [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6], [1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0])); // 11

export {};
