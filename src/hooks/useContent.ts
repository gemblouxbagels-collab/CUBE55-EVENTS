import { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { DEFAULT_CONTENT, type SiteContent } from "@/content/defaultContent";

export function useContent() {
  const [content, setContentState] = useState<SiteContent>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  // Écouter les changements en temps réel depuis Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "site", "content"), (docSnap) => {
      if (docSnap.exists()) {
        setContentState({ ...DEFAULT_CONTENT, ...(docSnap.data() as Partial<SiteContent>) });
      }
      setLoading(false);
    }, (error) => {
      console.error("Erreur Firestore :", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Sauvegarder dans Firebase
  const setContent = useCallback(async (next: SiteContent) => {
    try {
      setContentState(next); // update optimistic
      await setDoc(doc(db, "site", "content"), next);
    } catch (error) {
      console.error("Erreur de sauvegarde :", error);
    }
  }, []);

  const resetContent = useCallback(async () => {
    await setDoc(doc(db, "site", "content"), DEFAULT_CONTENT);
    setContentState(DEFAULT_CONTENT);
  }, []);

  return { content, setContent, resetContent, loading };
}
