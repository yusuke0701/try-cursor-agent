export type Theme = 'light' | 'dark' | 'blue' | 'green';

export interface ThemeStyles {
  page: string;
  heading: string;
  filterText: string;
  filterButton: string;
  themeButton: string;
  themeButtonActive: string;
  input: string;
  submitButton: string;
  container: string;
  checkbox: string;
  title: string;
  completedTitle: string;
  dateContainer: string;
  dateText: string;
  overdueDate: string;
  deleteButton: string;
  text: string;
  background: string;
}

export const themePresets: Record<Theme, ThemeStyles> = {
  light: {
    page: 'bg-white text-gray-900',
    heading: 'text-gray-900',
    filterText: 'text-gray-600',
    filterButton: 'text-blue-600 hover:text-blue-800 focus:ring-blue-500',
    themeButton: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    themeButtonActive: 'bg-blue-500 text-white hover:bg-blue-600',
    input: 'border-gray-200 text-gray-900 bg-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-200',
    submitButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
    container: 'bg-white border-gray-200',
    checkbox: 'border-gray-300 text-blue-500 focus:ring-blue-500',
    title: 'text-gray-900',
    completedTitle: 'text-gray-500 line-through',
    dateContainer: 'text-gray-500',
    dateText: 'text-gray-500',
    overdueDate: 'text-red-500',
    deleteButton: 'text-gray-400 hover:text-red-500',
    text: 'text-gray-700',
    background: 'bg-gradient-to-br from-blue-50 to-indigo-50',
  },
  dark: {
    page: 'bg-gray-900 text-gray-100',
    heading: 'text-gray-100',
    filterText: 'text-gray-400',
    filterButton: 'text-blue-400 hover:text-blue-300 focus:ring-blue-500',
    themeButton: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
    themeButtonActive: 'bg-blue-600 text-white hover:bg-blue-700',
    input: 'border-gray-700 text-gray-100 bg-gray-800 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-900',
    submitButton: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    container: 'bg-gray-800 border-gray-700',
    checkbox: 'border-gray-600 text-blue-500 focus:ring-blue-500',
    title: 'text-gray-100',
    completedTitle: 'text-gray-500 line-through',
    dateContainer: 'text-gray-400',
    dateText: 'text-gray-400',
    overdueDate: 'text-red-400',
    deleteButton: 'text-gray-500 hover:text-red-400',
    text: 'text-gray-300',
    background: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
  },
  blue: {
    page: 'bg-blue-50 text-blue-900',
    heading: 'text-blue-900',
    filterText: 'text-blue-700',
    filterButton: 'text-blue-600 hover:text-blue-800 focus:ring-blue-500',
    themeButton: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    themeButtonActive: 'bg-blue-500 text-white hover:bg-blue-600',
    input: 'border-blue-200 text-blue-900 bg-white placeholder:text-blue-400 focus:border-blue-500 focus:ring-blue-200',
    submitButton: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
    container: 'bg-white border-blue-200',
    checkbox: 'border-blue-300 text-blue-500 focus:ring-blue-500',
    title: 'text-blue-900',
    completedTitle: 'text-blue-500 line-through',
    dateContainer: 'text-blue-700',
    dateText: 'text-blue-700',
    overdueDate: 'text-red-500',
    deleteButton: 'text-blue-400 hover:text-red-500',
    text: 'text-blue-700',
    background: 'bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50',
  },
  green: {
    page: 'bg-green-50 text-green-900',
    heading: 'text-green-900',
    filterText: 'text-green-700',
    filterButton: 'text-green-600 hover:text-green-800 focus:ring-green-500',
    themeButton: 'bg-green-100 text-green-700 hover:bg-green-200',
    themeButtonActive: 'bg-green-500 text-white hover:bg-green-600',
    input: 'border-green-200 text-green-900 bg-white placeholder:text-green-400 focus:border-green-500 focus:ring-green-200',
    submitButton: 'bg-green-500 hover:bg-green-600 focus:ring-green-500',
    container: 'bg-white border-green-200',
    checkbox: 'border-green-300 text-green-500 focus:ring-green-500',
    title: 'text-green-900',
    completedTitle: 'text-green-500 line-through',
    dateContainer: 'text-green-700',
    dateText: 'text-green-700',
    overdueDate: 'text-red-500',
    deleteButton: 'text-green-400 hover:text-red-500',
    text: 'text-green-700',
    background: 'bg-gradient-to-br from-green-50 via-green-100 to-emerald-50',
  },
}; 