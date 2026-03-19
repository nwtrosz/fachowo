import { useState } from 'react';

export function useContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (formData: any) => {
    if (loading || submitted) return { success: true }; // Block multiple clicks
    setLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        return { success: true };
      } else {
        const errorText = await response.text();
        return { success: false, error: errorText };
      }
    } catch (error) {
      console.error('Contact submit error:', error);
      return { success: false, error: 'Wystąpił błąd połączenia z serwerem.' };
    } finally {
      setLoading(false);
    }
  };

  return { submitted, setSubmitted, loading, submit };
}
