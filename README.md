# IT313 Enrollment Eligibility Checker (TypeScript)

**Name:** Jo Nathaniel C Lucero | **Section:** IT3R2

## Problem
The Lab 2 JavaScript registrar tool is rewritten in TypeScript so type-related
bugs are caught before they reach real student records. The program computes
each enrollee's average, marks them PASSING (average >= 75) or PROBATION, and
prints a formatted report.

## TypeScript concepts applied
- **Basic types**: every parameter, return value, and variable is annotated.
- **Interfaces**: `Enrollee` and `EligibilityReport` describe the data shapes.
- **Enum**: `EnrollmentStatus` replaces raw strings, so typos become compile errors.
- **Optional property**: `remarks?` is only set for PROBATION enrollees.
- **Union type**: `batchId: string | number`, narrowed with `typeof`.
- **Generics**: `groupBy<T>` groups any array by a key, used here to group
  reports by status.
- **Strict mode**: `"strict": true` in tsconfig.json.

## How to run
1. Install Node.js.
2. Install dependencies:
   npm install
3. Run the program:
   npx tsx index.ts
4. Type-check (should print nothing):
   npx tsc --noEmit
5. To test error handling, set SIMULATE_FAILURE to true in index.ts and rerun.