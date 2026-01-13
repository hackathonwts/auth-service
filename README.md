# VERISQ – The Social Meetup Application

VERISQ is a **real‑time social meetup platform** that helps users connect through **SOLO (1‑to‑1)** and **CREW (group‑based)** meetups across shared interests like Travel, Dining, Events, Nightlife, and Concerts.

This README is aligned with **VERIS DSD v1.2** and reflects the finalized **product flows, backend intent model, and notification rules**.

---

## 🚀 Core Philosophy

VERISQ is built around **intent‑based interactions**:

- **PASS** → No interest (silent, permanent hide)
- **WAVE** → Soft interest (social signal)
- **MESSAGE** → Strong intent (explicit request)
- **ACCEPT** → Mutual consent → Chat access

This separation avoids spam, respects user intent, and creates a more natural social experience.

---

## 🧱 Tech Stack

| Layer             | Technology                            |
| ----------------- | ------------------------------------- |
| Language          | TypeScript / JavaScript               |
| Backend Framework | NestJS                                |
| Database          | MongoDB                               |
| Realtime          | WebSockets (Gateway)                  |
| Pub/Sub           | Bullmq + Redis                        |
| Auth              | JWT + Device binding                  |
| Notifications     | Push + In‑App                         |
| Package Manager   | Yarn                                  |
| Architecture      | Modular Monolith → Microservice‑ready |

---

## Backend Code Structure

