export default function Home({ params: { locale } }) {
  return (
    <main>
      {locale === "ca" && <p>Hola en Català</p>}
      {locale === "es" && <p>Hola en Español</p>}
      {locale === "en" && <p>Hello in English</p>}
    </main>
  );
}
