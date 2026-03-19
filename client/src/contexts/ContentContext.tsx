import React, { createContext, useContext, useEffect, useState } from "react";

interface ContentState {
  data: any;
  loading: boolean;
  updateContent: (newData: any) => Promise<void>;
}

const defaultContent = {
  hero: {
    badge: "Witaj w Fachowo.net.pl",
    title: "Fachowo – Usługi Budowlane <br className=\"hidden sm:block\" /> i Transportowe Poznań & Warszawa",
    subtitle: "Szybkie i niezawodne usługi remontowe, transportowe i sprzątające dla Twojego domu i biura.",
    ctaText: "Poproś o wycenę",
  },
  about: {
    badge: "O Nas",
    title: "Fachowość poparta <br className=\"hidden sm:block\" /> doświadczeniem",
    description: "Fachowo.net.pl to zespół specjalistów z pasją realizujących usługi budowlane, remontowe i transportowe. Dostarczamy solidne wyniki, dbając o każdy detal Twojego projektu.",
    highlights: [
      "Zadowoleni klienci",
      "Przejrzysta komunikacja"
    ],
    stats: {
      years: "10",
      clients: "150",
      projects: "500"
    }
  }
};

const ContentContext = createContext<ContentState>({
  data: defaultContent,
  loading: true,
  updateContent: async () => {},
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(fetchedData => {
        // Zabezpieczenie przed pustym obiektem
        if (fetchedData && Object.keys(fetchedData).length > 0) {
          setData(fetchedData);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateContent = async (newData: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newData)
      });
      
      if (res.ok) {
        const result = await res.json();
        setData(result.content);
      }
    } catch (e) {
      console.error("Błąd zapisywania treści", e);
      throw e;
    }
  };

  return (
    <ContentContext.Provider value={{ data, loading, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
