// ============================================================
// 117. 设计视频共享平台
// ============================================================
// LeetCode 2334. Design Video Sharing Platform
// 视频上传、删除、观看，管理可用 ID。
// 时间复杂度：upload O(log N)，remove O(log N)，watch O(L)

// 方法1：最小堆管理可用 ID
class VideoSharingPlatform {
  private videos: Map<number, string> = new Map();
  private views: Map<number, number> = new Map();
  private available: number[] = []; // 最小堆
  private nextId = 0;
  private pushAvail(v: number): void {
    this.available.push(v);
    let i = this.available.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.available[i] < this.available[p]) { [this.available[i], this.available[p]] = [this.available[p], this.available[i]]; i = p; } else break;
    }
  }
  private popAvail(): number {
    const top = this.available[0];
    const last = this.available.pop()!;
    if (this.available.length > 0) {
      this.available[0] = last;
      let i = 0;
      while (true) {
        let s = i;
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < this.available.length && this.available[l] < this.available[s]) s = l;
        if (r < this.available.length && this.available[r] < this.available[s]) s = r;
        if (s !== i) { [this.available[i], this.available[s]] = [this.available[s], this.available[i]]; i = s; } else break;
      }
    }
    return top;
  }
  upload(video: string): number {
    let id: number;
    if (this.available.length === 0) {
      id = this.nextId++;
    } else {
      id = this.popAvail();
    }
    this.videos.set(id, video);
    this.views.set(id, 0);
    return id;
  }
  remove(videoId: number): void {
    if (this.videos.has(videoId)) {
      this.videos.delete(videoId);
      this.views.delete(videoId);
      this.pushAvail(videoId);
    }
  }
  watch(videoId: number, startMinute: number, endMinute: number): string {
    const video = this.videos.get(videoId);
    if (video === undefined) return "-1";
    const start = Math.min(startMinute, video.length);
    const end = Math.min(endMinute + 1, video.length);
    this.views.set(videoId, (this.views.get(videoId) ?? 0) + 1);
    return video.slice(start, end);
  }
  like(videoId: number): void {
    // 简化：只记录观看
  }
  dislikes(videoId: number): void {
    // 简化
  }
  getLikesAndDislikes(videoId: number): number[] {
    return [0, 0];
  }
  getViews(videoId: number): number {
    return this.views.get(videoId) ?? -1;
  }
}

// ============================================================
// 测试
// ============================================================
console.log("===== 117. 设计视频共享平台 =====");
const vsp = new VideoSharingPlatform();
console.log("upload:", vsp.upload("12345")); // 期望 0
console.log("watch:", vsp.watch(0, 1, 3)); // 期望 "234"
console.log("views:", vsp.getViews(0)); // 期望 1
vsp.remove(0);
console.log("views:", vsp.getViews(0)); // 期望 -1

export {};
