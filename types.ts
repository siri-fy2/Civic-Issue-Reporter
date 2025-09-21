
export enum UserRole {
  CITIZEN = 'citizen',
  OFFICIAL = 'official',
}

export interface Citizen {
  role: UserRole.CITIZEN;
  email: string;
  name: string;
}

export enum OfficialDesignation {
  WARD = 'Ward',
  ZONE = 'Zone',
  CITY = 'City',
  IAS = 'IAS',
}

export enum IssueDepartment {
  ROAD = 'Road',
  SANITATION = 'Sanitation',
  WATER = 'Water',
}

export interface Official {
  role: UserRole.OFFICIAL;
  email: string;
  name: string;
  designation: OfficialDesignation;
  department: IssueDepartment;
}

export type User = Citizen | Official;

export enum Flag {
  NONE = 'None',
  RED = 'Red',
  GREEN = 'Green',
}

export interface Issue {
  id: string;
  lat: number;
  lng: number;
  date: string; // YYYY-MM-DD
  issueType: string;
  location: string;
  status: string;
  currentLevel: OfficialDesignation;
  department: IssueDepartment;
  dueDate: Date;
  flag: Flag;
  image: string; // Base64 or URL
  description: string;
}
