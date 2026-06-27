import { Employee, SuratTugas, SPPD } from "./types";

/**
 * Formats a Date string (YYYY-MM-DD) into Indonesian formal date
 * Example: 2026-06-24 -> 24 Juni 2026
 */
export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10).toString();

    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    if (monthIndex < 0 || monthIndex > 11) return dateStr;
    return `${day} ${months[monthIndex]} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

/**
 * Exports JSON data to CSV and triggers a download
 */
export function exportToCSV(filename: string, headers: string[], rows: string[][]) {
  const csvContent =
    "data:text/csv;charset=utf-8,\uFEFF" +
    [headers.join(","), ...rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Helper to generate random ID
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Helper to calculate age from birthdate
 */
export function calculateAge(birthDateStr: string): string {
  if (!birthDateStr) return "-";
  try {
    const today = new Date();
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} Tahun`;
  } catch (e) {
    return "-";
  }
}

/**
 * Helper to suggest the next Surat Tugas or SPPD number based on existing database records.
 * It dynamically extracts the sequence number, finds the maximum, and applies the current date's
 * month (Roman) and year for a polished, correct outcome.
 */
export function getNextLetterNumber(
  existingNumbers: string[],
  defaultPrefix: string,
  defaultSuffix: string,
  startFrom: number
): { nextNumber: string; lastNumber: string | null; lastSequence: number } {
  const romanMonths = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const curMonthRoman = romanMonths[curDate.getMonth()];

  let maxSeq = startFrom - 1;
  let lastNumber: string | null = null;

  existingNumbers.forEach(numStr => {
    if (!numStr) return;
    const parts = numStr.split("/").map(p => p.trim());
    if (parts.length >= 2) {
      const seq = parseInt(parts[1], 10);
      if (!isNaN(seq)) {
        if (seq > maxSeq) {
          maxSeq = seq;
          lastNumber = numStr;
        }
      }
    }
  });

  // If no sequence was parsed or it matched our fallback logic, we fall back to the most recent in array if any
  if (!lastNumber && existingNumbers.length > 0) {
    lastNumber = existingNumbers[0];
  }

  const nextSeq = maxSeq + 1;
  const nextNumber = `${defaultPrefix} / ${nextSeq} / ${defaultSuffix} / ${curMonthRoman} / ${curYear}`;

  return {
    nextNumber,
    lastNumber,
    lastSequence: maxSeq === startFrom - 1 ? 0 : maxSeq
  };
}

