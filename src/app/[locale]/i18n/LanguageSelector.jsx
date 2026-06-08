"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Select from "react-select";
import { useEffect, useState } from "react";

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("language");
  const lan = pathname.split("/")[1];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lang) => {
    const newPath = pathname.replace(/^\/(ar|en)/, `/${lang}`);
    router.push(newPath);
  };

    const options = [
        {
            value: "ar",
            label: (
                <span style={{ display: "flex", alignItems: "center" }}>
                <img
                    src="/images/egypt.webp"
                    alt="Egypt"
                    style={{ width: "20px", margin: "0 8px" }}
                />
                    عربي
                </span>
            ),
        },
        {
        value: "en",
        label: (
            <span style={{ display: "flex", alignItems: "center" }}>
            <img
                src="/images/usa.png"
                alt="USA"
                style={{ width: "20px", margin: "0 8px" }}
            />
            English
            </span>
        ),
        },
    ];

  const defaultOption = options.find(option => option.value === lan) || null;

  if (!mounted) return null; // يمنع Hydration Error

  return (
    <div className="lang">
      <Select
        options={options}
        defaultValue={defaultOption}
        onChange={(option) => changeLanguage(option.value)}
        isSearchable={false}
      />
    </div>
  );
}
