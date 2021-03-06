/* eslint-disable no-console */
import axios from 'axios';

import constants from '../types';

// - ================ FETCH ALL POSTS ================
export const getAllPosts = () => dispatch => {
  dispatch({ type: constants.TOGGLE_LOADING, payload: true });
  axios
    .get('http://localhost:5000/posts')
    .then(res => {
      dispatch({
        type: constants.GET_ALL_POSTS,
        payload: res.data.posts
      });
      dispatch({ type: constants.TOGGLE_LOADING, payload: false });
    })
    .catch(err => {
      dispatch({ type: constants.TOGGLE_LOADING, payload: false });
      console.log(err);
      dispatch({
        type: constants.ADD_ERROR,
        payload: err
      });
    });
};

// - ================ DELETE POST ================
export const deletePost = userInfo => dispatch => {
  const { username, id } = userInfo;
  axios
    .delete(`http://localhost:5000/${username}/delete/${id}`)
    .then(res => {
      dispatch({ type: constants.REFRESH });
    })
    .catch(err => {
      dispatch({
        type: constants.ADD_ERROR,
        payload: Object.values(err.response.data)
      });
    });
};

// - ================ Like POST ================
export const likePost = userInfo => dispatch => {
  const { username, recipient, id } = userInfo;
  axios
    .post(`http://localhost:5000/${username}/like-status/${id}`, {
      recipient
    })
    .then(res => {
      dispatch({ type: constants.REFRESH });
    })
    .catch(err => console.log(err));
};

// - ================ CREATE NEW POST ================
export const createPost = userInfo => dispatch => {
  const { username, body } = userInfo;
  axios
    .post(`http://localhost:5000/${username}/create-post`, { body })
    .then(res => {
      dispatch({ type: constants.REFRESH });
      dispatch({
        type: constants.MODAL_STATUS,
        payload: {
          modalActive: false,
          modalContent: ''
        }
      });
    })
    .catch(err => console.log(err));
};

// - ================ Modal Display ================
export const displayModal = displayType => dispatch => {
  if (displayType.post) {
    axios
      .get(`http://localhost:5000/get-comments/${displayType.post._id}`)
      .then(res => {
        dispatch({
          type: constants.FETCH_COMMENTS,
          payload: {
            postId: res.data.postId,
            modalPostComments: res.data.allComments
          }
        });
      })
      .catch(err => console.log(err));
  }

  dispatch({
    type: constants.MODAL_STATUS,
    payload: {
      modalActive: displayType.active,
      modalContent: displayType.modalContent
    }
  });
};

// - ================ CREATE NEW Comment ================
export const createComment = userInfo => dispatch => {
  const { username, postId, body } = userInfo;
  axios
    .post(`http://localhost:5000/${username}/add-comment/${postId}`, {
      body,
      username,
      postId
    })
    .then(res => {
      // - replace with commetn refresh
      axios
        .get(`http://localhost:5000/get-comments/${postId}`)
        .then(res => {
          dispatch({
            type: constants.FETCH_COMMENTS,
            payload: {
              postId: res.data.postId,
              modalPostComments: res.data.allComments
            }
          });
        })
        .catch(err => console.log(err));

      dispatch({ type: constants.REFRESH });
    })
    .catch(err => console.log(err));
};

// - =========== CLEAR ALL ERRORS ===================
export const clearErrors = () => dispatch => {
  dispatch({
    type: constants.CLEAR_ERRORS
  });
};
