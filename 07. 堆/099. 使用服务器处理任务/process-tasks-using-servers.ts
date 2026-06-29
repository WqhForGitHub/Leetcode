// ============================================================
// 099. 使用服务器处理任务
// ============================================================
// LeetCode 1882. Process Tasks Using Servers
// 每个任务分配给权重最小且编号最小的空闲服务器，返回处理任务的服务器。
// 时间复杂度：O((N+M) log N)，空间复杂度：O(N)

// 方法1：两个最小堆（空闲 + 忙碌）
function assignTasks(servers: number[], tasks: number[]): number[] {
  const n = servers.length;
  const m = tasks.length;
  // 空闲服务器最小堆：[weight, index]
  const idle: Array<{ w: number; i: number }> = [];
  // 忙碌服务器最小堆：[availableTime, weight, index]
  const busy: Array<{ time: number; w: number; i: number }> = [];
  const pushIdle = (v: { w: number; i: number }): void => {
    idle.push(v);
    let i = idle.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (idle[i].w < idle[p].w || (idle[i].w === idle[p].w && idle[i].i < idle[p].i)) {
        [idle[i], idle[p]] = [idle[p], idle[i]];
        i = p;
      } else break;
    }
  };
  const popIdle = (): { w: number; i: number } => {
    const top = idle[0];
    const last = idle.pop()!;
    if (idle.length > 0) {
      idle[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < idle.length && (idle[l].w < idle[s].w || (idle[l].w === idle[s].w && idle[l].i < idle[s].i))) s = l;
        if (r < idle.length && (idle[r].w < idle[s].w || (idle[r].w === idle[s].w && idle[r].i < idle[s].i))) s = r;
        if (s !== i) {
          [idle[i], idle[s]] = [idle[s], idle[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  const pushBusy = (v: { time: number; w: number; i: number }): void => {
    busy.push(v);
    let i = busy.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (busy[i].time < busy[p].time) {
        [busy[i], busy[p]] = [busy[p], busy[i]];
        i = p;
      } else break;
    }
  };
  const popBusy = (): { time: number; w: number; i: number } => {
    const top = busy[0];
    const last = busy.pop()!;
    if (busy.length > 0) {
      busy[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < busy.length && busy[l].time < busy[s].time) s = l;
        if (r < busy.length && busy[r].time < busy[s].time) s = r;
        if (s !== i) {
          [busy[i], busy[s]] = [busy[s], busy[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < n; i++) pushIdle({ w: servers[i], i });
  const result: number[] = [];
  let time = 0;
  for (let j = 0; j < m; j++) {
    time = Math.max(time, j);
    while (busy.length > 0 && busy[0].time <= time) {
      const s = popBusy();
      pushIdle({ w: s.w, i: s.i });
    }
    if (idle.length === 0) {
      time = busy[0].time;
      while (busy.length > 0 && busy[0].time <= time) {
        const s = popBusy();
        pushIdle({ w: s.w, i: s.i });
      }
    }
    const server = popIdle();
    result.push(server.i);
    pushBusy({ time: time + tasks[j], w: server.w, i: server.i });
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 099. 使用服务器处理任务 =====");
console.log("分配:", assignTasks([3, 3, 2], [1, 2, 3, 2, 1, 2])); // 期望 [2,2,0,2,1,2]
console.log("分配:", assignTasks([5, 1, 4, 3, 2], [2, 1, 2, 4, 5, 2, 1, 2])); // 期望 [1,4,1,4,1,3,2,0]

export {};
