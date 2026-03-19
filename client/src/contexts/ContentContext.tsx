import React, { createContext, useContext, useEffect, useState } from "react";

interface ContentState {
  data: any;
  loading: boolean;
  updateContent: (newData: any) => Promise<void>;
}

const ContentContext = createContext<ContentState | null>(null);

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
  },
  contact: {
    phoneMain: "+48 123 456 789",
    emailMain: "kontakt@fachowo.net.pl",
    branchPoznanPhone: "+48 61 345 67 89",
    branchPoznanHours: "Pn-Pt: 8:00 - 18:00",
    branchWarszawaPhone: "+48 22 987 65 43",
    branchWarszawaHours: "Pn-Pt: 8:00 - 18:00"
  }
};

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Add timestamp to prevent caching
        const res = await fetch(`/api/content?t=${Date.now()}`);
        const fetchedData = await res.json();
        if (fetchedData && Object.keys(fetchedData).length > 0) {
          setData(fetchedData);
        } else {
          setData(defaultContent);
        }
      } catch (e) {
        console.error("Błąd pobierania treści", e);
        setData(defaultContent);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
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
      } else {
        throw new Error("Failed to update content");
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
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
}
