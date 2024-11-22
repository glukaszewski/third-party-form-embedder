// @ts-nocheck
import * as jose from "jose"
import { convertToMilliseconds } from '../../utils/jwt'

interface JwtOptions {
    algorithm: string,
    expiresIn: string
}

class Jwt {
    async sign(payload: object, secretOrPrivateKey: string, options: JwtOptions) {
        try {
            const { algorithm, expiresIn } = options || {}
            const secret = new TextEncoder().encode(secretOrPrivateKey)
            const jwt = await new jose.SignJWT(payload)
                .setProtectedHeader({ alg: algorithm || 'HS256' })
                .setExpirationTime(new Date().getTime() + parseInt(
                    convertToMilliseconds(expiresIn || '1m')
                ))
                .sign(secret)
            return jwt
        } catch (error) {
            throw error
        }
    }

    async decode(token: string) {
        try {
            const jwt = jose.decodeJwt(token)
            return jwt
        } catch (error) {
            throw error
        }
    }

    async verify(token: string, secretOrPrivateKey: string) {
        try {
            const secret = new TextEncoder().encode(secretOrPrivateKey)
            return await jose.jwtVerify(token, secret)
        } catch (error) {
            throw error
        }
    }
}

export default new Jwt()
