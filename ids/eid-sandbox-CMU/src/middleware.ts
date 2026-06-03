// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("auth_token")?.value;
//   const role =
//     req.cookies.get("user_role")?.value?.toLowerCase() ?? "issuer";

//   const { pathname } = req.nextUrl;

//   const isProtected =
//     pathname.startsWith("/dashboard") ||
//     pathname.startsWith("/profile");

//   const isLoginPage = pathname === "/login";
//   const isSignupPage = pathname === "/signup";
//   const isRootPage = pathname === "/";

//   /* ───────── 1️⃣ Protected route, no token ───────── */

//   if (isProtected && !token) {
//     const rootUrl = new URL("/", req.url);
//     rootUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(rootUrl);
//   }

//   /* ───────── 2️⃣ Root route handling ───────── */

//   if (isRootPage) {
//     // ❗ NO token → STAY on /
//     if (!token) {
//       return NextResponse.next();
//     }

//     // token present → dashboard
//     return NextResponse.redirect(
//       new URL(`/dashboard/${role}`, req.url)
//     );
//   }

//   /* ───────── 3️⃣ Auth pages ───────── */

//   if ((isLoginPage || isSignupPage) && token) {
//     return NextResponse.redirect(
//       new URL(`/dashboard/${role}`, req.url)
//     );
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/",
//     "/login",
//     "/signup",
//     "/dashboard/:path*",
//     "/profile/:path*",
//   ],
// };
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("🧪 middleware hit:", req.nextUrl.pathname);

  // ❌ no auth checks
  // ❌ no redirects
  // ❌ no cookie logic

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // runs on everything
};
