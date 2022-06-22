import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  posts: [],
  newPost: {
    title: "A new post",
    author: "This is the body of the new post",
  },
};

export const getPost = createAsyncThunk(
  "posts/getPost",
  async (_, { rejectWithValue, dispatch }) => {
    const res = await axios.get("http://localhost:3001/posts");
    dispatch(setPosts(res.data));
  }
);
export const deletePostById = createAsyncThunk(
  "posts/deletePostById",
  async (id, { rejectWithValue, dispatch }) => {
    await axios.delete(`http://localhost:3001/posts/${id}`);
    dispatch(deletePost(id));
  }
);
// const newPost = {
//   title: "A new post",
//   author: "This is the body of the new post",
// };
export const postPost = createAsyncThunk(
  "posts/postPost",
  async (_, { getState, extra }) => {
    const { getPost } = getState().newPost;
    await axios.post("http://localhost:3001/posts", { getPost });
    console.log(getPost);
  }
);

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    // положительный ответ
    // [getPost.fulfilled]: () => console.log("fulfild"),
    // // во время запроса
    // [getPost.pending]: () => console.log("pending"),
    // // ошибка
    // [getPost.rejected]: () => console.log("rejected"),

    builder.addCase(postPost.fulfilled, (state, action) => {
      state.newPost.push(action.payload);
    });
  },
});

export const { setPosts, deletePost } = postSlice.actions;
export default postSlice.reducer;
