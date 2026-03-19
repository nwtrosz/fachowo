import React, { createContext, useContext, useEffect, useState } from "react";

interface ContentState {
  data: any;
  loading: boolean;
  updateContent: (newData: any) => Promise<void>;
}

const ContentContext = createContext<ContentState | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content');
        const fetchedData = await res.json();
        if (fetchedData && Object.keys(fetchedData).length > 0) {
          setData(fetchedData);
        }
      } catch (e) {
        console.error("Błąd pobierania treści", e);
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
