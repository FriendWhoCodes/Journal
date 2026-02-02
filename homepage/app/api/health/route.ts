import { NextResponse } from "next/server";

interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    name: string;
    status: "pass" | "fail";
    message?: string;
  }[];
}

const startTime = Date.now();

export async function GET() {
  const checks: HealthCheckResponse["checks"] = [];

  // Check 1: Basic runtime
  checks.push({
    name: "runtime",
    status: "pass",
    message: "Next.js runtime is operational",
  });

  // Check 2: Environment
  const isProduction = process.env.NODE_ENV === "production";
  checks.push({
    name: "environment",
    status: "pass",
    message: `Running in ${process.env.NODE_ENV} mode`,
  });

  // Check 3: Memory usage
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const memoryHealthy = heapUsedMB < heapTotalMB * 0.9; // Less than 90% used

  checks.push({
    name: "memory",
    status: memoryHealthy ? "pass" : "fail",
    message: `Heap: ${heapUsedMB}MB / ${heapTotalMB}MB`,
  });

  // Determine overall status
  const failedChecks = checks.filter((c) => c.status === "fail");
  let status: HealthCheckResponse["status"] = "healthy";
  if (failedChecks.length > 0) {
    status = failedChecks.length === checks.length ? "unhealthy" : "degraded";
  }

  const response: HealthCheckResponse = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: Math.round((Date.now() - startTime) / 1000),
    checks,
  };

  const httpStatus = status === "healthy" ? 200 : status === "degraded" ? 200 : 503;

  return NextResponse.json(response, { status: httpStatus });
}
