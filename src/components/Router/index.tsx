import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { RESOURCE_EMBED, ROOT } from '../../constants/routes'
import Embedder from '../Embedder'
import Home from '../Home'

export default function Router() {
    return (
        <Routes>
            <Route
                path={RESOURCE_EMBED}
                element={<Embedder />}
            />
            <Route
                path={ROOT}
                element={<Home />}
            />
        </Routes>
    )
}
