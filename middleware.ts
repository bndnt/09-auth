import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";
import { parse } from "cookie";

//privateRoutes - масив у якому ми будемо перечісляти приватні сторінки
const privateRoutes = ["/profile"];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  //pathname перевірка юрл чи мечиться з прайват роутс
  const { pathname } = request.nextUrl;

  //some перевіряє чи хоча б один елемент з масиву задовільняє умову
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (isPrivateRoute) {
    if (!accessToken) {
      if (!refreshToken) {
        return NextResponse.redirect(new URL("/signin", request.url));
      } else {
        //перевірка сессії для кукі, що ми передаємо. Запит до нашого веб сервера на який робили запити для логіну та реєстрації
        const response = await axios.get(
          "https://next-v1-notes-api.goit.study/auth/session",
          {
            headers: {
              Cookie: cookieStore.toString(),
            },
          }
        );
        // Витягаємо кукі
        const setCookie = response.headers["set-cookie"];
        // set up cookies
        if (setCookie) {
          const cookieArray = Array.isArray(setCookie)
            ? setCookie
            : [setCookie];
          // парсимо кукі
          for (const cookie of cookieArray) {
            const parsed = parse(cookie);
            const options = {
              expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              path: parsed.Path,
              maxAge: Number(parsed["Max-Age"]),
            };
            //сетапимо кукі
            if (parsed.accessToken) {
              cookieStore.set("accessToken", parsed.accessToken, options);
            }
            //сепапимо кукі
            if (parsed.refreshToken) {
              cookieStore.set("refreshToken", parsed.refreshToken, options);
            }
          }
        }
        //next() - пропускає далі у відповідь користувачеві
        return NextResponse.next({
          // for refresh cookie
          headers: {
            Cookie: cookieStore.toString(),
          },
        });
      }
    } else {
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

export const config = {
  matchers: ["/profile"],
};
