// ============================================================
// 144. 过桥的时间
// ============================================================
// LeetCode 2532. Time Taken to Cross the Door
// 工人在左右两岸交替过桥，模拟过桥过程。
// 时间复杂度：O(n log n)，空间复杂度：O(n)

// 方法1：模拟 + 双堆
function findCrossingTime(n: number, k: number, time: number[][]): number {
  // time[i] = [leftToRight, pickOld, rightToLeft, putNew]
  // 等待中的工人堆：效率高的优先
  const waitLeft: Array<[number, number]> = []; // [priority, idx]
  const waitRight: Array<[number, number]> = [];
  // 工作中的工人堆：[完成时间, idx]
  const workLeft: Array<[number, number]> = [];
  const workRight: Array<[number, number]> = [];

  const priority = (i: number): number => time[i][0] + time[i][2];

  const pushWL = (item: [number, number]): void => {
    waitLeft.push(item);
    let i = waitLeft.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (waitLeft[i][0] > waitLeft[p][0] ||
        (waitLeft[i][0] === waitLeft[p][0] && waitLeft[i][1] > waitLeft[p][1])) {
        [waitLeft[i], waitLeft[p]] = [waitLeft[p], waitLeft[i]];
        i = p;
      } else break;
    }
  };
  const popWL = (): [number, number] => {
    const top = waitLeft[0];
    waitLeft[0] = waitLeft[waitLeft.length - 1];
    waitLeft.pop();
    let i = 0;
    const n = waitLeft.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && (waitLeft[l][0] > waitLeft[s][0] ||
        (waitLeft[l][0] === waitLeft[s][0] && waitLeft[l][1] > waitLeft[s][1]))) s = l;
      if (r < n && (waitRight[r] && (waitLeft[r][0] > waitLeft[s][0] ||
        (waitLeft[r][0] === waitLeft[s][0] && waitLeft[r][1] > waitLeft[s][1])))) s = r;
      if (s !== i) { [waitLeft[i], waitLeft[s]] = [waitLeft[s], waitLeft[i]]; i = s; }
      else break;
    }
    return top;
  };
  const pushWR = (item: [number, number]): void => {
    waitRight.push(item);
    let i = waitRight.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (waitRight[i][0] > waitRight[p][0] ||
        (waitRight[i][0] === waitRight[p][0] && waitRight[i][1] > waitRight[p][1])) {
        [waitRight[i], waitRight[p]] = [waitRight[p], waitRight[i]];
        i = p;
      } else break;
    }
  };
  const popWR = (): [number, number] => {
    const top = waitRight[0];
    waitRight[0] = waitRight[waitRight.length - 1];
    waitRight.pop();
    let i = 0;
    const n = waitRight.length;
    while (true) {
      let s = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && (waitRight[l][0] > waitRight[s][0] ||
        (waitRight[l][0] === waitRight[s][0] && waitRight[l][1] > waitRight[s][1]))) s = l;
      if (r < n && (waitRight[r][0] > waitRight[s][0] ||
        (waitRight[r][0] === waitRight[s][0] && waitRight[r][1] > waitRight[s][1]))) s = r;
      if (s !== i) { [waitRight[i], waitRight[s]] = [waitRight[s], waitRight[i]]; i = s; }
      else break;
    }
    return top;
  };
  const pushWork = (heap: Array<[number, number]>, item: [number, number]): void => {
    heap.push(item);
    let i = heap.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heap[i][0] < heap[p][0]) { [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; }
      else break;
    }
  };
  const popWork = (heap: Array<[number, number]>): [number, number] => {
    const top = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();
    if (heap.length > 0) {
      let i = 0;
      const n = heap.length;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < n && heap[l][0] < heap[s][0]) s = l;
        if (r < n && heap[r][0] < heap[s][0]) s = r;
        if (s !== i) { [heap[i], heap[s]] = [heap[s], heap[i]]; i = s; }
        else break;
      }
    }
    return top;
  };

  for (let i = 0; i < k; i++) pushWL([priority(i), i]);
  let curTime = 0;
  let remaining = n;

  while (remaining > 0 || waitRight.length > 0 || workRight.length > 0) {
    // 释放完成的工人
    while (workLeft.length > 0 && workLeft[0][0] <= curTime) {
      const [, idx] = popWork(workLeft);
      pushWL([priority(idx), idx]);
    }
    while (workRight.length > 0 && workRight[0][0] <= curTime) {
      const [, idx] = popWork(workRight);
      pushWR([priority(idx), idx]);
    }
    if (waitRight.length > 0) {
      // 右岸优先过桥
      const [, idx] = popWR();
      curTime += time[idx][2];
      pushWork(workRight, [curTime + time[idx][3], idx]);
    } else if (remaining > 0 && waitLeft.length > 0) {
      const [, idx] = popWL();
      curTime += time[idx][0];
      remaining--;
      pushWork(workLeft, [curTime + time[idx][1], idx]);
    } else {
      // 跳到下一个事件
      let nextTime = Infinity;
      if (workLeft.length > 0) nextTime = Math.min(nextTime, workLeft[0][0]);
      if (workRight.length > 0) nextTime = Math.min(nextTime, workRight[0][0]);
      if (nextTime !== Infinity) curTime = nextTime;
    }
  }
  return curTime;
}

// ============================================================
// 测试
// ============================================================
console.log("===== 144. 过桥的时间 =====");
console.log("模拟:", findCrossingTime(1, 1, [[1, 1, 2, 1]])); // 期望 4
console.log("模拟:", findCrossingTime(3, 2, [[1, 9, 1, 8], [2, 10, 4, 6]])); // 期望 33

export {};
