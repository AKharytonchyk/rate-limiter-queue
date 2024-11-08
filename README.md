
# RateLimiterQueue

`RateLimiterQueue` is a lightweight, TypeScript-based rate limiter designed to help manage API requests in a queue, ensuring that no more than a specified number of requests are processed per minute. The class makes it easy to handle large volumes of requests without breaching rate limits.

## Features

- **Enqueue Requests**: Queue up requests and ensure they are processed at a controlled rate.
- **Request Limits**: Set a maximum number of requests per minute to comply with API rate limits.
- **Automatic Cleanup**: Old request timestamps are periodically removed to maintain accurate rate limiting.
- **Error Handling**: Each request in the queue can fail independently without affecting other requests.
- **Batch Processing**: Enqueue an array of requests to be processed with a single call.

## Installation

To install this package, use npm:

```bash
npm install rate-limiter-queue
```

## Usage

### Importing and Instantiation

```typescript
import RateLimiterQueue from 'rate-limiter-queue';

const rateLimiter = new RateLimiterQueue(60); // Limit to 60 requests per minute
```

### Enqueuing Requests

The `enqueue` method allows you to add requests to the queue. Each request will be processed according to the rate limit.

```typescript
const fetchData = async () => {
  // Your async operation, e.g., fetch or axios call
};

rateLimiter.enqueue(fetchData).then((response) => {
  console.log("Request completed:", response);
}).catch((error) => {
  console.error("Request failed:", error);
});
```

### Batch Processing

The `processAll` method allows you to process multiple requests at once, adhering to the rate limit:

```typescript
const requests = [
  async () => await fetchData(),
  async () => await fetchData(),
  // More request functions
];

rateLimiter.processAll(requests).then((results) => {
  console.log("All requests completed:", results);
}).catch((error) => {
  console.error("Error processing batch:", error);
});
```

### API

#### Constructor
```typescript
new RateLimiterQueue(maxRequestsPerMinute: number)
```
- **maxRequestsPerMinute**: Maximum number of requests allowed per minute.

#### Methods
- **enqueue(requestFunction: () => Promise<T>): Promise<T>**  
  Adds a request function to the queue. Returns a promise that resolves with the request's result.

- **processAll(requestFunctions: Array<() => Promise<T>>): Promise<T[]>**  
  Accepts an array of request functions to process as a batch, adhering to the rate limit. Returns a promise that resolves with an array of results.

## Example

```typescript
const rateLimiter = new RateLimiterQueue(10); // 10 requests per minute

const requests = Array.from({ length: 15 }, (_, i) => async () => {
  console.log(`Processing request ${i + 1}`);
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
});

rateLimiter.processAll(requests).then(results => {
  console.log("Finished processing all requests.");
});
```

## License

MIT
