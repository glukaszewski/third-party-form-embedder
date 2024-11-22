import React from 'react'

export default function Home() {
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
                    <h2
                        style={{
                            marginBottom: 16,
                            textAlign: 'center'
                        }}
                    >
                        Hello there!
                    </h2>
                    <p>Please inform a form ID to embed...</p>
                </div>
            </div>
        </div>
    )
}
