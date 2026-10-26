export enum EnrollmentStatus {
  Passing = "PASSING",
  Probation = "PROBATION",
}

export const computeAverage = (
  prelim: number,
  midterm: number,
  final: number
): number => {
  const average = (prelim + midterm + final) / 3;
  return Number(average.toFixed(2));
};

const getStatus = (average: number): EnrollmentStatus =>
  average >= 75 ? EnrollmentStatus.Passing : EnrollmentStatus.Probation;

export default getStatus;