import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserContextProvider'
import NoteForm from '../components/NoteForm'

const CreateNotePage = () => {
    const { user } = useContext(UserContext)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        const validationErrors = {}

        if (!title.trim()) {
            validationErrors.title = 'The note title cannot be empty'
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        fetch('http://localhost:3000/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                authorId: user.id,
                title,
                body,
                createdAt: Date.now(),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                navigate(`/note/${data.id}`)
            })
            .catch((error) => {
                console.error('Error creating note:', error)
            })
    }

    return (
        <div className="flex items-center justify-center bg-white w-3/5">
            <div className="bg-white shadow-md rounded-lg p-8 w-full">
                <article className="prose lg:prose-xl">
                    <h1 className="prose-2xl font-bold mb-4">Create a new note</h1>
                    <NoteForm
                        title={title}
                        setTitle={setTitle}
                        body={body}
                        setBody={setBody}
                        errors={errors}
                        onSubmit={handleSubmit}
                        isEditing={false}
                    />
                </article>
            </div>
        </div>
    )
}

export default CreateNotePage