```text

├── public
├── 📁src
│    ├── 📁assets
│    │    ├── nest.jpg
│    │    ├── roles.json
│    │    └── users.json
│    ├── 📁common
│    │    ├── 📁bases
│    │    │    └── base.repository.ts
│    │    ├── 📁constants
│    │    │    └── messages.ts
│    │    ├── 📁decorator
│    │    │    ├── login-user.decorator.ts
│    │    │    └── role.decorator.ts
│    │    ├── 📁dto
│    │    │    └── common.dto.ts
│    │    ├── 📁enum
│    │    │    ├── common.enum.ts
│    │    │    ├── sort-order.enum.ts
│    │    │    ├── status.enum.ts
│    │    │    └── user-role.enum.ts
│    │    ├── 📁filters
│    │    │    └── exception.filter.ts
│    │    ├── 📁guards
│    │    │    └── rbac.guard.ts
│    │    ├── 📁interceptors
│    │    │    ├── files.interceptor.ts
│    │    │    └── response.interceptor.ts
│    │    ├── 📁interface
│    │    │    └── index.ts
│    │    ├── 📁logger
│    │    │    └── winston.logger.ts
│    │    ├── 📁pipes
│    │    │    ├── mongoid.pipe.ts
│    │    │    └── validation.pipe.ts
│    │    ├── 📁queue
│    │    │    ├── leaderboard.processor.ts
│    │    │    ├── mail.processor.ts
│    │    │    ├── notification.processor.ts
│    │    │    └── queue.module.ts
│    │    ├── 📁redis
│    │    │    ├── chat-redis.service.ts
│    │    │    ├── redis.module.ts
│    │    │    └── redis.provider.ts
│    │    ├── 📁types
│    │    │    ├── api-response.type.ts
│    │    │    ├── jwt.type.ts
│    │    │    └── multer-s3-file.d.ts
│    │    └── 📁unit-test-config
│    │        ├── mongoose-test-module.ts
│    │        └── unit-test-configuration.ts
│    ├── 📁config
│    │    └── 📁gateways
│    │        ├── email.gateway.ts
│    │        ├── fcm.gateway.ts
│    │        └── sms.gateway.ts
│    ├── 📁helpers
│    │    ├── helpers.module.ts
│    │    ├── mailer.helper.ts
│    │    ├── notification.helper.ts
│    │    ├── pagination.helper.ts
│    │    ├── response.helper.ts
│    │    ├── social-auth.helper.ts
│    │    └── utils.helper.ts
│    ├── 📁modules
│    │    ├── 📁auth
│    │    │    ├── 📁controllers
│    │    │    │    ├── admin.controller.ts
│    │    │    │    └── user.controller.ts
│    │    │    ├── 📁dto
│    │    │    │    ├── auth.dto.ts
│    │    │    ├── 📁strategy
│    │    │    │    └── auth.strategy.ts
│    │    │    ├── auth.module.ts
│    │    │    └── auth.service.ts
│    │    ├── 📁category
│    │    │    ├── 📁dto
│    │    │    │    └── category.dto.ts
│    │    │    ├── 📁repositories
│    │    │    │    ├── category.repository.module.ts
│    │    │    │    ├── category.repository.ts
│    │    │    │    └── index.ts
│    │    │    ├── 📁schemas
│    │    │    │    └── category.schema.ts
│    │    │    ├── category.controller.e2e-spec.ts
│    │    │    ├── category.controller.ts
│    │    │    ├── category.module.ts
│    │    │    └── category.service.ts
│    │    ├── 📁cms
│    │    │    ├── 📁dto
│    │    │    │    └── cms.dto.ts
│    │    │    ├── 📁repositories
│    │    │    │    ├── cms.repository.module.ts
│    │    │    │    ├── cms.repository.ts
│    │    │    │    └── index.ts
│    │    │    ├── 📁schemas
│    │    │    │    └── cms.schema.ts
│    │    │    ├── cms.controller.e2e-spec.ts
│    │    │    ├── cms.controller.ts
│    │    │    ├── cms.module.ts
│    │    │    └── cms.service.ts
│    │    ├── 📁crew-chat-message
│    │    │    ├── crew-chat-message.controller.ts
│    │    │    ├── crew-chat-message.gateway.ts
│    │    │    ├── crew-chat-message.module.ts
│    │    │    ├── crew-chat-message.repository.ts
│    │    │    ├── crew-chat-message.schema.ts
│    │    │    ├── crew-chat-message.service.ts
│    │    │    └── ws-jwt.guard.ts
│    │    ├── 📁crew-chat-room
│    │    │    ├── crew-chat-room.module.ts
│    │    │    ├── crew-chat-room.repository.ts
│    │    │    ├── crew-chat-room.schema.ts
│    │    │    └── crew-chat-room.service.ts
│    │    ├── 📁crew-invites
│    │    │    ├── 📁controllers
│    │    │    │    └── user.controller.ts
│    │    │    ├── crew-invites.dto.ts
│    │    │    ├── crew-invites.module.ts
│    │    │    ├── crew-invites.repository.ts
│    │    │    ├── crew-invites.schema.ts
│    │    │    └── crew-invites.service.ts
│    │    ├── 📁crew-members
│    │    │    ├── crew-members.module.ts
│    │    │    ├── crew-members.repository.ts
│    │    │    └── crew-members.schema.ts
│    │    ├── 📁crew-requests
│    │    │    ├── 📁controllers
│    │    │    │    └── user.controller.ts
│    │    │    ├── crew-requests.dto.ts
│    │    │    ├── crew-requests.module.ts
│    │    │    ├── crew-requests.repository.ts
│    │    │    ├── crew-requests.schema.ts
│    │    │    └── crew-requests.service.ts
│    │    ├── 📁crews
│    │    │    ├── 📁controllers
│    │    │    │    ├── user.controller.ts
│    │    │    ├── crews.dto.ts
│    │    │    ├── crews.module.ts
│    │    │    ├── crews.repository.ts
│    │    │    ├── crews.schema.ts
│    │    │    └── crews.service.ts
│    │    ├── 📁faq
│    │    │    ├── 📁dto
│    │    │    │    └── faq.dto.ts
│    │    │    ├── 📁repositories
│    │    │    │    ├── faq.repository.module.ts
│    │    │    │    ├── faq.repository.ts
│    │    │    │    └── index.ts
│    │    │    ├── 📁schemas
│    │    │    │    └── faq.schema.ts
│    │    │    ├── faq.controller.e2e-spec.ts
│    │    │    ├── faq.controller.ts
│    │    │    ├── faq.module.ts
│    │    │    └── faq.service.ts
│    │    ├── 📁meetup-interaction
│    │    │    ├── meetup-interaction.controller.ts
│    │    │    ├── meetup-interaction.dto.ts
│    │    │    ├── meetup-interaction.module.ts
│    │    │    ├── meetup-interaction.repository.ts
│    │    │    ├── meetup-interaction.schema.ts
│    │    │    └── meetup-interaction.service.ts
│    │    ├── 📁notification
│    │    │    ├── 📁controllers
│    │    │    │    ├── admin.controller.ts
│    │    │    │    └── user.controller.ts
│    │    │    ├── notification.dto.ts
│    │    │    ├── notification.module.ts
│    │    │    ├── notification.repository.ts
│    │    │    ├── notification.schema.ts
│    │    │    └── notification.service.ts
│    │    ├── 📁notification-user
│    │    │    ├── notification-user.module.ts
│    │    │    ├── notification-user.repository.ts
│    │    │    └── notification-user.schema.ts
│    │    ├── 📁page
│    │    │    ├── 📁controllers
│    │    │    │    ├── admin.controller.ts
│    │    │    │    └── user.controller.ts
│    │    │    ├── page.dto.ts
│    │    │    ├── page.module.ts
│    │    │    ├── page.repository.ts
│    │    │    ├── page.schema.ts
│    │    │    └── page.service.ts
│    │    ├── 📁question
│    │    │    ├── 📁controllers
│    │    │    │    └── admin.controller.ts
│    │    │    ├── question.dto.ts
│    │    │    ├── question.module.ts
│    │    │    ├── question.repository.ts
│    │    │    ├── question.schema.ts
│    │    │    └── question.service.ts
│    │    ├── 📁refresh-token
│    │    │    ├── 📁repository
│    │    │    │    └── refresh-token.repository.ts
│    │    │    ├── 📁schemas
│    │    │    │    └── refresh-token.schema.ts
│    │    │    ├── refresh-token.module.ts
│    │    ├── 📁role
│    │    │    ├── 📁dto
│    │    │    │    └── role.dto.ts
│    │    │    ├── 📁repositories
│    │    │    │    ├── role.repository.module.ts
│    │    │    │    └── role.repository.ts
│    │    │    ├── 📁schemas
│    │    │    │    └── role.schema.ts
│    │    │    ├── role.controller.e2e-spec.ts
│    │    │    ├── role.controller.ts
│    │    │    ├── role.module.ts
│    │    │    └── role.service.ts
│    │    ├── 📁solo-chat-message
│    │    │    ├──  solo-chat-message.dto.ts
│    │    │    ├── solo-chat-message.controller.ts
│    │    │    ├── solo-chat-message.gateway.ts
│    │    │    ├── solo-chat-message.module.ts
│    │    │    ├── solo-chat-message.repository.ts
│    │    │    ├── solo-chat-message.schema.ts
│    │    │    ├── solo-chat-message.service.ts
│    │    │    ├── ws-auth.middleware.ts
│    │    │    └── ws-jwt.guard.ts
│    │    ├── 📁solo-chat-room
│    │    │    ├──  solo-chat-room.dto.ts
│    │    │    ├── solo-chat-room.controller.ts
│    │    │    ├── solo-chat-room.module.ts
│    │    │    ├── solo-chat-room.repository.ts
│    │    │    ├── solo-chat-room.schema.ts
│    │    │    └── solo-chat-room.service.ts
│    │    ├── 📁solo-match
│    │    │    ├── solo-match.controller.ts
│    │    │    ├── solo-match.dto.ts
│    │    │    ├── solo-match.module.ts
│    │    │    ├── solo-match.repository.ts
│    │    │    ├── solo-match.schema.ts
│    │    │    └── solo-match.service.ts
│    │    ├── 📁solo-requests
│    │    │    ├── solo-requests.controller.ts
│    │    │    ├── solo-requests.dto.ts
│    │    │    ├── solo-requests.module.ts
│    │    │    ├── solo-requests.repository.ts
│    │    │    ├── solo-requests.schema.ts
│    │    │    └── solo-requests.service.ts
│    │    ├── 📁user
│    │    │    ├── 📁controllers
│    │    │    │    ├── admin.controller.ts
│    │    │    │    └── user.controller.ts
│    │    │    ├── user.dto.ts
│    │    │    ├── user.module.ts
│    │    │    ├── user.repository.ts
│    │    │    ├── user.schema.ts
│    │    │    └── user.service.ts
│    │    └── 📁user-devices
│    │        ├── 📁dto
│    │        │    └── user-devices.dto.ts
│    │        ├── 📁repository
│    │        │    ├── user-device-repository.module.ts
│    │        │    └── user-device.repository.ts
│    │        └── 📁schemas
│    │            └── user-device.schema.ts
│    ├── app.module.ts
│    ├── config.module.ts
│    ├── main.ts
│    └── migrate.ts
├── 📁views
│    ├── 📁email-templates
│    │    ├── 📁forgot-password
│    │    │    └── html.ejs
│    │    ├── 📁forgot-password-user
│    │    │    └── html.ejs
│    │    ├── 📁user-status
│    │    │    └── html.ejs
│    │    └── 📁verify-email
│    │        └── html.ejs
│    └── 📁pdf-templates
│        └── report.ejs
├── .env.development
├── .env.example
├── .gitignore
├── .gitlab-ci.yml
├── .prettierrc
├── .yarnrc
├── docker-compose-dev.yml
├── docker-compose-prod.yml
├── docker-compose.yaml
├── DockerfileDev
├── DockerfileProd
├── eslint.config.mjs
├── jest.config.js
├── nest-cli.json
├── note.txt
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

## 🧭 High‑Level User Journey

```plan
User registers → onboarding
        ↓
