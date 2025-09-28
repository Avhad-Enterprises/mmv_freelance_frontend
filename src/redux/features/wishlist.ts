import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { notifyError, notifySuccess } from "@/utils/toast";
import { IJobType } from "@/types/job-data-type";

const wishlistData = getLocalStorage("wishlist_items");

const initialState: { wishlist: IJobType[] } = {
  wishlist: wishlistData || [],
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    set_wishlist: (state, { payload }: { payload: IJobType[] }) => {
      state.wishlist = payload;
      setLocalStorage("wishlist_items", state.wishlist);
    },

    add_to_wishlist: (state, { payload }: { payload: IJobType }) => {
      const isExist = state.wishlist.some(
        (item) => item.projects_task_id === payload.projects_task_id
      );

      if (!isExist) {
        state.wishlist.push(payload);
        notifySuccess(`${payload.project_title} added to wishlist`);
      }
      setLocalStorage("wishlist_items", state.wishlist);
    },

    remove_from_wishlist: (state, { payload }: { payload: number }) => {
      const removedItem = state.wishlist.find(
        (item) => item.projects_task_id === payload
      );
      if (removedItem) {
        notifyError(`${removedItem.project_title} removed from wishlist`);
      }
      state.wishlist = state.wishlist.filter(
        (item) => item.projects_task_id !== payload
      );
      setLocalStorage("wishlist_items", state.wishlist);
    },
  },
});

export const { set_wishlist, add_to_wishlist, remove_from_wishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
