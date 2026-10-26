import { computeAverage, EnrollmentStatus } from "./gradeUtils.js";
import getStatus from "./gradeUtils.js";

interface Enrollee {
  name: string;
  prelim: number;
  midterm: number;
  final: number;
}

interface EligibilityReport {
  name: string;
  average: number;
  status: EnrollmentStatus;
  remarks?: string;
}

const enrollees: Enrollee[] = [
  { name: "Ana Cruz", prelim: 85, midterm: 90, final: 88 },
  { name: "Bea Santos", prelim: 70, midterm: 65, final: 60 },
  { name: "Cid Ramos", prelim: 95, midterm: 92, final: 97 },
  { name: "Dex Alonzo", prelim: 60, midterm: 55, final: 50 },
  { name: "Eli Tan", prelim: 78, midterm: 80, final: 76 },
];

const SIMULATE_FAILURE: boolean = false;

const getEnrollees = (): Promise<Enrollee[]> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULATE_FAILURE) {
        reject(new Error("Unable to connect to the registrar API."));
      } else {
        resolve([...enrollees]);
      }
    }, 1000);
  });

const getBatchId = (): Promise<string | number> => Promise.resolve(101);

const formatBatchId = (batchId: string | number): string => {
  if (typeof batchId === "number") {
    return `BATCH-${String(batchId).padStart(4, "0")}`;
  }
  return batchId.toUpperCase();
};

function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((groups, item) => {
    const key = keyFn(item);
    const existing = groups[key] ?? [];
    groups[key] = [...existing, item];
    return groups;
  }, {});
}

const buildReport = (records: Enrollee[]): string => {
  const reports: EligibilityReport[] = records.map(
    ({ name, prelim, midterm, final }): EligibilityReport => {
      const average = computeAverage(prelim, midterm, final);
      const status = getStatus(average);
      const entry: EligibilityReport = { name, average, status };
      if (status === EnrollmentStatus.Probation) {
        entry.remarks = "Needs consultation";
      }
      return entry;
    }
  );

  const grouped = groupBy(reports, (entry) => entry.status);
  const passing = grouped[EnrollmentStatus.Passing] ?? [];

  const total = reports.reduce((sum, { average }) => sum + average, 0);
  const classAverage = total / reports.length;

  const lines = reports.map(({ name, average, status, remarks }) => {
    const base = `${name} - Average: ${average.toFixed(2)} - ${status}`;
    return remarks ? `${base} - ${remarks}` : base;
  });

  return `=== IT313 Enrollment Eligibility Report (TypeScript) ===
${lines.join("\n")}

Class Average: ${classAverage.toFixed(2)}
Passing: ${passing.length} / ${reports.length}`;
};

const main = async (): Promise<void> => {
  try {
    const batchId: string | number = await getBatchId();
    const records = await getEnrollees();
    console.log(`Batch: ${formatBatchId(batchId)}`);
    console.log(buildReport(records));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Failed to load enrollee records: ${message}`);
  }
};

main();