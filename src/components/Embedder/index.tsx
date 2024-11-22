import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import jwt from '../../services/jwt'

import {
    TOKEN_ACQUISITION_STARTING_SLEEP_TIME,
    TOKEN_ACQUISITION_MAX_RETRIES,
    TOKEN_ACQUISITION_ENDPOINT,
    TOKEN_RESOURCE_TARGET,
    TOKEN_ALG
} from '../../constants/token'
import { RESOURCE_EMBED_URL } from '../../constants/embed'
import { SHEETGO_APP_URL } from '../../constants/env'

export default function Embedder() {
    const { formId } = useParams()

    const [sessionToken, setSessionToken] = useState(null)
    const [embedUrl, setEmbedUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingStep, setLoadingStep] = useState('Please wait')
    const [error, setError] = useState('')

    const handleTokenAcquisition = async (signedToken: string) => {
        setLoadingStep('Requesting session token')
        const data = JSON.stringify({ token: signedToken })
        let token = null
        let retryCount = 0
        let sleep = TOKEN_ACQUISITION_STARTING_SLEEP_TIME / 2
        while (!token && retryCount < TOKEN_ACQUISITION_MAX_RETRIES) {
            let status
            let values
            try {
                const response = await fetch(TOKEN_ACQUISITION_ENDPOINT, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    method: 'POST',
                    body: data
                })
                status = response.status
                if (status === 200) {
                    setLoadingStep('Success: Sheetgo API returned 200')
                    const reqData = await response.json()
                    values = reqData
                } else {
                    setLoadingStep(`Warning: Sheetgo API returned ${status}`)
                }
            } catch (e: any) {
                if (e.response && e.response.status) status = e.response.status
            }
            if (status === 200) {
                token = values.token
            } else {
                if (status && [401, 404].includes(status)) {
                    throw new Error(status === 404
                        ? 'This form may not exist. Please check the informed ID.'
                        : 'You may not be authorized to embed this form.')
                }
                retryCount += 1
                if (retryCount < TOKEN_ACQUISITION_MAX_RETRIES) {
                    setLoadingStep('Warning: Retrying token acquisition...')
                    sleep *= 2
                    await new Promise(resolve => {
                        setTimeout(resolve, sleep)
                    })
                }
            }
        }
        if (!token) setLoadingStep('Error: Session token could not be retrieved')
        return token
    }

    const handleGenerateJwt = async () => {
        setLoadingStep('Generating signed JWT')
        if (!process.env.CLIENT_ID) throw new Error('You must set up a client ID')
        if (!process.env.CLIENT_SECRET) throw new Error('You must set up the client secret')
        const payload = {
            client_id: process.env.CLIENT_ID,
            asset: formId,
            type: TOKEN_RESOURCE_TARGET
        }
        const signedJwt = await jwt.sign(payload, process.env.CLIENT_SECRET, {
            algorithm: TOKEN_ALG,
            expiresIn: '1m'
        })
        return signedJwt
    }

    const handleEmbed = async () => {
        setLoading(true)
        setError('')
        setEmbedUrl('')
        try {
            const signedJwt = await handleGenerateJwt()
            if (!signedJwt) {
                setError('Error on generating signed JWT')
                return
            }
            setLoadingStep('Signed JWT generated')
            const token = await handleTokenAcquisition(signedJwt)
            if (!token) {
                setError('Session token could not be retrieved')
                return
            }
            setSessionToken(token)
            setEmbedUrl(`${RESOURCE_EMBED_URL}${formId}?token=${token}`)
        } catch (e: any) {
            setError(e.toString())
        }
    }

    useEffect(() => {
        if (!formId) return
        handleEmbed()
    }, [formId])

    if (error || loading) {
        return (
            <div
                style={{
                    position: 'absolute',
                    height: '100%',
                    width: '100%'
                }}
            >
                <div
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        height: '100%'
                    }}
                >
                    <div
                        style={{
                            flexDirection: 'column',
                            display: 'flex',
                        }}
                    >
                        <h4
                            style={{
                                marginBottom: 16,
                                textAlign: 'center'
                            }}
                        >
                            {error || 'Loading...'}
                        </h4>
                        {error ? (
                            <div
                                style={{
                                    justifyContent: 'center',
                                    marginTop: 16,
                                    display: 'flex'
                                }}
                            >
                                <button
                                    style={{
                                        backgroundColor: '#58c4dc',
                                        borderRadius: 24,
                                        fontWeight: 700,
                                        fontSize: '.8125rem',
                                        padding: '9px 20px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#fff'
                                    }}
                                    onClick={handleEmbed}
                                >
                                    Try again
                                </button>
                            </div>
                        ) : (
                            <p>
                                {loadingStep}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    if (embedUrl) {
        return (
            <iframe
                style={{
                    outline: 'none',
                    border: 'none',
                    height: '100%',
                    width: '100%'
                }}
                allow={`camera *; identity-credentials-get; clipboard-write self ${SHEETGO_APP_URL}`}
                src={embedUrl}
                height="100%"
                width="100%"
            />
        )
    }

    return <></>
}
