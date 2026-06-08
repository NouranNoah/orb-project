import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "@/lib/locales";

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  let messages;
  try {
    messages = await getMessages({ locale });
  } catch {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div dir={locale === "ar" ? "rtl" : "ltr"}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
