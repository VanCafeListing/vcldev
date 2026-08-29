import { LegalDocumentScreen } from '@/components/legal-document-screen';
import { TERMS_OF_USE } from '@/content/legal';

/**
 * Lives under `legal/` rather than `profile/` or `(auth)/` because it has to
 * be reachable from both sides of the auth boundary: the Profile tab (signed
 * in) and the Sign Up screen's consent line (signed out). `SessionRouter`
 * exempts this segment from both of its redirects.
 */
export default function TermsOfUseScreen() {
  return <LegalDocumentScreen document={TERMS_OF_USE} />;
}
