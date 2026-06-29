// ============================================================
// 011. 设计推特
// ============================================================
// LeetCode 355. Design Twitter
// 设计一个简化版的推特，支持 postTweet、getNewsFeed、follow、unfollow。
// 时间复杂度：getNewsFeed O(F * 10)，F 为关注数

class Twitter {
  private tweets: Map<number, Array<{ id: number; time: number }>> = new Map();
  private following: Map<number, Set<number>> = new Map();
  private time = 0;

  postTweet(userId: number, tweetId: number): void {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId)!.push({ id: tweetId, time: this.time++ });
  }

  getNewsFeed(userId: number): number[] {
    const users = new Set<number>(this.following.get(userId) ?? []);
    users.add(userId);
    const heap: Array<{ id: number; time: number; uid: number; idx: number }> = [];
    const siftUp = (i: number): void => {
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (heap[i].time > heap[p].time) {
          [heap[i], heap[p]] = [heap[p], heap[i]];
          i = p;
        } else break;
      }
    };
    const siftDown = (i: number): void => {
      const n = heap.length;
      while (true) {
        let s = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < n && heap[l].time > heap[s].time) s = l;
        if (r < n && heap[r].time > heap[s].time) s = r;
        if (s !== i) {
          [heap[i], heap[s]] = [heap[s], heap[i]];
          i = s;
        } else break;
      }
    };
    for (const uid of users) {
      const list = this.tweets.get(uid);
      if (list !== undefined && list.length > 0) {
        const idx = list.length - 1;
        heap.push({ id: list[idx].id, time: list[idx].time, uid, idx });
        siftUp(heap.length - 1);
      }
    }
    const res: number[] = [];
    while (heap.length > 0 && res.length < 10) {
      const top = heap[0];
      res.push(top.id);
      const last = heap.pop()!;
      if (heap.length > 0) {
        heap[0] = last;
        siftDown(0);
      }
      const list = this.tweets.get(top.uid)!;
      if (top.idx > 0) {
        const nextIdx = top.idx - 1;
        heap.push({ id: list[nextIdx].id, time: list[nextIdx].time, uid: top.uid, idx: nextIdx });
        siftUp(heap.length - 1);
      }
    }
    return res;
  }

  follow(followerId: number, followeeId: number): void {
    if (!this.following.has(followerId)) this.following.set(followerId, new Set());
    this.following.get(followerId)!.add(followeeId);
  }

  unfollow(followerId: number, followeeId: number): void {
    this.following.get(followerId)?.delete(followeeId);
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 011. 设计推特 =====");
const tw = new Twitter();
tw.postTweet(1, 5);
console.log("feed:", tw.getNewsFeed(1)); // 期望 [5]
tw.follow(1, 2);
tw.postTweet(2, 6);
console.log("feed:", tw.getNewsFeed(1)); // 期望 [6,5]
tw.unfollow(1, 2);
console.log("feed:", tw.getNewsFeed(1)); // 期望 [5]

export {};