Select Category (Travel, Dining, Events, Nightlife, Concerts)
        ↓
Select Meetup Type → SOLO or CREW
        ↓
Discovery → Interactions → Match / Membership → Chat
```

---

## 🔵 SOLO MEETUP FLOW (1‑to‑1)

### Solo Visual Flow

```plan
User registers → onboarding
        ↓
Select Category
        ↓
Select Meetup → SOLO
        ↓
Solo Discovery (filters)

User A sees User B
   ↓
PASS → Next profile

WAVE → Notify B
   ↓
B WAVE BACK → MATCH → CHAT

MESSAGE → REQUEST
   ↓
B ACCEPT → MATCH → CHAT
```

### Solo Key Rules

- Mutual consent is **mandatory** for chat
- WAVE requires **reciprocity**
- MESSAGE bypasses wave but requires approval
- PASS is permanent & silent

---

## 🟣 CREW MEETUP FLOW (Group)

### Crew Visual Flow

```plan
User registers → onboarding
        ↓
Select Category
        ↓
Select Meetup → CREW
        ↓
Crew Discovery (filters)

User sees Crew
   ↓
PASS → Next Crew

WAVE → Notify Host
   ↓
Host may INVITE

MESSAGE → Join Request
   ↓
Host ACCEPT
   ↓
