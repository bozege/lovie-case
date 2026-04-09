# Feature Specification: P2P Payment Request Experience

**Feature Branch**: `001-p2p-payment-request`  
**Created**: 2026-04-08  
**Status**: Draft  
**Input**: User description: "Build a peer-to-peer payment request feature for a consumer fintech app with authentication, dashboards, request details, payment simulation, expiration, E2E video tests, and public deployment."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create and share a payment request (Priority: P1)

As a signed-in user, I can create a payment request for a friend using an email address or phone number, see that request in my outgoing list, and copy a shareable link so I can request money without leaving the app.

**Why this priority**: Request creation is the minimum valuable slice of the product. Without it, there is no request lifecycle to manage, demonstrate, or test.

**Independent Test**: This can be tested independently by signing in, submitting a valid request, and verifying that the request appears in the outgoing dashboard with a unique share link and a pending status.

**Acceptance Scenarios**:

1. **Given** a signed-in user on the request form, **When** they submit a valid recipient contact, positive amount, and optional note, **Then** the system creates a new request with a unique identifier, a shareable link, a pending status, and a seven-day expiration timestamp.
2. **Given** a signed-in user entering invalid data, **When** they submit an empty, malformed, or non-positive request payload, **Then** the system rejects the submission with field-level validation feedback and does not create a request.

---

### User Story 2 - Manage incoming and outgoing requests (Priority: P2)

As a signed-in user, I can review both requests I sent and requests I received, search and filter them, and open a detail view to understand the current state of each request.

**Why this priority**: The dashboard and detail view turn isolated requests into a usable product and are necessary for demonstrating the lifecycle states the assignment asks for.

**Independent Test**: This can be tested independently by loading seeded or previously created requests, filtering by status, searching by contact, and confirming that the correct requests appear in incoming and outgoing sections and link to details.

**Acceptance Scenarios**:

1. **Given** a signed-in user with multiple incoming and outgoing requests, **When** they view the dashboard, **Then** they can see separate incoming and outgoing request lists with visible status indicators.
2. **Given** a signed-in user on the dashboard, **When** they apply a status filter or a sender or recipient search term, **Then** the list updates to show only matching requests.
3. **Given** a signed-in user selecting a request, **When** they open the detail view, **Then** they see amount, note, sender and recipient information, timestamps, expiration information, and only the actions valid for their role and the request status.

---

### User Story 3 - Fulfill or resolve a request (Priority: P3)

As a recipient, I can pay or decline an incoming request, and as a sender, I can cancel a pending outgoing request. The system simulates payment processing, prevents invalid actions on expired requests, and keeps both sides of the request lifecycle in sync.

**Why this priority**: This completes the assignment’s core lifecycle and demonstrates that the feature is more than a form and list UI.

**Independent Test**: This can be tested independently by opening an existing pending request as the recipient or sender, performing an allowed action, and verifying the resulting status and UI updates across dashboards and details.

**Acceptance Scenarios**:

1. **Given** a signed-in recipient viewing a pending, unexpired incoming request, **When** they click Pay, **Then** the app shows a 2-3 second loading state, marks the request as paid, and reflects the new status in both the recipient and sender views.
2. **Given** a signed-in recipient viewing a pending, unexpired incoming request, **When** they click Decline, **Then** the system marks the request as declined and removes payment actions from subsequent views.
3. **Given** a signed-in sender viewing their own pending outgoing request, **When** they click Cancel, **Then** the system marks the request as canceled and removes any ability to pay that request.
4. **Given** any user viewing an expired request, **When** they attempt a payment action, **Then** the system blocks the action and shows the request as expired.

## Edge Cases

