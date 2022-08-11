import React, { useState } from 'react';
import { useCreatePostMutation } from '../../api/apiSlice';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, setDoc, doc } from "firebase/firestore";

import './createPost.scss'
import { db } from '../../firebase1';

const CreatePost = () => {
    const [postTitle, setPostTitle] = useState('')
    const [postText, setPostText] = useState('')

    const [createPost] = useCreatePostMutation()

    // const onSubmitHandler = (e) => {
    //     e.preventDefault();
    //     const newPost = {
    //         id: uuidv4(),
    //         author: name,
    //         title: postTitle,
    //         post: postText
    //     }

    //     createPost(newPost).unwrap()

    //     setPostTitle('')
    //     setPostText('')
    // }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            const docRef = await setDoc(doc(db, "users", "news"), {
                title: postTitle,
                text: postText,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }



    return (
        <form
            className='addForm'
            onSubmit={onSubmitHandler}
        >
            <input
                required
                type="text"
                name="title"
                id="title"
                placeholder="Титл"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
            />
            <textarea
                required
                type="text"
                name="descr"
                id="descr"
                placeholder="Что случилось?"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
            />
            <button type="submit" >Создать</button>
        </form>
    );
};

export default CreatePost;