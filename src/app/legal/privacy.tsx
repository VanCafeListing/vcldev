import { LegalDocumentScreen } from '@/components/legal-document-screen';
import { PRIVACY_POLICY } from '@/content/legal';

/** Under `legal/` for the same reason as the terms — see `legal/terms.tsx`. */
export default function PrivacyPolicyScreen() {
  return <LegalDocumentScreen document={PRIVACY_POLICY} />;
}
