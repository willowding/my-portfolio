import { NextResponse, type NextRequest } from "next/server";

/**
 * 在每个请求注入 x-pathname header，供根 layout 读出以切 <html lang="zh|en">。
 * 不做路径重写 / 重定向 / locale 协商 —— 仅做 header 注入。
 */
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("x-pathname", req.nextUrl.pathname);
  return res;
}

export const config = {
  // 跑在除 _next/static 与 _next/image 与 favicon 外的所有路径上
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};