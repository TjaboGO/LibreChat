export interface FormCardOption {
  label: string;
  value: string;
  isRecommended?: boolean;
  description?: string;
}

export interface FormCardQuestion {
  id: string;
  question: string;
  header?: string;
  description?: string;
  options: FormCardOption[];
  isMultiSelect?: boolean;
  allowOther?: boolean;
}

export interface FormCardData {
  title?: string;
  description?: string;
  questions: FormCardQuestion[];
  actionId?: string;
  submitLabel?: string;
}

export interface FormCardSubmission {
  actionId?: string;
  answers: Record<string, string | string[]>;
  submittedAt?: string;
}
