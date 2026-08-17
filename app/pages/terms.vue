<script setup lang="ts">
const lastUpdated = 'August 13, 2026'

const sections = [
  { id: 'agreement', label: 'Agreement and eligibility' },
  { id: 'service', label: 'The Service' },
  { id: 'accounts', label: 'Accounts and security' },
  { id: 'license', label: 'License and installation' },
  { id: 'content', label: 'Your content and projects' },
  { id: 'ai', label: 'AI output and BIM actions' },
  { id: 'acceptable-use', label: 'Acceptable use' },
  { id: 'plans', label: 'Plans and limits' },
  { id: 'third-parties', label: 'Third-party services' },
  { id: 'ownership', label: 'Ownership and feedback' },
  { id: 'availability', label: 'Availability and termination' },
  { id: 'disclaimers', label: 'Disclaimers and liability' },
  { id: 'general', label: 'General terms and contact' }
] as const

useSeoMeta({
  title: 'Terms of Service',
  description: 'Terms governing access to Architecton, its AI chat, and its Revit and Archicad BIM integrations.'
})
</script>

<template>
  <main class="bg-white pt-32 pb-24 text-[#18201c] sm:pt-40">
    <UContainer class="px-5 max-[720px]:px-3.5">
      <header class="max-w-4xl border-b border-[#dfe5e1] pb-12">
        <p class="mb-4 text-xs font-extrabold tracking-[.14em] text-architecton-700 uppercase">Legal</p>
        <h1 class="m-0 text-[clamp(3rem,7vw,5rem)] leading-[.98] font-semibold tracking-[-.04em]">Terms of Service</h1>
        <p class="mt-6 max-w-3xl text-lg leading-8 text-[#59635e]">
          These terms govern your use of the Architecton website, account services, AI chat, APIs, and integrations for
          Autodesk Revit and Graphisoft Archicad.
        </p>
        <div class="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#69736e]">
          <span><strong class="font-semibold text-[#27302c]">Effective:</strong> {{ lastUpdated }}</span>
          <span><strong class="font-semibold text-[#27302c]">Contact:</strong> support@architecton.ai</span>
        </div>
      </header>

      <div class="mt-12 grid gap-14 lg:grid-cols-[240px_minmax(0,760px)] lg:items-start">
        <aside class="rounded-2xl border border-[#dfe5e1] bg-[#f7f9f7] p-5 lg:sticky lg:top-28">
          <p class="mb-3 text-xs font-bold tracking-[.12em] text-[#65706a] uppercase">On this page</p>
          <nav aria-label="Terms of service sections">
            <ul class="m-0 grid list-none gap-1 p-0">
              <li v-for="section in sections" :key="section.id">
                <a class="block rounded-lg px-3 py-2 text-sm text-[#4f5954] transition hover:bg-white hover:text-[#111714]" :href="`#${section.id}`">
                  {{ section.label }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <article class="legal-copy min-w-0">
          <section id="agreement">
            <h2>1. Agreement and eligibility</h2>
            <p>
              These Terms of Service (“Terms”) form an agreement between you and Architecton (“Architecton,” “we,”
              “us,” or “our”). By creating an account, downloading an integration, or accessing the Service, you agree
              to these Terms and acknowledge our <NuxtLink to="/privacy">Privacy Policy</NuxtLink>.
            </p>
            <p>
              You must be at least 18 years old and legally capable of entering into this agreement. If you use the
              Service for an employer or another organization, you represent that you have authority to accept these
              Terms on its behalf. A separate signed commercial agreement controls if it expressly conflicts with these
              Terms.
            </p>
          </section>

          <section id="service">
            <h2>2. The Architecton Service</h2>
            <p>
              Architecton provides AI-assisted workflows for understanding, reviewing, coordinating, and—where a
              supported integration and permission mode allow—changing BIM models. The Service includes the website,
              account services, AI-assisted features, chat history, supported BIM integrations, and related
              documentation and support.
            </p>
            <p>
              Features and capabilities differ by BIM platform, host version, plan, project state, and release. A feature
              shown in documentation or a preview may not be available in every installation. Architecton is not a
              substitute for the licensed BIM host application or for professional architectural, engineering, code,
              safety, legal, or regulatory review.
            </p>
          </section>

          <section id="accounts">
            <h2>3. Accounts and security</h2>
            <p>
              You must provide accurate information, protect your credentials, and promptly notify us of suspected
              unauthorized access. Your account is personal unless an organization plan expressly permits shared or
              managed access. You are responsible for activity performed through your account and for ensuring that
              users of your device and BIM projects have appropriate authorization.
            </p>
            <p>
              We use protected credentials to maintain signed-in sessions on supported devices. Signing out ends access
              from that device in accordance with the applicable session controls. You must not copy, sell, share, or
              attempt to extract credentials or use one account to evade plan, usage, or security controls.
            </p>
          </section>

          <section id="license">
            <h2>4. License, installation, and updates</h2>
            <p>
              Subject to these Terms, Architecton grants you a limited, revocable, non-exclusive, non-transferable right
              to install and use the applicable integration with a properly licensed, supported version of Revit or
              Archicad for your internal professional or business purposes.
            </p>
            <p>
              You are responsible for system compatibility, backups, BIM host licenses, installation permissions, and
              testing updates before production use. We may release security, compatibility, or feature updates and may
              stop supporting older builds. You may not redistribute the installer, remove notices, resell access,
              reverse engineer protected components except where law expressly permits it, or circumvent technical
              restrictions.
            </p>
          </section>

          <section id="content">
            <h2>5. Your content and project data</h2>
            <p>
              As between you and Architecton, you retain your rights in prompts, BIM projects, project context, files,
              and other information you submit (“Input”). You represent that you have the rights and permissions needed
              to provide the Input and allow it to be processed, including any confidential, personal, client, consultant,
              or employer information contained in a project.
            </p>
            <p>
              You grant Architecton and its service providers a limited, worldwide right to host, reproduce, transmit,
              transform, and otherwise process Input only as necessary to provide, secure, support, and maintain the
              Service, comply with law, and enforce these Terms. This right does not transfer ownership of your BIM model
              to Architecton.
            </p>
            <p>
              Subject to applicable law and third-party rights, you may use the responses, proposals, reports, and other
              results returned to you (“Output”). Because AI systems can produce similar results for different users,
              Output may not be unique, and you are responsible for checking whether it can lawfully and safely be used.
            </p>
          </section>

          <section id="ai">
            <h2>6. AI output and BIM actions</h2>
            <div class="notice">
              <strong>Professional review is required.</strong> AI Output may be incomplete, inaccurate, non-compliant,
              unsuitable for construction, or based on misunderstood project context. Never rely on Architecton as the
              sole source of truth for design, structural safety, life safety, quantities, costs, codes, permits, or
              construction decisions.
            </div>
            <p>
              You must review Output and validate all proposed or completed BIM changes using qualified professionals,
              the native host application, project standards, and applicable laws and codes. Maintain appropriate model
              backups and version history before allowing changes.
            </p>
            <p>
              Architecton may offer approval modes ranging from confirmation before each supported change to more
              automated execution. By choosing a mode that permits automatic actions, you authorize supported operations
              within that mode and accept the increased risk of unintended model changes. You remain responsible for
              monitoring, validating, accepting, reverting, or correcting the result.
            </p>
          </section>

          <section id="acceptable-use">
            <h2>7. Acceptable use</h2>
            <p>You may not use the Service to:</p>
            <ul>
              <li>violate law, professional obligations, intellectual-property rights, privacy, confidentiality, sanctions, or export controls;</li>
              <li>access or alter a BIM project, system, account, or data without authorization;</li>
              <li>upload malware, secrets, regulated information, or personal data that is unnecessary for the requested task;</li>
              <li>probe, disrupt, overload, scrape, or bypass authentication, approvals, safety measures, rate limits, or usage restrictions;</li>
              <li>extract models, prompts, system instructions, source code, or service components to build a competing service;</li>
              <li>misrepresent AI Output as independently verified professional work or use it in a deceptive or harmful manner;</li>
              <li>permit another person to do any of the above through your account or installation.</li>
            </ul>
          </section>

          <section id="plans">
            <h2>8. Plans, usage limits, and payment</h2>
            <p>
              Plans may include monthly token limits, platform restrictions, feature limits, or other usage allowances.
              We measure provider-reported prompt and completion tokens and may reject, pause, or limit requests when an
              allowance is exhausted or activity threatens security or service reliability. Unused allowances do not
              carry over unless the applicable plan says otherwise.
            </p>
            <p>
              If you purchase a paid plan, the price, billing period, taxes, renewal, cancellation, and refund terms shown
              at checkout or in an order form apply. Fees are non-refundable except where the applicable purchase terms
              or mandatory law provide otherwise. We will provide legally required notice before material price changes
              affecting a renewal.
            </p>
          </section>

          <section id="third-parties">
            <h2>9. Third-party software and services</h2>
            <p>
              Architecton interoperates with third-party products and infrastructure, which may include Autodesk Revit,
              Graphisoft Archicad, operating-system components, cloud infrastructure, authentication services, and AI
              model providers. Your use of those products is governed by their separate licenses and terms. We do
              not control and are not responsible for third-party products, availability, updates, project formats, or
              policy changes.
            </p>
            <p>
              Autodesk, Revit, Graphisoft, Archicad, and other names are trademarks of their respective owners.
              Compatibility does not imply sponsorship, endorsement, or affiliation unless expressly stated.
            </p>
          </section>

          <section id="ownership">
            <h2>10. Architecton ownership and feedback</h2>
            <p>
              Architecton and its licensors retain all rights in the Service, software, agents, interfaces, workflows,
              documentation, branding, and related technology, excluding your Input and third-party components. No rights
              are granted except the limited rights expressly stated in these Terms.
            </p>
            <p>
              If you voluntarily provide suggestions or feedback, you permit us to use them without restriction or
              compensation, provided we do not publicly identify you as the source without permission.
            </p>
          </section>

          <section id="availability">
            <h2>11. Availability, changes, suspension, and termination</h2>
            <p>
              We may modify, add, remove, suspend, or discontinue features to improve the Service, address security or
              legal requirements, respond to third-party changes, or manage capacity. Beta, preview, experimental, and
              free features are provided for evaluation and may change or end without notice.
            </p>
            <p>
              You may stop using the Service at any time. We may restrict or terminate access if you breach these Terms,
              create security or legal risk, fail to pay applicable fees, or if continued service is no longer reasonably
              possible. Provisions that by their nature should survive—including ownership, disclaimers, liability, and
              accrued payment obligations—remain effective after termination.
            </p>
          </section>

          <section id="disclaimers">
            <h2>12. Disclaimers and limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, the Service and Output are provided “as is” and “as available.” We
              disclaim implied warranties of merchantability, fitness for a particular purpose, non-infringement, and any
              warranty that the Service will be uninterrupted, secure, accurate, error-free, or compatible with every BIM
              project, add-in, host update, or professional requirement.
            </p>
            <p>
              To the maximum extent permitted by law, Architecton and its suppliers will not be liable for indirect,
              incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenue, data,
              goodwill, project time, or model integrity arising from the Service or Output. Architecton’s aggregate
              liability for a claim will not exceed the amount you paid for the Service during the 12 months preceding
              the event giving rise to the claim. These limitations do not apply where prohibited by law or to liability
              that cannot legally be limited.
            </p>
          </section>

          <section id="general">
            <h2>13. General terms and contact</h2>
            <p>
              If any provision is unenforceable, it will be limited to the minimum extent necessary and the remaining
              provisions will continue in effect. A failure to enforce a provision is not a waiver. You may not assign
              these Terms without our consent; we may assign them in connection with a reorganization, financing,
              acquisition, or transfer of the Service.
            </p>
            <p>
              We may update these Terms by posting a revised version and effective date. If a change materially affects
              your rights, we will provide additional notice where required. Continued use after the effective date means
              you accept the revised Terms; otherwise, you must stop using the Service.
            </p>
            <p>
              Before starting formal proceedings, please contact
              <a href="mailto:support@architecton.ai">support@architecton.ai</a> so we can try to resolve the matter.
              Applicable law and any mandatory rights in your place of residence remain unaffected.
            </p>
          </section>
        </article>
      </div>
    </UContainer>
  </main>
</template>

<style scoped>
.legal-copy section { scroll-margin-top: 7rem; }
.legal-copy section + section { margin-top: 3.5rem; padding-top: 3.5rem; border-top: 1px solid #dfe5e1; }
.legal-copy h2 { margin: 0 0 1.25rem; font-size: clamp(1.65rem, 3vw, 2.15rem); line-height: 1.15; letter-spacing: -.025em; font-weight: 650; }
.legal-copy p, .legal-copy li { color: #59635e; font-size: 1rem; line-height: 1.8; }
.legal-copy p { margin: 0; }
.legal-copy p + p { margin-top: 1rem; }
.legal-copy ul { margin: 1rem 0 0; padding-left: 1.25rem; }
.legal-copy li + li { margin-top: .55rem; }
.legal-copy a { color: #287956; text-decoration: underline; text-underline-offset: 3px; }
.notice { margin-bottom: 1.5rem; border: 1px solid #d7cdb4; border-radius: 1rem; background: #fbf8ef; padding: 1.25rem; color: #544b38; line-height: 1.75; }
</style>
