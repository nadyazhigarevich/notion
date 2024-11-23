import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { UserContext } from '../components/UserContextProvider'

const NotePage = () => {
    const { id } = useParams()
    const [note, setNote] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const { user } = useContext(UserContext)

    useEffect(() => {
        fetch(`http://localhost:3000/notes/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Note not found')
                }
                return response.json()
            })
            .then((data) => {
                setNote(data)
            })
            .catch((error) => {
                console.error('Error fetching note:', error)
                navigate('/*')
            })
            .finally(() => {
                setLoading(false)
            })
    }, [id, navigate])

    const handleDelete = () => {
        if (!user) {
            alert('You must be logged in to delete a note.')
            return
        }

        fetch(`http://localhost:3000/notes/${id}`, {
            method: 'DELETE',
        })
            .then(() => navigate('/notes'))
            .catch((error) => console.error('Error deleting note:', error))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-8 w-3/5 max-w-md">
                    <article className="prose lg:prose-xl">
                        <h1 className="mb-6">Loading...</h1>
                    </article>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center bg-white w-3/5">
            <div className="bg-white shadow-md rounded-lg p-8 w-full">
                <article className="prose lg:prose-xl">
                    <h1 className="mb-6">{note.title}</h1>
                    <div className="flex justify-between items-center mb-6">
                        <a href={`/edit-note/${note.id}`} className="text-blue-500 hover:text-blue-700 flex items-center">
                            ✍️ Edit
                        </a>
                        <button onClick={handleDelete} className="text-red-500 hover:text-red-700 flex items-center">
                            🗑 Delete
                        </button>
                    </div>
                    <pre className="whitespace-pre-wrap mb-6 bg-gray-100 p-4 rounded-md text-black">{note.body}</pre>
                    <a href="/notes" className="text-blue-500 hover:text-blue-700">
                        Back
                    </a>
                </article>
            </div>
        </div>
    )
}

export default NotePage