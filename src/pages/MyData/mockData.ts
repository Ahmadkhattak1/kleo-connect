import { MenuItemType, SearchSummary } from "./interfaces";

export const DataTypeMenuList: MenuItemType[] = [
  {
    label: 'Private',
    value: 'private'
  },
  {
    label: 'Public',
    value: 'public'
  },
  {
    label: 'Monetized',
    value: 'monetized'
  },
  {
    label: 'Non-Monetized',
    value: 'nonMonetized'
  },
]

export const TimeRangeMenuList: MenuItemType[] = [
  {
    label: 'Today',
    value: 'today'
  },
  {
    label: 'Last Week',
    value: 'lastWeek'
  },
  {
    label: 'Last Month',
    value: 'lastMonth'
  },
  {
    label: 'Last Year',
    value: 'lastYear'
  },
]

export const ActivityTypesMenuList: MenuItemType[] = [
  { value: "Cryptocurrency", label: "Cryptocurrency" },
  { value: "Comedy", label: "Comedy" },
  { value: "Gaming", label: "Gaming" },
  { value: "Fitness", label: "Fitness" },
  { value: "Photography", label: "Photography" },
  { value: "Fashion", label: "Fashion" },
  { value: "Music", label: "Music" },
  { value: "Movies", label: "Movies" },
  { value: "Travel", label: "Travel" },
  { value: "Blogging", label: "Blogging" },
];

export const SearchResultsSummary: SearchSummary = [
  'Computer programmer.',
  'A well-known job that involves writing computer programs, testing software, and troubleshooting.',
  'Data scientist.',
  'A trending job that involves analyzing large amounts of data.'
]
