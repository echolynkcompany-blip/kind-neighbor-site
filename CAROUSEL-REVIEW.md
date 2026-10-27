# Unpublished carousel design

This branch adds a four-story carousel above the current priority waitlist: companionship/social visits and technology help; light housekeeping/laundry, meal preparation and home organization; shopping/errands, appointment companionship and family respite companionship; and agreeing the support plan together.

No autoplay. Next/previous buttons, numbered story buttons, keyboard arrows/Home/End, touch scrolling, reduced-motion support and a readable four-story fallback without JavaScript. The original SVG artwork is decorative and contains no actual client photographs or personal information. No external runtime dependencies or analytics are added.

`carousel-preview.html` is a standalone, offline review file with inline styles, illustrations and script. It does not submit information or call the production API. Open it in a normal browser to review the design. Automated navigation, keyboard, swipe-position and reduced-motion checks: `node --test carousel.test.mjs`. Existing waitlist behavior checks remain `node --test launch.test.mjs`.

The website draft retains the current simplified waitlist, its existing submission endpoint, no date/time inputs, no footer staff login, and the header staff link. Existing production website and operations data are unchanged by this preview branch.

The carousel contains specific planned service descriptions. This draft is intentionally not published to the production website. Before publication, complete the registration/launch requirements and supply the actual registration number for service advertising. This draft does not represent regulatory approval. Review contact information, scope, actual staffing, availability and service terms before merging. Publish `index.html`, `carousel.css` and `carousel.js`; the review file is for internal design review.

Verification: three carousel behavior tests and three existing waitlist behavior tests pass; HTML parsed with unique IDs and four slides. The cloud browser blocked opening a local file URL, so this preview has not had a rendered browser walkthrough in this environment.
