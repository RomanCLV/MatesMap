// hooks/useSafeNavigation.ts
import { useRef, useCallback } from 'react';
import { useRouter } from 'expo-router';

type NavigationCallback = () => void;

/**
 * Hook pour créer des gestionnaires de navigation sécurisés contre les double-taps.
 * Utilise un timestamp global partagé entre tous les handlers créés par ce hook.
 * 
 * @param delay - Délai minimum en ms entre deux navigations (défaut: 500ms)
 * @returns Un objet avec des méthodes pour créer des handlers de navigation
 * 
 * @example
 * const { createHandler, navigate } = useSafeNavigation();
 * 
 * // Utilisation directe
 * <Button onPress={navigate('settings/theme')} />
 * 
 * // Avec callback personnalisé
 * const handlePress = createHandler(() => {
 *   console.log('Navigation...');
 *   router.push('settings/theme');
 * });
 */
export const useSafeNavigation = (delay: number = 500) => {
  const router = useRouter();
  const lastNavigationTime = useRef(0);

  /**
   * Crée un handler sécurisé pour n'importe quelle fonction
   */
  const createHandler = useCallback(
    (callback: NavigationCallback) => {
      return () => {
        const now = Date.now();
        if (now - lastNavigationTime.current < delay) {
          return;
        }
        lastNavigationTime.current = now;
        callback();
      };
    },
    [delay]
  );

  /**
   * Crée un handler de navigation vers une route spécifique
   */
  const navigate = useCallback(
    (href: string) => {
      return createHandler(() => {
        router.push(href);
      });
    },
    [router, createHandler]
  );

  /**
   * Crée un handler pour revenir en arrière
   */
  const goBack = useCallback(() => {
    return createHandler(() => {
      router.back();
    });
  }, [router, createHandler]);

  /**
   * Crée un handler pour remplacer la route actuelle
   */
  const replace = useCallback(
    (href: string) => {
      return createHandler(() => {
        router.replace(href);
      });
    },
    [router, createHandler]
  );

  return {
    createHandler,
    navigate,
    goBack,
    replace,
  };
};
