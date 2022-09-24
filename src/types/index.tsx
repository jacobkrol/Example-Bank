export interface Example {
  id: string;
  title: string;
  source: string;
  description: string;
  used?: boolean;
  img?: string;
  meta?: {
    created: { seconds: number; nanoseconds: number };
    owner: string;
  };
}

export interface RedeemCode {
  id: string;
  code: string;
  exampleIds: string[];
  used?: boolean;
  meta?: {
    created: { seconds: number; nanoseconds: number };
    owner: string;
    opened?: { seconds: number; nanoseconds: number };
  };
}
