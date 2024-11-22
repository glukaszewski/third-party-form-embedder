import { SHEETGO_CORE_API_URL } from '../env'

export const TOKEN_ACQUISITION_ENDPOINT = `${SHEETGO_CORE_API_URL}/iam/token`
export const TOKEN_RESOURCE_TARGET = 'form'
export const TOKEN_ALG = 'HS512'

export const TOKEN_ACQUISITION_STARTING_SLEEP_TIME = 250
export const TOKEN_ACQUISITION_MAX_RETRIES = 3
