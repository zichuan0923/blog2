export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/home", "/posts/:path*", "/profile"],
};