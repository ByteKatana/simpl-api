import Redis, { RedisOptions } from "ioredis"

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379"

const getRedisOptions = (): RedisOptions => {
  const options: RedisOptions = {
    // Exponential backoff retry strategy
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000)
      return delay
    },
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
    reconnectOnError: (err) => {
      const targetError = "READONLY"
      if (err.message.includes(targetError)) {
        return true
      }
      return false
    }
  }

  // TLS for production environments (rediss://)
  if (REDIS_URL.startsWith("rediss://")) {
    options.tls = {
      rejectUnauthorized: process.env.NODE_ENV === "production"
    }
  }

  return options
}

const redisClientSingleton = () => {
  const client = new Redis(REDIS_URL, getRedisOptions())

  // Connection monitoring
  client.on("connect", () => console.info("Redis: Connecting..."))
  client.on("ready", () => console.info("Redis: Client ready"))
  client.on("error", (err) => console.error("Redis: Error", err))
  client.on("reconnecting", () => console.warn("Redis: Reconnecting..."))

  // Atomic Lua script for rate limiting against race conditions
  client.defineCommand("rateLimitAtomic", {
    numberOfKeys: 1,
    lua: `
      local key = KEYS[1]
      local now = tonumber(ARGV[1])
      local windowMs = tonumber(ARGV[2])
      local maxRequests = tonumber(ARGV[3])
      local minIntervalMs = tonumber(ARGV[4])

      local data = redis.call('GET', key)
      local record

      if data then
          record = cjson.decode(data)
      else
          record = {count = 0, resetTime = now + windowMs, lastRequestTime = 0}
      end

      -- 1. Check Minimum Time Interval
      if minIntervalMs > 0 and record.lastRequestTime > 0 then
          local diff = now - record.lastRequestTime
          if diff < minIntervalMs then
              return {0, record.count, record.resetTime, minIntervalMs - diff, "INTERVAL"}
          end
      end

      -- 2. Check Window-based Limit
      if now > record.resetTime then
          record.count = 1
          record.resetTime = now + windowMs
      else
          record.count = record.count + 1
      end

      record.lastRequestTime = now

      if record.count > maxRequests then
          -- Save state even if limited to keep lastRequestTime and count accurate
          redis.call('SET', key, cjson.encode(record), 'PX', math.max(0, record.resetTime - now))
          return {0, record.count, record.resetTime, record.resetTime - now, "WINDOW"}
      end

      -- 3. Success - Update state in Redis
      redis.call('SET', key, cjson.encode(record), 'PX', math.max(0, record.resetTime - now))
      return {1, record.count, record.resetTime, 0, ""}
    `
  })

  return client
}

// Extend Redis type to include the custom atomic command
declare module "ioredis" {
  interface Redis {
    rateLimitAtomic(
      key: string,
      now: number,
      windowMs: number,
      maxRequests: number,
      minIntervalMs: number
    ): Promise<[number, number, number, number, string]>
  }
}

declare global {
  // eslint-disable-next-line no-var
  var redis: undefined | ReturnType<typeof redisClientSingleton>
}

const redis = globalThis.redis ?? redisClientSingleton()

export default redis

if (process.env.NODE_ENV !== "production") {
  globalThis.redis = redis
}
