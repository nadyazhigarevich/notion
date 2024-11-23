import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserContextProvider'
import NoteForm from '../components/NoteForm'

const EditNotePage = () => {
    const { user } = useContext(UserContext)
    const { id } = useParams()
    const [note, setNote] = useState(null)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://localhost:3000/notes/${id}`)
            .then(response => response.json())
            .then(data => {
                setNote(data)
                setTitle(data.title)
                setBody(data.body)
            })
            .catch(error => {
                console.error('Error fetching note:', error)
            })
    }, [id])

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

        fetch(`http://localhost:3000/notes/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
                body,
            }),
        })
            .then(response => response.json())
            .then(data => {
                navigate(`/note/${data.id}`)
            })
            .catch(error => {
                console.error('Error updating note:', error)
            })
    }

    if (!note) {
        return <div className="text-center">Loading...</div>
    }

    return (
        <div className="flex items-center justify-center bg-white w-3/5">
            <div className="bg-white shadow-md rounded-lg p-8 w-full">
                <article className="prose lg:prose-xl">
                    <h1 className="prose-2xl font-bold">Edit</h1>
                    <NoteForm
                        title={title}
                        setTitle={setTitle}
                        body={body}
                        setBody={setBody}
                        errors={errors}
                        onSubmit={handleSubmit}
                        isEditing={true}
                    />
                </article>
            </div>
        </div>
    )
}

export default EditNotePage