CrewMember created
   ↓
CrewChatRoom access
   ↓
Real-time group chat
```

### Crew Key Rules

- **Host authority model**
- No mutual wave concept
- Only Host can approve membership
- Chat is unlocked **only after membership**

---

## 🔁 Unified Interaction Matrix

| Action  | Context | Meaning        | Backend Result    |
| ------- | ------- | -------------- | ----------------- |
| PASS    | SOLO    | Not interested | Hide profile      |
| WAVE    | SOLO    | Soft interest  | Notify user       |
| MESSAGE | SOLO    | Strong intent  | SoloRequest       |
| ACCEPT  | SOLO    | Mutual consent | SoloMatch + Chat  |
| PASS    | CREW    | Not interested | Hide crew         |
| WAVE    | CREW    | Soft interest  | Notify host       |
| MESSAGE | CREW    | Join request   | CrewJoinRequest   |
| ACCEPT  | CREW    | Approval       | CrewMember + Chat |

---

## 🔔 NOTIFICATION SYSTEM

Notifications are **non‑spammy**, **intent‑driven**, and **context aware**.

### SOLO — Discovery Interactions

| Trigger         | Actor  | Receiver | Push | In‑App | Email | Notes         |
| --------------- | ------ | -------- | ---- | ------ | ----- | ------------- |
| WAVE sent       | User A | User B   | ✅   | ✅     | ❌    | Soft interest |
| WAVE back       | User B | User A   | ✅   | ✅     | ❌    | Creates match |
| PASS            | User   | —        | ❌   | ❌     | ❌    | Silent        |
| MESSAGE request | User A | User B   | ✅   | ✅     | ❌    | Strong intent |

### SOLO — Match & Chat

| Trigger          | Actor  | Receiver | Push | In‑App | Notes           |
| ---------------- | ------ | -------- | ---- | ------ | --------------- |
| Request accepted | User B | User A   | ✅   | ✅     | Match created   |
| Auto‑match       | System | A & B    | ✅   | ✅     | Wave ↔ Wave     |
| New message      | User   | Peer     | ✅*  | ✅     | Push if offline |

---

### CREW — Discovery Interactions

| Trigger        | Actor | Receiver | Push | In‑App | Notes           |
| -------------- | ----- | -------- | ---- | ------ | --------------- |
| WAVE crew      | User  | Host     | ✅   | ✅     | Interest signal |
| MESSAGE (Join) | User  | Host     | ✅   | ✅     | Approval needed |
| PASS           | User  | —        | ❌   | ❌     | Silent          |

### CREW — Membership & Chat

| Trigger       | Actor  | Receiver | Push | In‑App | Notes           |
| ------------- | ------ | -------- | ---- | ------ | --------------- |
| Join accepted | Host   | User     | ✅   | ✅     | Member created  |
| Invite sent   | Host   | User     | ✅   | ✅     | Optional accept |
| Group message | Member | Crew     | ✅*  | ✅     | Push if offline |

---

## 🧩 Core Backend Modules

```text
src/
 ├─ auth/
 ├─ user/
 ├─ profile/
 ├─ device/
 ├─ category/
 ├─ discovery/
 ├─ meetup/
 │   ├─ solo/
 │   └─ crew/
 ├─ interaction/
 ├─ match/
 ├─ chat/
 ├─ notification/
 └─ common/
```

### Key Entities

- User
- Profile
- Category
- SoloInteraction
- CrewInteraction
- SoloRequest
- CrewJoinRequest
- Match
- Crew
- CrewMember
- ChatRoom
- Message
- Notification

---

## ⚙️ Environment Setup

```bash
# install dependencies
yarn install

# development
yarn dev

# production build
yarn build

# production start
yarn start
```

### Required ENV Variables

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/verisq
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

---

## 🛡️ Design Guarantees

- No unsolicited chat access
- No noisy notifications
- PASS is always respected
- Host‑controlled group safety
- Scales to microservices

---

## 📌 Status (DSD v1.2)

- ✅ SOLO flow finalized
- ✅ CREW flow finalized
- ✅ Notification matrix locked
- ✅ Interaction semantics frozen
- ⏳ Payments & premium gating (future)
- ⏳ Moderation & reporting (future)

---

## 🧭 Next Planned Enhancements

- Premium boosts (visibility)
- Crew size limits & privacy levels
- Smart recommendations
- AI‑assisted discovery ranking
- Event‑based temporary crews

---

## 🏁 Final Note

VERISQ is **not just chat** — it is an **intent‑aware social system**.

Every interaction is deliberate, respectful, and consent‑driven.
