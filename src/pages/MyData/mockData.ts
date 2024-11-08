import { MenuItemType } from "./components/CustomSelect";

export const SelectionTypesMenuList: MenuItemType[] = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'None',
    value: 'none'
  },
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

export const DataTypeMenuList: MenuItemType[] = [
  {
    label: 'JSON',
    value: 'json'
  },
  {
    label: 'RAW',
    value: 'raw'
  },
  {
    label: 'IMAGE',
    value: 'image'
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
