export interface EquipmentItem {
  id: number;
  name: string;
  category: string;
  translations?: {
    [key: string]: string;
  };
}

export interface EquipmentCategory {
  id: number;
  name: string;
  translations?: {
    [key: string]: string;
  };
}

export interface Language {
  code: string;
  name: string;
  flag: string;
}