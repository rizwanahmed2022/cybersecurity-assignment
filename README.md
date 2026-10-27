# Firestore Security Specification (`SECURITY_SPEC.md`)

## 1. Data Invariants (`UserDeviceLicense` at `/users/{userId}`)
1. **Owner-Only Isolation (PII Guard):** Only the authenticated owner (`request.auth.uid == userId`) can `get`, `create`, or `update` `/users/{userId}`. Collection-wide `list` and `delete` operations are unconditionally denied.
2. **Mandatory Pending Registration State:** Every newly created `/users/{userId}` document MUST initialize with `"isActivated": false` alongside a valid bound hardware `deviceId` (`8..128` chars matching `^[a-zA-Z0-9_\-]+$`) and ISO `registeredAt` timestamp. Clients can NEVER create a document with `isActivated: true`.
3. **Administrator-Only Activation Gate:** Clients can NEVER transition `isActivated` from `false` to `true` (nor mutate `isActivated` at all). Only an administrator via Firebase Console or Admin SDK can set `isActivated: true` (or revoke it back to `false`).
4. **Immutable Identity, Hardware ID & Timestamps:** `uid`, `email`, `deviceId`, `registeredAt`, and `createdAt` can never be mutated after creation, and `uid` / `email` must match `request.auth.uid` / `request.auth.token.email`.
5. **Server Timestamp Enforcement:** `createdAt` (on create) and `updatedAt` (on create/update) must strictly equal `request.time`.

---

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Attack Vector | Malicious Payload / Operation | Expected Result | Blocking Gate |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Unauthenticated Read** | `get /users/user_1` with `auth = null` | `PERMISSION_DENIED` | `isSignedIn()` |
| 2 | **Cross-Tenant PII Read** | `get /users/victim_uid` as `attacker_uid` | `PERMISSION_DENIED` | `isOwner(userId)` |
| 3 | **Collection Scraping** | `list /users` as `attacker_uid` | `PERMISSION_DENIED` | `allow list: if false` |
| 4 | **Identity Spoofing on Create** | `create /users/attacker_uid` with `{ "uid": "victim_uid", ... }` | `PERMISSION_DENIED` | `data.uid == request.auth.uid` |
| 5 | **Email Mismatch Spoof** | `create /users/u1` with `{ "email": "ceo@corp.com" }` when token email differs | `PERMISSION_DENIED` | `data.email.lower() == request.auth.token.email.lower()` |
| 6 | **Self-Activation on Create** | `create /users/u1` with `{ "isActivated": true, "deviceId": "hw-12345678" }` | `PERMISSION_DENIED` | `incoming().isActivated == false` |
| 7 | **Self-Activation on Update** | `update /users/u1` flipping `isActivated: false -> true` | `PERMISSION_DENIED` | `existing().isActivated == true && incoming().isActivated == true` |
| 8 | **Shadow Field Injection** | `create /users/u1` with extra `{ "isAdmin": true }` | `PERMISSION_DENIED` | `data.keys().hasOnly([...])` |
| 9 | **Resource Poisoning (ID)** | `create /users/<200-char-junk>` | `PERMISSION_DENIED` | `isValidId(userId)` |
| 10 | **Value Poisoning on Update** | `update /users/u1` setting `displayName: 12345` or 50KB string | `PERMISSION_DENIED` | `isValidUserDeviceLicense(incoming())` |
| 11 | **Hardware Hijack / Rebind** | `update /users/u1` changing `deviceId` | `PERMISSION_DENIED` | `incoming().deviceId == existing().deviceId` |
| 12 | **Unauthorized Record Wipe** | `delete /users/u1` as owner | `PERMISSION_DENIED` | `allow delete: if false` |

---

## 3. Red Team Audit Report (`/users/{userId}`)
- **Shadow Update Test:** PASS — Rejected by both `isValidUserDeviceLicense` (`keys().hasOnly(...)`) and action-level `affectedKeys().hasOnly(...)`.
- **Self-Activation Bypass Test:** PASS — `allow create` enforces `incoming().isActivated == false` and `allow update` requires `existing().isActivated == true && incoming().isActivated == true`; no client operation can ever activate an account.
- **Email Spoofing Test:** PASS — Document access is keyed strictly by `request.auth.uid == userId` (never by email lookup), and `data.email.lower() == request.auth.token.email.lower()` + `hasAuthenticatedEmail()` prevents arbitrary email injection.
- **PII Blanket Test:** PASS — `allow get` requires `isOwner(userId)` and `allow list` is `false`.
- **Query Trust Test:** PASS — Zero `allow list` rules exist.
- **Identity Spoofing / State Shortcutting / Resource Poisoning / Value Poisoning:** PASS — Verified across all 8 Pillars.
