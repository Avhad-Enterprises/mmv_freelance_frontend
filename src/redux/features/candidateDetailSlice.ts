import { createSlice } from '@reduxjs/toolkit';
import { fetchCandidateByUsername } from './candidateDetail';

type CandidateState = {
    data: any; // Replace with actual type if available
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

export default candidateDetailSlice.reducer;
