export interface Question {
  question?: string;
  labelText: string[];
  example?: string;
  value: number[];
  name: string;
  _id: string;
  // DIVA-5
  code?: string;
  section?: string; // A1 | A2 | SUPP_A1/A2_ADULT/CHILD | B | IMPAIR_ADULT | IMPAIR_CHILD | E | COLLATERAL_*
  adultExamples?: string[];
  childExamples?: string[];
}

export interface TestDomain {
  name: string;
  adultExamples: string[];
  childExamples: string[];
  _id?: string;
}

export interface ResultInterpretation {
  range: [number, number | null];
  result: string;
  type?:string;
  name: string;
  questionIndex: [number, number | null],
  _id: string;
}

export interface Test {
  name?: string;
  type?: string;
  factor:any
  specialTest?: string
  description?: string;
  duration?: string;
  instructions?: string;
  whyTest?: string;
  pdfLink?: string;
  questions?: Question[];
  commonMessage?: string;
  resultInterpretation?: ResultInterpretation[];
  domains?: TestDomain[];
  questionCount?: number; // list endpoint only
  _id?: string;
  __v?: number;
}
