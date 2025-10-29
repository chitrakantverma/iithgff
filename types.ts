
export interface Professor {
  Name: string;
  Designation: string;
  Institute: string;
  Email: string | null;
  LinkedIn: string | null;
  "Research Interests": string;
  "Internship/Outreach": string | null;
  "Institute Website": string;
  Summary: string;
}

export interface SearchParams {
  institute: string;
  department: string;
  keyword: string;
}
