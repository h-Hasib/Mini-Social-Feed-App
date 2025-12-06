import { Request, Response, NextFunction } from "express";
import ratelimit from "../config/upstash";

const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ip = req.ip || "anonymous";

    const result = await ratelimit.limit(ip);

    // headers for debugging
    res.setHeader("X-RateLimit-Limit", result.limit);
    res.setHeader("X-RateLimit-Remaining", result.remaining);

    if (!result.success) {
      return res.status(429).json({
        error: "Too Many Requests. Try again later."
      });
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    // allow request if Redis is down
    next();
  }
};

export default rateLimiter;
