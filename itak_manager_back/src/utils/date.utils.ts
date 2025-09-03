/**
 * Utilitaires pour la gestion des dates
 */

/**
 * Normalise une date (string | Date) en string ISO
 * @param date - La date à normaliser
 * @returns La date au format string ISO ou undefined si la date est invalide
 */
export function normalizeDate(
  date: string | Date | undefined,
): string | undefined {
  if (!date) return undefined;

  try {
    if (typeof date === 'string') {
      // Vérifier que la chaîne est une date valide
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return undefined;
      }
      return date;
    } else if (date instanceof Date) {
      // Convertir Date en string ISO
      return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
    }
  } catch (error) {
    return undefined;
  }

  return undefined;
}

/**
 * Convertit une date en objet Date
 * @param date - La date à convertir
 * @returns L'objet Date ou undefined si la date est invalide
 */
export function toDate(date: string | Date | undefined): Date | undefined {
  if (!date) return undefined;

  try {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        return undefined;
      }
      return parsedDate;
    } else if (date instanceof Date) {
      return date;
    }
  } catch (error) {
    return undefined;
  }

  return undefined;
}

/**
 * Vérifie si une date est valide
 * @param date - La date à vérifier
 * @returns true si la date est valide, false sinon
 */
export function isValidDate(date: string | Date | undefined): boolean {
  if (!date) return false;

  try {
    if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    } else if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
  } catch (error) {
    return false;
  }

  return false;
}

/**
 * Vérifie si une date est dans le futur
 * @param date - La date à vérifier
 * @returns true si la date est dans le futur, false sinon
 */
export function isFutureDate(date: string | Date | undefined): boolean {
  const normalizedDate = toDate(date);
  if (!normalizedDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return normalizedDate > today;
}

/**
 * Vérifie si une date de fin est après une date de début
 * @param startDate - La date de début
 * @param endDate - La date de fin
 * @returns true si endDate est après startDate, false sinon
 */
export function isEndDateAfterStartDate(
  startDate: string | Date | undefined,
  endDate: string | Date | undefined,
): boolean {
  if (!startDate || !endDate) return true; // Si une des dates est undefined, c'est valide

  const start = toDate(startDate);
  const end = toDate(endDate);

  if (!start || !end) return false;

  return end >= start;
}
