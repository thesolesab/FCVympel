import React from 'react';

import './postItem.scss'

const PostItem = ({ author, title, post, onDelete }) => {
    return (
        <div className="card">
            <div className="title">{title}</div>
            <div className="description">{post}</div>
            <div className="card__footer">
                <div className="author">{author} &#128386;</div>
                <button type="button" onClick={onDelete}>Удалить</button>
            </div>
        </div>
    );
};

export default PostItem;