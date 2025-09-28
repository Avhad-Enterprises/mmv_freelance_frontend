import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { makePostRequest } from '@/utils/api';

export const fetchCandidateByUsername = createAsyncThunk<
  {
    user_id: number;
    first_name: string;
    last_name: string;
    bio?: string;
    profile_picture?: string;
    skill?: any[];
    experience?: any[];
    education?: any[];
    previous_works: string[];
    location: string;
    city: string;
    country: string;
    email: string;
    certification: any[];
    services: any[];
    total_earnings: number;
  },
  string,
  { rejectValue: string }
>(
  'candidate/fetchByUsername',
  async (username, thunkAPI) => {
    try {
      const response = await makePostRequest('users/freelaner', { username });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//  Slice setup
type CandidateState = {
  data: any;
  loading: boolean;
  error: string | null;
};

const initialState: CandidateState = {
  data: null,
  loading: false,
  error: null,
};

const candidateDetailSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidateByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateByUsername.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCandidateByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Something went wrong';
      });
  },
});

// Default export for store.ts
export default candidateDetailSlice.reducer;
