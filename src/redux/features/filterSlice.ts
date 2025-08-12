import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Filter state type
interface IFilterState {
  search_key: string;
  projects_type: string;
  project_category: string[];
  tags: string[];
  budget_range: [number, number]; // Tuple: [min, max]
}

// Initial state
const initialState: IFilterState = {
  search_key: "",
  projects_type: "",
  project_category: [],
  tags: [],
  budget_range: [0, 10000], // default max
};

export const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setProjectsType: (state, action: PayloadAction<string>) => {
      state.projects_type = state.projects_type === action.payload ? "" : action.payload;
    },
    setSearchKey: (state, action: PayloadAction<string>) => {
      state.search_key = action.payload;
    },
    setProjectCategory: (state, action: PayloadAction<string>) => {
      if (state.project_category.includes(action.payload)) {
        state.project_category = state.project_category.filter(c => c !== action.payload);
      } else {
        state.project_category.push(action.payload);
      }
    },
    setTags: (state, action: PayloadAction<string>) => {
      if (state.tags.includes(action.payload)) {
        state.tags = state.tags.filter(t => t !== action.payload);
      } else {
        state.tags.push(action.payload);
      }
    },
    setBudgetRange: (state, action: PayloadAction<[number, number]>) => {
      state.budget_range = action.payload;
    },
    resetFilter: () => initialState,
  },
});

export const {
  setProjectsType,
  setSearchKey,
  setProjectCategory,
  setTags,
  setBudgetRange,
  resetFilter,
} = filterSlice.actions;

export default filterSlice.reducer;
