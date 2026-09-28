'use client';

import { useEffect, useState } from 'react';
import { useReferralTracking } from '@/hooks/use-referral-tracking';
import { registerReferralPoint } from '@/lib/referral-service';

export function ReferralTracker() {
  const [isMounted, setIsMounted] = useState(false);
  const { refKey, isQualifiedVisit, visitorHash } = useReferralTracking();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Solo ejecutar después de montar en el cliente
    if (!isMounted) return;

    // Cuando la visita califica, registrar el punto de forma asíncrona
    if (isQualifiedVisit && refKey && visitorHash) {
      // Usar setTimeout para no bloquear la carga de la página
      const timer = setTimeout(async () => {
        try {
          await registerReferralPoint(refKey, visitorHash);
        } catch (error) {
          console.error('Error registrando punto de referido:', error);
        }
      }, 1000); // Esperar 1 segundo antes de registrar

      return () => clearTimeout(timer);
    }
  }, [isMounted, isQualifiedVisit, refKey, visitorHash]);

  // Este componente no renderiza nada visible
  return null;
}