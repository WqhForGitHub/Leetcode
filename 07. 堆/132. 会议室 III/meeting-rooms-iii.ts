// ============================================================
// 132. 会议室 III
// ============================================================
// LeetCode 2402. Meeting Rooms III
// 有 n 个会议室，按时间顺序处理会议，优先分配编号最小的空闲房间。
// 时间复杂度：O(m log m + m log n)，空间复杂度：O(n)

// 方法1：双最小堆
function mostBooked(n: number, meetings: number[][]): number {
  meetings.sort((a, b) => a[0] - b[0]);
  // 空闲房间堆（按编号排序）
  const freeRooms: number[] = [];
  for (let i = 0; i < n; i++) freeRooms.push(i);
  // 使用中的房间堆 [endTime, roomNumber]
  const busyRooms: Array<[number, number]> = [];
  const count: number[] = new Array(n).fill(0);
  const freeSiftDown = (i: number): void => {
    const len = freeRooms.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (l < len && freeRooms[l] < freeRooms[s]) s = l;
      if (r < len && freeRooms[r] < freeRooms[s]) s = r;
      if (s !== i) {
        [freeRooms[i], freeRooms[s]] = [freeRooms[s], freeRooms[i]];
        i = s;
      } else break;
    }
  };
  for (let i = Math.floor(freeRooms.length / 2) - 1; i >= 0; i--) freeSiftDown(i);

  const busySiftUp = (i: number): void => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (
        busyRooms[i][0] < busyRooms[p][0] ||
        (busyRooms[i][0] === busyRooms[p][0] && busyRooms[i][1] < busyRooms[p][1])
      ) {
        [busyRooms[i], busyRooms[p]] = [busyRooms[p], busyRooms[i]];
        i = p;
      } else break;
    }
  };
  const busySiftDown = (i: number): void => {
    const len = busyRooms.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1,
        r = 2 * i + 2;
      if (
        l < len &&
        (busyRooms[l][0] < busyRooms[s][0] ||
          (busyRooms[l][0] === busyRooms[s][0] && busyRooms[l][1] < busyRooms[s][1]))
      )
        s = l;
      if (
        r < len &&
        (busyRooms[r][0] < busyRooms[s][0] ||
          (busyRooms[r][0] === busyRooms[s][0] && busyRooms[r][1] < busyRooms[s][1]))
      )
        s = r;
      if (s !== i) {
        [busyRooms[i], busyRooms[s]] = [busyRooms[s], busyRooms[i]];
        i = s;
      } else break;
    }
  };

  for (const [start, end] of meetings) {
    // 释放已结束的房间
    while (busyRooms.length > 0 && busyRooms[0][0] <= start) {
      const [, room] = busyRooms[0];
      busyRooms[0] = busyRooms[busyRooms.length - 1];
      busyRooms.pop();
      if (busyRooms.length > 0) busySiftDown(0);
      freeRooms.push(room);
      freeSiftDown(freeRooms.length - 1);
      // siftUp for the newly added element
      let idx = freeRooms.length - 1;
      while (idx > 0) {
        const p = (idx - 1) >> 1;
        if (freeRooms[idx] < freeRooms[p]) {
          [freeRooms[idx], freeRooms[p]] = [freeRooms[p], freeRooms[idx]];
          idx = p;
        } else break;
      }
    }
    if (freeRooms.length > 0) {
      const room = freeRooms[0];
      freeRooms[0] = freeRooms[freeRooms.length - 1];
      freeRooms.pop();
      if (freeRooms.length > 0) freeSiftDown(0);
      count[room]++;
      busyRooms.push([end, room]);
      busySiftUp(busyRooms.length - 1);
    } else {
      // 延迟到最早的房间空闲
      const [endTime, room] = busyRooms[0];
      busyRooms[0] = busyRooms[busyRooms.length - 1];
      busyRooms.pop();
      if (busyRooms.length > 0) busySiftDown(0);
      count[room]++;
      const newEnd = endTime + (end - start);
      busyRooms.push([newEnd, room]);
      busySiftUp(busyRooms.length - 1);
    }
  }
  let maxCount = 0;
  let result = 0;
  for (let i = 0; i < n; i++) {
    if (count[i] > maxCount) {
      maxCount = count[i];
      result = i;
    }
  }
  return result;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 132. 会议室 III =====");
console.log(
  "双堆:",
  mostBooked(2, [
    [0, 10],
    [1, 5],
    [2, 7],
    [3, 4],
  ]),
); // 期望 0
console.log(
  "双堆:",
  mostBooked(3, [
    [1, 20],
    [2, 10],
    [3, 5],
    [4, 9],
    [6, 8],
  ]),
); // 期望 1

export {};
