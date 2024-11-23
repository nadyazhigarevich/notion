import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateForm } from '../utils/validation'
import Form from '../components/Form'
import { UserContext } from '../components/UserContextProvider'

const SignUp = () => {
    const navigate = useNavigate()
    const { setUser } = useContext(UserContext) 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [errors, setErrors] = useState({})

    const handleEmailChange = (e) => {
        const value = e.target.value
        setEmail(value)

        if (value) {
            fetch(`http://localhost:3000/users?email=${encodeURIComponent(value)}`)
                .then((response) => {
                    if (!response.ok) throw new Error('Network response was not ok')
                    return response.json()
                })
                .then((users) => {
                    if (users.length > 0) {
                        setErrors((prevErrors) => ({
                            ...prevErrors,
                            email: 'This email is already in use.',
                        }))
                    } else {
                        setErrors((prevErrors) => {
                            const { email, ...rest } = prevErrors
                            return rest
                        })
                    }
                })
                .catch((error) => {
                    console.error('Error checking email:', error)
                })
        } else {
            setErrors((prevErrors) => {
                const { email, ...rest } = prevErrors
                return rest
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const validationErrors = validateForm(email, password, repeatPassword)

        if (Object.keys(validationErrors).length > 0 || errors.email) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                ...validationErrors,
            }))
            return
        }

        const newUser = {
            email,
            password,
            createdAt: Date.now(),
        }

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Network response was not ok')
                return response.json()
            })
            .then((user) => {
                setUser(user)
                setEmail('')
                setPassword('')
                setRepeatPassword('')
                setErrors({})
                navigate('/')
            })
            .catch((error) => {
                console.error('Error during signup:', error)
                setErrors({ server: 'Server error. Please try again later.' })
            })
    }

    const fields = [
        {
            id: 'email',
            label: 'Email',
            type: 'email',
            value: email,
            onChange: handleEmailChange,
            placeholder: "Enter your email"
        },
        {
            id: 'password',
            label: 'Password',
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            placeholder: "Enter your password"
        },
        {
            id: 'repeat-password',
            label: 'Repeat password',
            type: 'password',
            value: repeatPassword,
            onChange: (e) => setRepeatPassword(e.target.value),
            placeholder: "Repeat your password"
        }
    ]

    return (
        <div className="bg-gray-100 w-1/3 flex justify-center items-center">
            <Form title="Sign up" fields={fields} onSubmit={handleSubmit} errors={errors} />
        </div>
    )
}

export default SignUp