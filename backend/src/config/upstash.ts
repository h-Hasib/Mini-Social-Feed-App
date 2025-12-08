import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = Redis.fromEnv(); // loads from .env

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(400, "60 s"),
  analytics: true
});

export default ratelimit;
