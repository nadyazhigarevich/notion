import { useContext } from 'react'
import { UserContext } from './UserContextProvider'
import { Navigate } from 'react-router-dom'

export default function RequireAuth({ children }) {
    const { user, loading } = useContext(UserContext)

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user?.id) {
        return <Navigate to="/login" replace />
    }

    return children
}