export type LoginRequest = {
  phone: string
  password: string
}

export type LoginResponse = {
  access: string
  refresh: string
}

export type ProfileScopeItem = {
  id: number;
  unique_id: number;
  name: string;
};

export type ProfileInfo = {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  father_name: string;
  birth_date: string | null;
  birthplace: string | null;
  citizenship: string | null;
  nationality: string | null;
  phone: string | null;
  photo: string | null;
  pinfl: string | null;
  passport_id: string | null;
  position: string | null;
  division: string | null;
  title: string;
  title_label: string;
  role: string;
  role_label: string;
  gender: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  family_info: string | null;
  permanent_residence: string | null;
  emergency_contact_person: string | null;
  extra_data: unknown;
  register_add: string | null;
  last_add: string | null;
  object: unknown;
  region: ProfileScopeItem | null;
  province: ProfileScopeItem | null;
  colony: ProfileScopeItem | null;
  created_at: string;
  updated_at: string;
  date_joined: string;
  last_login: string | null;
};