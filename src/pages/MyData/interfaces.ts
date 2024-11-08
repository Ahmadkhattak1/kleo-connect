export type SearchSummary = string[]

export interface MenuItemType {
  value: string;
  label: string;
}

export interface SearchResult {
  id: number;
  title: string;
  description: string;
  referenceUrl: string;
  isSelected: boolean;
  isMonetised: boolean;
  isPublic: boolean;
}
