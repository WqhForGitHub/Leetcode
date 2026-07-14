// ============================================================
// 101. 最小未被占据椅子的编号
// ============================================================
// LeetCode 1942. The Number of the Smallest Unoccupied Chair
// 朋友按到达时间来参加派对，每次分配最小可用椅子编号，求目标朋友坐的椅子。
// 时间复杂度：O(N log N)，空间复杂度：O(N)

// 方法1：最小堆（可用椅子）+ 最小堆（忙碌椅子）
function smallestChair(times: number[][], targetFriend: number): number {
  const n = times.length;
  const indexed = times
    .map((t, i) => ({ arr: t[0], leave: t[1], i }))
    .sort((a, b) => a.arr - b.arr);
  // 可用椅子最小堆
  const available: number[] = [];
  for (let i = 0; i < n; i++) {
    available.push(i);
    let j = available.length - 1;
    while (j > 0) {
      const p = (j - 1) >> 1;
      if (available[j] < available[p]) {
        [available[j], available[p]] = [available[p], available[j]];
        j = p;
      } else break;
    }
  }
  // 忙碌椅子最小堆：[离开时间, 椅子编号]
  const busy: Array<{ leave: number; chair: number }> = [];
  const pushBusy = (v: { leave: number; chair: number }): void => {
    busy.push(v);
    let i = busy.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (busy[i].leave < busy[p].leave) {
        [busy[i], busy[p]] = [busy[p], busy[i]];
        i = p;
      } else break;
    }
  };
  const popBusy = (): { leave: number; chair: number } => {
    const top = busy[0];
    const last = busy.pop()!;
    if (busy.length > 0) {
      busy[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < busy.length && busy[l].leave < busy[s].leave) s = l;
        if (r < busy.length && busy[r].leave < busy[s].leave) s = r;
        if (s !== i) {
          [busy[i], busy[s]] = [busy[s], busy[i]];
          i = s;
        } else break;
      }
    }
    return top;
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
  for (const friend of indexed) {
    while (busy.length > 0 && busy[0].leave <= friend.arr) {
      pushAvail(popBusy().chair);
    }
    const chair = popAvail();
    if (friend.i === targetFriend) return chair;
    pushBusy({ leave: friend.leave, chair });
  }
  return -1;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 101. 最小未被占据椅子的编号 =====");
console.log(
  "椅子:",
  smallestChair(
    [
      [1, 4],
      [2, 3],
      [4, 6],
    ],
    1,
  ),
); // 期望 1
console.log(
  "椅子:",
  smallestChair(
    [
      [3, 10],
      [1, 5],
      [2, 6],
    ],
    0,
  ),
); // 期望 2

export {};
