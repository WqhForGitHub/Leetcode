// ============================================================
// 077. 找到处理最多请求的服务器
// ============================================================
// LeetCode 1606. Find Servers That Handled Most Number of Requests
// k 个服务器，每个请求到达时分配给空闲且编号最小的服务器，返回处理最多请求的服务器。
// 时间复杂度：O(N log K)，空间复杂度：O(K)

// 方法1：最小堆（可用服务器）+ 最小堆（忙碌服务器）
function busiestServers(k: number, arrival: number[], load: number[]): number[] {
  const count: number[] = new Array(k).fill(0);
  // 可用服务器最小堆
  const available: number[] = [];
  for (let i = 0; i < k; i++) available.push(i);
  // 忙碌服务器最小堆：[结束时间, 服务器编号]
  const busy: Array<{ end: number; server: number }> = [];
  const pushAvail = (v: number): void => {
    available.push(v);
    let i = available.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (available[i] < available[p]) {
        [available[i], available[p]] = [available[p], available[i]];
        i = p;
      } else break;
    }
  };
  const popAvail = (): number => {
    const top = available[0];
    const last = available.pop()!;
    if (available.length > 0) {
      available[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < available.length && available[l] < available[s]) s = l;
        if (r < available.length && available[r] < available[s]) s = r;
        if (s !== i) {
          [available[i], available[s]] = [available[s], available[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  const pushBusy = (v: { end: number; server: number }): void => {
    busy.push(v);
    let i = busy.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (busy[i].end < busy[p].end) {
        [busy[i], busy[p]] = [busy[p], busy[i]];
        i = p;
      } else break;
    }
  };
  const popBusy = (): { end: number; server: number } => {
    const top = busy[0];
    const last = busy.pop()!;
    if (busy.length > 0) {
      busy[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < busy.length && busy[l].end < busy[s].end) s = l;
        if (r < busy.length && busy[r].end < busy[s].end) s = r;
        if (s !== i) {
          [busy[i], busy[s]] = [busy[s], busy[i]];
          i = s;
        } else break;
      }
    }
    return top;
  };
  for (let i = 0; i < arrival.length; i++) {
    while (busy.length > 0 && busy[0].end <= arrival[i]) {
      pushAvail(popBusy().server);
    }
    if (available.length === 0) continue;
    // 找到 >= i%k 的服务器
    const target = i % k;
    let server = -1;
    const temp: number[] = [];
    while (available.length > 0) {
      const s = popAvail();
      if (s >= target) {
        server = s;
        break;
      }
      temp.push(s);
    }
    if (server === -1) {
      server = temp.length > 0 ? temp[0] : popAvail();
    }
    for (const t of temp) pushAvail(t);
    count[server]++;
    pushBusy({ end: arrival[i] + load[i], server });
  }
  const maxCount = Math.max(...count);
  const result: number[] = [];
  for (let i = 0; i < k; i++) {
    if (count[i] === maxCount) result.push(i);
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 077. 找到处理最多请求的服务器 =====");
console.log("服务器:", busiestServers(3, [1, 2, 3, 4, 5], [5, 2, 3, 3, 3])); // 期望 [1]
console.log("服务器:", busiestServers(3, [1, 2, 3, 4], [1, 2, 1, 2])); // 期望 [0,1,2]

export {};
