// ============================================================
// 061. 设计推特
// ============================================================
// LeetCode 355. Design Twitter
// 设计一个简化的推特，支持 postTweet / getNewsFeed / follow / unfollow。
// getNewsFeed 返回用户自己及其关注者最近发布的推文（最多 10 条，按时间倒序）。
// 时间复杂度：postTweet/follow/unfollow O(1)，getNewsFeed O(U * log T) 其中 U 为关注者数量
// 空间复杂度：O(N)，N 为推文数与用户数之和

// 推文节点：带时间戳，便于按时间排序
interface Tweet {
  tweetId: number;
  time: number;
}

// 最大堆节点：用于多路归并取最近 10 条推文
interface HeapNode {
  tweet: Tweet;
  userId: number;
  // 当前用户推文链表中的下一个待选位置
  nextIdx: number;
}

class Twitter {
  // 全局递增时间戳，越大越新
  private timestamp: number;
  // 用户 -> 自己发布的推文列表（按时间倒序，最新在前）
  private userTweets: Map<number, Tweet[]>;
  // 用户 -> 关注集合（包含自己）
  private userFollowing: Map<number, Set<number>>;

  constructor() {
    this.timestamp = 0;
    this.userTweets = new Map();
    this.userFollowing = new Map();
  }

  // 确保用户存在，关注集合初始化时包含自己
  private ensureUser(userId: number): void {
    if (!this.userTweets.has(userId)) {
      this.userTweets.set(userId, []);
    }
    if (!this.userFollowing.has(userId)) {
      this.userFollowing.set(userId, new Set<number>([userId]));
    }
  }

  postTweet(userId: number, tweetId: number): void {
    this.ensureUser(userId);
    const tweet: Tweet = { tweetId, time: this.timestamp++ };
    // 头插法，保持最新推文在前
    this.userTweets.get(userId)!.unshift(tweet);
  }

  getNewsFeed(userId: number): number[] {
    this.ensureUser(userId);
    const following = this.userFollowing.get(userId)!;

    // 最大堆：按 time 比较
    const heap: HeapNode[] = [];
    for (const fid of following) {
      const tweets = this.userTweets.get(fid);
      if (tweets && tweets.length > 0) {
        heap.push({ tweet: tweets[0], userId: fid, nextIdx: 1 });
      }
    }
    // 建堆
    this.buildMaxHeap(heap);

    const result: number[] = [];
    while (heap.length > 0 && result.length < 10) {
      // 取堆顶（时间最新）
      const top = heap[0];
      result.push(top.tweet.tweetId);

      const tweets = this.userTweets.get(top.userId)!;
      if (top.nextIdx < tweets.length) {
        heap[0] = {
          tweet: tweets[top.nextIdx],
          userId: top.userId,
          nextIdx: top.nextIdx + 1,
        };
        this.siftDown(heap, 0);
      } else {
        // 该用户推文已耗尽，移除堆顶（用末尾替换）
        const last = heap.pop()!;
        if (heap.length > 0) {
          heap[0] = last;
          this.siftDown(heap, 0);
        }
      }
    }
    return result;
  }

  follow(followerId: number, followeeId: number): void {
    this.ensureUser(followerId);
    this.ensureUser(followeeId);
    this.userFollowing.get(followerId)!.add(followeeId);
  }

  unfollow(followerId: number, followeeId: number): void {
    if (followerId === followeeId) return; // 不能取关自己
    const set = this.userFollowing.get(followerId);
    if (set) {
      set.delete(followeeId);
    }
  }

  // ---------- 最大堆辅助方法 ----------
  private buildMaxHeap(heap: HeapNode[]): void {
    for (let i = Math.floor(heap.length / 2) - 1; i >= 0; i--) {
      this.siftDown(heap, i);
    }
  }

  private siftDown(heap: HeapNode[], idx: number): void {
    const n = heap.length;
    while (true) {
      let largest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;
      if (left < n && heap[left].tweet.time > heap[largest].tweet.time) {
        largest = left;
      }
      if (right < n && heap[right].tweet.time > heap[largest].tweet.time) {
        largest = right;
      }
      if (largest === idx) break;
      [heap[idx], heap[largest]] = [heap[largest], heap[idx]];
      idx = largest;
    }
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 061. 设计推特 =====");

// 测试 1：基本发推与获取
const twitter1 = new Twitter();
twitter1.postTweet(1, 5); // 用户 1 发推 5
// 用户 1 的 newsFeed 应为 [5]
console.log("test1 getNewsFeed:", JSON.stringify(twitter1.getNewsFeed(1))); // 期望 [5]

// 测试 2：关注与取消关注
const twitter2 = new Twitter();
twitter2.postTweet(1, 10);
twitter2.postTweet(2, 20);
twitter2.follow(1, 2); // 用户 1 关注用户 2
// newsFeed 应包含两条，最新 20 在前
console.log("test2 getNewsFeed:", JSON.stringify(twitter2.getNewsFeed(1))); // 期望 [20,10]
twitter2.unfollow(1, 2); // 取消关注
console.log("test2 after unfollow:", JSON.stringify(twitter2.getNewsFeed(1))); // 期望 [10]

// 测试 3：多推文取最新 10 条
const twitter3 = new Twitter();
for (let i = 0; i < 12; i++) {
  twitter3.postTweet(1, 100 + i);
}
const feed3 = twitter3.getNewsFeed(1);
console.log("test3 feed length:", feed3.length); // 期望 10
console.log("test3 feed:", JSON.stringify(feed3)); // 期望最新 10 条 [111,110,...,102]

export {};
