import React, { useCallback } from 'react';
import { useDeletePostMutation, useGetPostsQuery } from '../../api/apiSlice';
import CreatePost from '../createPost/CreatePost';
import PostItem from '../postItem/PostItem';
import Spiner from '../spiner/Spiner';

import './postList.scss'

const PostsList = () => {

    const {
        data: posts = [],
        isLoading,
        isError
    } = useGetPostsQuery()

    const [deletePost] = useDeletePostMutation()

    const onDelete = useCallback((id) => {
        deletePost(id);
        // eslint-disable-next-line
    }, [])

    if (isLoading) {
        return (
            <div className='posts__spiner'>
                <Spiner />
            </div>
        )
    } else if (isError) {
        return <h5>Ошибка загрузки</h5>
    }

    const renderPosts = (arr) => {
        if (arr.length === 0) {
            return (
                <h5>Постов пока нет</h5>
            )
        }

        return arr.map(({ id, ...props }) => {
            return (
                <PostItem key={id} {...props} onDelete={() => onDelete(id)} />
            )
        })
    }
    const elements = renderPosts(posts)
    return (
        <div className="container">
            <div className='posts'>
                {elements}
            </div>
        </div>
    );
};

export default PostsList;