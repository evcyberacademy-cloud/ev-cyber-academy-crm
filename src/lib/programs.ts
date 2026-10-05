// Default baseline programs for EV Cyber Academy
export const DEFAULT_PROGRAMS: string[] = [
  'LFHP',
  'LFHP Mini',
  'LWAP',
  'AI Cyber Tool Building Workshop',
  'Internship',
  'Custom',
];

const CUSTOM_PROGRAMS_STORAGE_KEY = 'ev_crm_custom_programs';

/**
 * Get all available programs combining defaults, saved custom programs, and existing leads
 */
export function getStoredCustomPrograms(): string[] {
  try {
    const saved = localStorage.getItem(CUSTOM_PROGRAMS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter((p) => typeof p === 'string' && p.trim().length > 0);
      }
    }
  } catch (e) {
    console.error('Error reading custom programs:', e);
  }
  return [];
}

/**
 * Save a newly created program so it is permanently available in the dropdown
 */
export function saveCustomProgram(programName: string): string[] {
  const trimmed = programName.trim();
  if (!trimmed) return getStoredCustomPrograms();

  const current = getStoredCustomPrograms();
  if (!current.includes(trimmed) && !DEFAULT_PROGRAMS.includes(trimmed)) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem(CUSTOM_PROGRAMS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving custom program:', e);
    }
    return updated;
  }
  return current;
}

/**
 * Get full combined unique program options list
 */
export function getAllProgramOptions(leadPrograms: string[] = []): string[] {
  const custom = getStoredCustomPrograms();
  const fromLeads = leadPrograms.filter((p) => p && typeof p === 'string' && p.trim().length > 0);
  
  // Combine all without duplicates
  const set = new Set<string>([...DEFAULT_PROGRAMS, ...custom, ...fromLeads]);
  return Array.from(set);
}
