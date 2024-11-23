import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../components/UserContextProvider'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate } from '../utils/formatDate'

export default function NotesPage() {
    const { user } = useContext(UserContext)
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:3000/notes?authorId=${user.id}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }
                    return response.json()
                })
                .then((data) => {
                    const sortedNotes = data.sort((a, b) => b.createdAt - a.createdAt)
                    setNotes(sortedNotes)
                })
                .catch((error) => {
                    console.error('Fetch error:', error)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [user])

    const handleDelete = (noteId) => {
        fetch(`http://localhost:3000/notes/${noteId}`, {
            method: 'DELETE',
        })
            .then(() => {
                setNotes((prevNotes) => prevNotes.filter(note => note.id !== noteId))
            })
            .catch((error) => {
                console.error('Delete error:', error)
            })
    }

    const handleCreateNote = () => {
        navigate('/create-note')
    }

    const handleNoteClick = (noteId) => {
        navigate(`/note/${noteId}`)
    }

    if (loading) {
        return <div className="text-center">Loading...</div>
    }

    return (
        <div className="flex items-center justify-center bg-white w-3/5">
            <div className="bg-white shadow-md rounded-lg p-8 w-full">
                <article className="prose prose-slate prose-sm lg:prose-base">
                    <h1 className="font-bold">My Notes</h1>
                    <button
                        onClick={handleCreateNote}
                        className="bg-blue-500 hover:bg-blue-700 text-center mt-4 text-white w-2/5 font-bold py-2 px-4 rounded inline-block"
                    >
                        Create New Note
                    </button>
                    <ul className="divide-gray-300">
                        {notes.map(note => (
                            <li
                                key={note.id}
                                className="flex pb-4 justify-between items-center h-28 w-full hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleNoteClick(note.id)}
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">{note.title}</h2>
                                    <p className="text-gray-600">{formatDate(note.createdAt)}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <Link to={`/edit-note/${note.id}`} className="text-blue-500 hover:text-blue-700">
                                        ✍️
                                    </Link>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }} className="text-red-500 hover:text-red-700">
                                        🗑
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </div>
    )
}