- What happens when a user enters a malformed email address or phone number as the recipient contact?
- What happens when a user enters `0`, a negative amount, or an amount with invalid currency formatting?
- How does the system behave when a request expires while the detail page is already open?
- How does the system reconcile a request that was pending at dashboard load time but has since become expired?
- What happens when a user opens a share link before signing in?
- What happens when a sender tries to cancel a request that has already been paid, declined, or expired?
- What happens when a recipient tries to pay or decline a request that has already transitioned to a terminal state in another session?
- How does the search experience behave when there are no matching requests?
- What does the UI show when a dashboard section is empty?
- How is the system expected to behave if persistence or network calls fail during request creation or payment simulation?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST authenticate users with a simple email-based flow suitable for a public demo.
- **FR-002**: The system MUST restore an authenticated session when a returning user revisits the app.
- **FR-003**: The system MUST allow authenticated users to create a payment request with recipient contact, amount, and an optional note.
- **FR-004**: The system MUST validate that recipient contact is a valid email address or phone-number-like string before request creation.
- **FR-005**: The system MUST validate that the amount is greater than zero before request creation.
- **FR-006**: The system MUST persist created payment requests and their current lifecycle status.
- **FR-007**: The system MUST assign each payment request a unique ID and a unique shareable link.
- **FR-008**: The system MUST set each newly created request to a pending state with an expiration time seven days after creation.
- **FR-009**: The system MUST present separate dashboard views for outgoing requests and incoming requests.
- **FR-010**: The system MUST display request status values that include Pending, Paid, Declined, Canceled, and Expired where applicable.
- **FR-011**: The system MUST allow users to filter requests by status.
- **FR-012**: The system MUST allow users to search requests by sender or recipient contact information.
- **FR-013**: The system MUST provide a request detail view showing amount, note, sender, recipient, creation time, and expiration state.
- **FR-014**: The system MUST show Pay and Decline actions only for eligible incoming requests.
- **FR-015**: The system MUST show Cancel only for eligible outgoing pending requests.
- **FR-016**: The system MUST simulate payment processing with a visible loading state lasting approximately 2-3 seconds.
- **FR-017**: The system MUST update a paid request so the sender and recipient both observe the paid status in their respective views.
- **FR-018**: The system MUST allow recipients to decline eligible incoming requests.
- **FR-019**: The system MUST allow senders to cancel eligible outgoing pending requests.
- **FR-020**: The system MUST block payment for expired requests.
- **FR-021**: The system MUST display expiration information, including a countdown or equivalent time-remaining indicator, on request details.
- **FR-022**: The system MUST reconcile expired pending requests so dashboards and details consistently show an expired state.
- **FR-023**: The system MUST ensure users can only access requests they sent, requests addressed to them, or requests explicitly opened through a valid share link and then authenticated.
- **FR-024**: The system MUST represent money in minor units or an equivalent precision-safe format internally.
- **FR-025**: The system MUST be usable on both mobile and desktop viewport sizes.
- **FR-026**: The system MUST provide automated E2E coverage for the primary request lifecycle.
- **FR-027**: The test suite MUST generate an automated screen recording artifact for E2E execution.
- **FR-028**: The repository MUST include Spec-Kit-generated specification, planning, and task artifacts for this feature.
- **FR-029**: The repository MUST include submission-ready documentation covering setup, testing, deployment, and AI-assisted workflow notes.
- **FR-030**: The application MUST be deployable to a public URL that can be tested without local setup.

### Key Entities *(include if feature involves data)*

- **User**: An authenticated person using the app, identified by email and authorized to create, receive, view, and act on payment requests according to their relationship to each request.
- **Payment Request**: A request for money between a sender and a recipient, containing recipient contact, optional resolved recipient identity, amount, note, status, share token, timestamps, and expiration metadata.
- **Request Status Transition**: The allowed lifecycle change of a payment request between pending, paid, declined, canceled, and expired states based on user role, action, and time.
- **Share Link**: A unique URL token that routes a user to a specific request detail page and supports the request-sharing experience.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can sign in and create a valid payment request in under 2 minutes without needing documentation.
- **SC-002**: A created request appears in the sender’s outgoing list and remains accessible through a unique share link immediately after creation.
- **SC-003**: A recipient can complete the happy-path request payment flow, including the simulated loading state, with the final paid state visible in both sender and recipient dashboards.
- **SC-004**: Expired requests are consistently shown as expired and reject payment actions in the detail view.
- **SC-005**: Automated E2E tests cover the critical lifecycle paths and produce a video artifact without requiring manual screen recording steps.
- **SC-006**: The repository contains sufficient Spec-Kit and README documentation that another PM or AI agent can understand the feature scope, constraints, assumptions, and execution steps without relying on chat history.

## Assumptions

- The initial release targets a responsive web app rather than a mobile-native app.
- Email magic-link authentication satisfies the assignment’s simple email-based auth requirement.
- The product will use USD-only display and storage semantics for v1.
- Phone support is limited to format validation and does not include SMS delivery.
- Payment fulfillment is simulated and does not integrate with real card, bank, or wallet rails.
- Request recipients may first be stored as contact information and later matched to a signed-in user identity when possible.
- Share links may require the viewer to authenticate before they can see full request details or act on the request.
- The app will optimize for a polished MVP and assignment completeness rather than broad feature expansion beyond the required lifecycle.
