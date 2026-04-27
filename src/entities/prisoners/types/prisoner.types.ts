export type PrisonerParams = {
  limit?: number;
  offset?: number;
  lang?: string;
  search?: string;
  region?: string;
  province?: string;
  colony?: string;
  place_object?: string;
  object_type?: string;
  status?: string;
  gender?: string;
  danger_level?: string;
};

export type PrisonerReference = {
  id: number;
  name: string;
};

export type PrisonerStatus = PrisonerReference | string | null;

export type PrisonerListItem = {
  id: number;

  created_at?: string | null;
  updated_at?: string | null;

  first_name?: string;
  last_name?: string;
  father_name?: string;
  full_name: string;

  gender?: string;
  gender_label?: string | null;

  birth_date?: string | null;
  citizenship?: string | null;
  pinfl?: string | null;
  passport_id?: string | null;
  birthplace?: string | null;
  nationality?: string | null;

  photo?: string | null;
  faceid?: string | null;
  fingerprint?: string | null;

  permanent_residence?: string | null;
  register_add?: string | null;
  last_add?: string | null;
  phone?: string | null;

  family_info?: string | null;
  emergency_contact_person?: string | null;

  date_of_sentencing?: string | null;
  sentence_end_date?: string | null;
  escape_attempts?: number | string | null;

  danger_level?: string | null;
  danger_level_label?: string | null;
  psychological_evaluation?: string | null;

  active_prisoner?: boolean;
  disability?: string | boolean | null;

  region?: PrisonerReference | null;
  province?: PrisonerReference | null;
  colony?: PrisonerReference | null;
  place_object?: PrisonerReference | null;

  status?: PrisonerStatus;
};

export type PrisonerListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: PrisonerListItem[];
};