import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const initialState = {
  cartItems: [],
  isLoading: false,
};
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id,  restaurantId, menuId, quantity,price,image }) => {
    console.log("Sending request with:", { id, restaurantId, menuId, quantity,price });
    const response = await axios.post("http://localhost:5000/api/cart/add", {
      id,
      restaurantId,
      menuId,
      quantity,
      price,
      image
    }).catch((error) => {
      console.error("Error adding to cart:", error.response || error.message);
    });
    return response.data;

  }
);
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (id) => {
    console.log("Sending request with userId:", id);
    const response = await axios.get(`
            
             http://localhost:5000/api/cart/get/${id}
            `);
    console.log("Fetched cart items:", response.data.items);
    return response.data.items;
   
  }
);
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ id, menuId, quantity }) => {
    const response = await axios.put(
      "http://localhost:5000/api/cart/update",
      {
        id,
        menuId,
        quantity,
      }
    );

    return response.data;
  }
);
export const deleteCartItems = createAsyncThunk(
  "cart/deleteCartItems",
  async ({ id, menuId }) => {
    console.log("from delete store handle", id, menuId);
   const response = await axios.delete(
      `http://localhost:5000/api/cart/delete/${id}/${menuId}`
    );
    return response.data;
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })

      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      })
      .addCase(deleteCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
      });
  },
});
export default cartSlice.reducer;