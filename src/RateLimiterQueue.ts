class RateLimiterQueue {
  private queue: Array<() => Promise<void>>;
  private maxRequestsPerMinute: number;
  private activeRequests: number;
  private requestTimestamps: number[];

  constructor(maxRequestsPerMinute: number) {
    this.queue = [];
    this.maxRequestsPerMinute = maxRequestsPerMinute;
    this.activeRequests = 0;
    this.requestTimestamps = [];

    setInterval(() => {
      this.cleanupOldTimestamps();
      const estimatedTime = this.queue.length / this.maxRequestsPerMinute;
      console.debug(`Queue size: ${this.queue.length}. Rate limit: ${maxRequestsPerMinute}. Estimated time: ${estimatedTime.toFixed(2)} minutes.`);
    }, 60000);
  }

  async enqueue<T>(requestFunction: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          this.activeRequests++;
          const result = await requestFunction();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.requestTimestamps.push(Date.now());
          this.processQueue();
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    this.cleanupOldTimestamps();

    while (this.queue.length > 0 && this.canProcessMoreRequests()) {
      const requestFunction = this.queue.shift();
      if (requestFunction) {
        requestFunction().catch((error) => {
          console.error("Error processing request:", error);
        });
      }
    }
  }

  private canProcessMoreRequests(): boolean {
    return this.requestTimestamps.length < this.maxRequestsPerMinute;
  }

  private cleanupOldTimestamps() {
    const oneMinuteAgo = Date.now() - 60000;
    this.requestTimestamps = this.requestTimestamps.filter(timestamp => timestamp > oneMinuteAgo);
  }

  async processAll<T>(requestFunctions: Array<() => Promise<T>>): Promise<T[]> {
    const results = requestFunctions.map((requestFunction) => this.enqueue(requestFunction));
    return Promise.all(results);
  }
}

export default RateLimiterQueue;
