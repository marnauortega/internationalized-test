import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 60;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <ul>
            <li>
              <Link href="/ca">Català</Link>
            </li>
            <li>
              <Link href="/es">Español</Link>
            </li>
            <li>
              <Link href="/en">English</Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
