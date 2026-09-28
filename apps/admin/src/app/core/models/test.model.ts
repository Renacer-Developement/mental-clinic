export interface Question {
  _id?: string;
  question?: string;
  example?: string;
  labelText: string[];
  value: number[];
}

export interface Interpretation {
  range?: number[];
  result?: string;
  name?: string;
  type?: string;
  questionIndex?: number[];
}

export interface Spectra {
  factor?: number;
  name?: string;
  questions?: number[];
  interpretation?: string;
}

export interface Test {
  _id: string;
  name: string;
  description: string;
  type: string;
  specialTest: string;
  duration: string;
  instructions: string;
  whyTest: string;
  pdfLink: string;
  questions: Question[];
  commonMessage: string;
  resultInterpretation: Interpretation[];
  factor: Spectra[];
}

export type TestListItem = Pick<Test, '_id' | 'name' | 'description' | 'type' | 'specialTest' | 'duration'>;
