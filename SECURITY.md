# 🛡️ Security Policy

We take the security of **Two-Pines: Cozy Forest Fire Watch** and its users seriously.

---

## 🔒 Supported Versions

| Version | Supported |
| :--- | :--- |
| `1.2.x` | ✅ Supported |
| `1.1.x` | ⚠️ Security fixes only |
| `< 1.0` | ❌ End of Life |

---

## 🚨 Reporting a Vulnerability

If you discover a potential security vulnerability or sensitive data leakage risk:

1. **Do not disclose publicly**: Please avoid opening public issues on GitHub.
2. **Contact maintainers**: Submit a private security advisory on GitHub or email the maintainer directly.
3. **Details to include**:
   - Description of the vulnerability.
   - Minimal steps or proof of concept to reproduce.
   - Potential impact on client browser sessions or stored LocalStorage save data.

We will review reports within 48 hours and work on a fix or mitigation immediately.

---

## 💾 Client-Side Save Data Security

* **LocalStorage Sanitization**: Save data exported and imported via `src/stores/useSettingsStore.js` is parsed using strict JSON schemas with field type validation to protect against malicious script injection or corrupted save payloads.
* **No Server Storage**: All user notes, photos, and game progression remain 100% private in the player's local browser memory.
