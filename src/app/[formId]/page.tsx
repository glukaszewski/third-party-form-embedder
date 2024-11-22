import { TESTABLE_FORM_IDS } from '@/constants/forms'

import Embedder from './components/Embedder'

export async function generateStaticParams() {
    return TESTABLE_FORM_IDS.map(formId => ({ formId }))
}

async function Page(
    { params: unresolvedParams }: { params: Promise<{ formId: string }> }
) {
    const params = await unresolvedParams
    return <Embedder params={params} />
}

export default Page
