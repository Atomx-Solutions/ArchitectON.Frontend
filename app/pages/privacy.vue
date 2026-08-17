<script setup lang="ts">
const lastUpdated = 'August 13, 2026'

const sections = [
  { id: 'scope', label: 'Scope and responsibility' },
  { id: 'data', label: 'Information we collect' },
  { id: 'use', label: 'How we use information' },
  { id: 'ai', label: 'AI and BIM processing' },
  { id: 'sharing', label: 'How information is shared' },
  { id: 'retention', label: 'Retention' },
  { id: 'security', label: 'Security' },
  { id: 'rights', label: 'Your rights' },
  { id: 'international', label: 'International transfers' },
  { id: 'changes', label: 'Changes and contact' }
] as const

useSeoMeta({
  title: 'Privacy Policy',
  description: 'How Architecton collects, uses, protects and shares information across its website and BIM integrations.'
})
</script>

<template>
  <main class="bg-white pt-32 pb-24 text-[#18201c] sm:pt-40">
    <UContainer class="px-5 max-[720px]:px-3.5">
      <header class="max-w-4xl border-b border-[#dfe5e1] pb-12">
        <p class="mb-4 text-xs font-extrabold tracking-[.14em] text-architecton-700 uppercase">Legal</p>
        <h1 class="m-0 text-[clamp(3rem,7vw,5rem)] leading-[.98] font-semibold tracking-[-.04em]">Privacy Policy</h1>
        <p class="mt-6 max-w-3xl text-lg leading-8 text-[#59635e]">
          This policy explains what information Architecton processes when you use our website, account services,
          AI-assisted BIM tools, and supported desktop integrations.
        </p>
        <div class="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#69736e]">
          <span><strong class="font-semibold text-[#27302c]">Effective:</strong> {{ lastUpdated }}</span>
          <span><strong class="font-semibold text-[#27302c]">Contact:</strong> support@architecton.ai</span>
        </div>
      </header>

      <div class="mt-12 grid gap-14 lg:grid-cols-[240px_minmax(0,760px)] lg:items-start">
        <aside class="rounded-2xl border border-[#dfe5e1] bg-[#f7f9f7] p-5 lg:sticky lg:top-28">
          <p class="mb-3 text-xs font-bold tracking-[.12em] text-[#65706a] uppercase">On this page</p>
          <nav aria-label="Privacy policy sections">
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
          <section id="scope">
            <h2>1. Scope and responsibility</h2>
            <p>
              This Privacy Policy applies to the Architecton website, accounts, APIs, downloadable add-ins, desktop
              chat, and related support services (collectively, the “Service”). In this policy, “Architecton,” “we,”
              “us,” and “our” refer to the provider of the Service.
            </p>
            <p>
              Architecton determines why and how personal information is processed for individual accounts. If an
              organization provides your account under a separate commercial agreement, that organization may control
              certain account and project information, and the commercial agreement may contain additional terms.
            </p>
          </section>

          <section id="data">
            <h2>2. Information we collect</h2>
            <h3>Account and profile information</h3>
            <p>
              We process information such as your name, email address, account identifier, role, plan, subscription
              status, and account creation or update dates. Authentication credentials are protected using appropriate
              technical and organizational safeguards; we do not have access to your plain-text password.
            </p>

            <h3>Chat content and instructions</h3>
            <p>
              We process the prompts, instructions, feedback, and other content you submit, together with AI responses,
              conversation titles, message status, approval choices, and related technical metadata. Chat history may
              be associated with your account so that you can reopen and manage conversations.
            </p>

            <h3>BIM and project context</h3>
            <p>
              When you use the Revit or Archicad integration, the Service may process the minimum project context needed
              to answer a request or perform an approved action. Depending on the feature, this may include the project
              or document name and identifier, active view, levels, element identifiers and categories, geometry or
              quantities, parameters, relationships, selections, and requested model changes. Architecton does not
              upload an entire native project file by default, but a request may transmit a bounded snapshot or other
              model data needed for that request.
            </p>

            <h3>Usage, device, and diagnostic information</h3>
            <p>
              We process the BIM platform and version, AI model used, request identifiers, prompt and completion token
              counts, timestamps, session activity, IP address, browser or operating-system information, and error or
              security logs. We use essential browser storage and similar technologies to maintain authentication and
              preferences. We do not sell personal information or use it for cross-context behavioral advertising.
            </p>

            <h3>Communications and billing</h3>
            <p>
              If you contact us, we process your contact details and message. If paid plans are offered, payment details
              may be collected directly by a payment provider; Architecton may receive transaction, subscription, tax,
              and limited payment-method information rather than full card details.
            </p>
          </section>

          <section id="use">
            <h2>3. How and why we use information</h2>
            <p>We process information where necessary to:</p>
            <ul>
              <li>create, authenticate, secure, and administer your account and desktop sessions;</li>
              <li>provide chat, model analysis, agent coordination, and approved BIM operations;</li>
              <li>maintain conversation history and synchronize it with your account;</li>
              <li>measure token consumption, enforce plan limits, prevent duplicate billing records, and administer subscriptions;</li>
              <li>diagnose failures, improve reliability, protect the Service, and prevent fraud or abuse;</li>
              <li>respond to support requests and send necessary service communications;</li>
              <li>comply with law and establish, exercise, or defend legal claims.</li>
            </ul>
            <p>
              Depending on your location and the context, our legal bases may include performing our contract with you,
              our legitimate interests in operating and securing the Service, your consent, and compliance with legal
              obligations. Where consent is required, you may withdraw it without affecting earlier lawful processing.
            </p>
          </section>

          <section id="ai">
            <h2>4. AI and BIM processing</h2>
            <p>
              Architecton sends relevant prompts and, when required, bounded BIM context to authorized service providers
              to generate a response or proposed action. Those providers process this content under their applicable
              agreements, privacy safeguards, and service settings.
            </p>
            <p>
              We do not use private chat or BIM content to train our own general-purpose AI models unless we introduce
              such a feature with clear notice and obtain any consent required by law. AI providers may have different
              retention and data-use practices. We apply available contractual and technical controls intended to limit
              use of private content, but applicable provider terms may still permit limited processing or retention.
              Do not submit project information that you are not permitted to share.
            </p>
            <div class="notice">
              <strong>Desktop integrations.</strong> Supported BIM integrations communicate securely with the Service.
              Information selected or required for a request may be transmitted to Architecton and authorized AI
              providers for processing. The integration does not upload an entire native project file by default.
            </div>
          </section>

          <section id="sharing">
            <h2>5. How information is shared</h2>
            <p>We may disclose information only as reasonably necessary to:</p>
            <ul>
              <li>cloud hosting, authentication, database, infrastructure, AI, payment, email, monitoring, and support providers;</li>
              <li>your organization’s authorized administrators, where your account is organization-managed;</li>
              <li>professional advisers, auditors, insurers, or transaction counterparties under appropriate confidentiality obligations;</li>
              <li>courts, regulators, law enforcement, or other parties when required by law or necessary to protect rights, safety, and security;</li>
              <li>a successor in a merger, financing, acquisition, reorganization, or sale of all or part of our business.</li>
            </ul>
            <p>
              Third-party BIM applications and connected services remain governed by their own licenses and privacy
              terms. Their inclusion or compatibility does not imply sponsorship, endorsement, or affiliation.
            </p>
            <p>
              We use carefully selected service providers to support functions such as hosting, authentication, data
              storage, communications, security, payments, and AI processing. They are authorized to process information
              only for the purposes for which they are engaged and are subject to appropriate contractual and
              data-protection obligations. We may update our providers as the Service evolves.
            </p>
          </section>

          <section id="retention">
            <h2>6. Retention and deletion</h2>
            <p>
              We retain account information while your account is active and for a reasonable period afterward where
              needed for security, dispute resolution, legal compliance, or legitimate business records. Conversations
              and messages are retained until you delete them, request account deletion, or they are removed under an
              applicable retention schedule. Deleting a conversation removes its associated messages from active
              account history, subject to limited backups, security records, and legal requirements.
            </p>
            <p>
              Token-usage and transaction records may be retained longer where needed for limits, accounting, fraud
              prevention, and legal compliance. Short-lived desktop authorization codes expire automatically. Desktop
              authorization credentials are protected using industry-standard safeguards and expire or may be revoked
              in accordance with their purpose and security requirements.
            </p>
          </section>

          <section id="security">
            <h2>7. Security</h2>
            <p>
              We use appropriate technical and organizational safeguards designed to protect information, including
              access controls, encryption in transit, credential protection, monitoring, and restricted administrative
              access. We review these measures in light of the nature of the information and relevant risks. No system
              is completely secure, so you should avoid submitting information that is unnecessary for your request and
              promptly report any suspected account compromise.
            </p>
          </section>

          <section id="rights">
            <h2>8. Your rights and choices</h2>
            <p>
              Depending on applicable law, you may request access to, correction of, deletion of, restriction of, or a
              portable copy of your personal information. You may also object to certain processing, withdraw consent,
              and complain to your local data-protection authority. We may verify your identity before completing a
              request and may retain information where an exception under applicable law permits or requires it.
            </p>
            <p>
              Where the GDPR or similar law applies, you may also lodge a complaint with the supervisory authority in
              your country. Architecton does not use personal information to make solely automated decisions that
              produce legal or similarly significant effects about you, unless we provide specific notice and establish
              a lawful basis before doing so.
            </p>
            <p>
              You can delete individual chat conversations from supported clients, sign out to remove the active desktop
              credential from your device, or contact us to request account-level access or deletion.
            </p>
          </section>

          <section id="international">
            <h2>9. International transfers</h2>
            <p>
              Architecton and its service providers may process information in countries other than the country where
              you live. Where required, we rely on recognized safeguards such as adequacy decisions, contractual
              protections, or other lawful transfer mechanisms.
            </p>
          </section>

          <section id="changes">
            <h2>10. Changes and contact</h2>
            <p>
              We may update this policy as the Service, providers, or legal requirements change. We will post the revised
              policy with a new effective date and provide additional notice where required for material changes.
            </p>
            <p>
              Questions and privacy requests may be sent to
              <a href="mailto:support@architecton.ai">support@architecton.ai</a>. Please do not include confidential BIM
              data or passwords in an email request.
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
.legal-copy h3 { margin: 1.75rem 0 .6rem; font-size: 1.05rem; line-height: 1.45; font-weight: 650; color: #27302c; }
.legal-copy p, .legal-copy li { color: #59635e; font-size: 1rem; line-height: 1.8; }
.legal-copy p { margin: 0; }
.legal-copy p + p { margin-top: 1rem; }
.legal-copy ul { margin: 1rem 0 0; padding-left: 1.25rem; }
.legal-copy li + li { margin-top: .55rem; }
.legal-copy a { color: #287956; text-decoration: underline; text-underline-offset: 3px; }
.notice { margin-top: 1.5rem; border: 1px solid #cfdad3; border-radius: 1rem; background: #f4f8f5; padding: 1.25rem; color: #445049; line-height: 1.75; }
</style>
