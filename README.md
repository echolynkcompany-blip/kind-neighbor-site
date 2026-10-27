# The Kind Neighbor Co. — prelaunch website

## Current public version
The public index is a neutral preparation notice. There are no service offers, prices, inquiry form, bookings or payments. AHCA registration has not been obtained. The full landing-page redesign is retained on `launch-redesign`; do not merge until registration is issued and the actual registration number is inserted in its footer. This holding page uses noindex until launch. The existing script remains available for the later launch form but is not loaded on the holding page.

## Domain: thekindneighbor.site (Hostinger)
The existing host is GitHub Pages, repository echolynkcompany-blip/kind-neighbor-site. Purchasing the domain does not require moving hosting to Hostinger.

1. In GitHub account Settings → Pages, add and verify `thekindneighbor.site` using the exact TXT record GitHub generates. Add that TXT record in Hostinger’s DNS zone; keep it after verification.
2. In repository Settings → Pages, set Custom domain to `thekindneighbor.site` and Save before pointing DNS. This should create the root CNAME file for branch publishing.
3. In Hostinger DNS, replace conflicting website records for @ and www only. Preserve unrelated TXT, MX, DKIM and email records. Set these records:

| Type | Name | Target |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | echolynkcompany-blip.github.io |

4. Wait for DNS check and certificate issuance. Select Enforce HTTPS in GitHub Pages. Test both apex and www; www should redirect to apex. Do not enable broad wildcard DNS. No nameserver change is needed if Hostinger already manages DNS.
5. Confirm assets load on the custom-domain root and the original Pages URL redirects correctly.

Official setup: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Launch gates
- Obtain AHCA registration; insert actual number in launch footer. Confirm permitted services, service area, advertising and operating requirements before public service promotion.
- Reconcile launch-redesign with current main before merging; preserve domain configuration and replace the holding notice intentionally.
- Confirm actual business contact details, prices, expenses, availability, service boundaries and privacy information. Do not claim certifications, screening, insurance or registration not yet established.
- Run a clearly labeled TEST inquiry from the final domain. Verify one New inquiry in owner view and no access to private records without sign-in. Check validation, retry behavior and mobile layout.
- Confirm proposal → signed agreement → client onboarding → scheduled visit → assigned companion → clock in/out → notes/sign-off → owner review → invoice works with TEST records.
- Verify current Gmail connection and send a TEST invoice to the owner. Google OAuth app in Testing can cause short-lived refresh-token access for Gmail scopes; confirm publishing/verification requirements in Google Cloud before relying on unattended sending.
- Stripe remains test-only until matching live credentials/webhook and explicit live enablement are set. Do not treat test checkout as a real payment.
- Review reminder recipients/schedules before enabling automatic sends.
- Verify Railway /data volume, recent backup and a downloaded off-volume backup. Test recovery with dummy data outside production.
- Verify companion accounts, temporary-password change, assignments, deactivation and denied access to owner finances.
- After registration and final publication, remove noindex, add sitemap/robots and accurate local-business structured data, verify Search Console, request indexing, and update the verified Google Business Profile website link.

Florida sources: https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0400-0499/0400/Sections/0400.509.html and chapter 408, section 408.812.
