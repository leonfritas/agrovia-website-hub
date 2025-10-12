"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SaveScrollPosition() {
  const pathname = usePathname();

  useEffect(() => {
    // Salvar posição de scroll ao navegar
    const handleScroll = () => {
      if (!pathname?.startsWith('/post/')) {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Restaurar posição ao voltar
    const returningFromPost = sessionStorage.getItem('returningFromPost');
    if (returningFromPost === 'true') {
      sessionStorage.removeItem('returningFromPost');
      
      // Aguardar um pouco para a página renderizar
      setTimeout(() => {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition) {
          const position = parseInt(savedPosition, 10);
          console.log('📍 Restaurando scroll para:', position);
          window.scrollTo({
            top: position,
            behavior: 'smooth'
          });
        }
      }, 100);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return null;
}
