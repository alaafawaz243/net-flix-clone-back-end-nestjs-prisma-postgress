import { Controller, Get, Res } from '@nestjs/common';
import AuthDecorator from './decorator/auth.decorator';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import * as os from 'os';

@Controller('')
export class HomeController {
  constructor(private configService: ConfigService) {}

  @AuthDecorator()
  @Get()
  getDocs(@Res() res: Response) {
    const nonce = res.locals.nonce;
    const BASE_URL =
      this.configService.get('API_URL') || 'http://localhost:3000';
    const serverStatus = this.getServerStatus();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>API Documentation | Auth • Hearts • Users</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      color: #0f172a;
      line-height: 1.5;
      transition: background 0.2s, color 0.2s;
    }

    body.dark {
      background: #0f172a;
      color: #e2e8f0;
    }

    body.dark .card, body.dark .sidebar, body.dark .header, body.dark .section {
      background: #1e293b;
      border-color: #334155;
    }

    body.dark pre {
      background: #0a0f1a;
      border-color: #2d3a5e;
    }

    body.dark .method-get { background: #1e3a5f; color: #7ab7ff; }
    body.dark .method-post { background: #3b2e1e; color: #fbbf24; }
    body.dark .method-patch { background: #2d3a2b; color: #86efac; }
    body.dark .method-delete { background: #4a1e2c; color: #fda4af; }
    body.dark .badge { background: #334155; color: #cbd5e6; }
    body.dark .endpoint-path { background: #0f172a; border-color: #334155; }
    body.dark .btn-copy { background: #334155; border-color: #475569; color: #e2e8f0; }

    .container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
    .header {
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 1rem 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(8px);
      background: rgba(255,255,255,0.95);
    }
    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .logo h1 {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #4f46e5, #10b981);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f1f5f9;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
    }
    .status-badge {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }
    .base-url {
      font-family: monospace;
      background: #f1f5f9;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }
    .main { display: flex; gap: 2rem; margin-top: 2rem; }
    .sidebar {
      width: 280px;
      flex-shrink: 0;
      position: sticky;
      top: 90px;
      height: fit-content;
      background: white;
      border-radius: 1rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
    }
    .sidebar nav ul { list-style: none; }
    .sidebar nav ul li { margin-bottom: 0.5rem; }
    .sidebar nav ul li a {
      text-decoration: none;
      color: #0f172a;
      display: block;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      transition: 0.2s;
      font-weight: 500;
    }
    body.dark .sidebar nav ul li a { color: #e2e8f0; }
    .sidebar nav ul li a:hover { background: #f1f5f9; color: #4f46e5; }
    body.dark .sidebar nav ul li a:hover { background: #334155; }
    .content { flex: 1; min-width: 0; }
    .section {
      background: white;
      border-radius: 1rem;
      border: 1px solid #e2e8f0;
      margin-bottom: 2rem;
      overflow: hidden;
    }
    .section-header {
      padding: 1rem 1.5rem;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      font-size: 1.25rem;
    }
    .section-header:hover { background: #f8fafc; }
    .section-content { padding: 1.5rem; }
    .section-content.collapsed { display: none; }
    .endpoint {
      margin-bottom: 2rem;
      border-left: 3px solid #e2e8f0;
      padding-left: 1rem;
    }
    body.dark .endpoint { border-left-color: #334155; }
    .endpoint-method {
      display: inline-block;
      font-weight: 700;
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      margin-right: 0.75rem;
    }
    .method-get { background: #d1fae5; color: #065f46; }
    .method-post { background: #fed7aa; color: #92400e; }
    .method-patch { background: #c7d2fe; color: #3730a3; }
    .method-delete { background: #fee2e2; color: #991b1b; }
    .endpoint-path {
      font-family: monospace;
      font-size: 1rem;
      font-weight: 500;
      background: #f1f5f9;
      padding: 0.2rem 0.7rem;
      border-radius: 40px;
      display: inline-block;
    }
    .endpoint-desc {
      color: #475569;
      margin: 0.5rem 0;
      font-size: 0.875rem;
    }
    body.dark .endpoint-desc { color: #94a3b8; }
    .details { margin-top: 1rem; }
    .details summary { cursor: pointer; font-weight: 500; color: #4f46e5; margin-bottom: 0.5rem; }
    pre {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1rem;
      border-radius: 0.5rem;
      overflow-x: auto;
      font-size: 0.875rem;
      margin: 0.5rem 0;
      position: relative;
    }
    .copy-btn {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: #334155;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
    .badge {
      display: inline-block;
      background: #f1f5f9;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      margin-left: 0.5rem;
    }
    footer {
      text-align: center;
      margin-top: 3rem;
      padding: 1.5rem;
      color: #64748b;
      font-size: 0.875rem;
      border-top: 1px solid #e2e8f0;
    }
    @media (max-width: 768px) {
      .main { flex-direction: column; }
      .sidebar { width: 100%; position: static; margin-bottom: 1rem; }
    }
  </style>
</head>
<body>
<div class="header">
   <div class="header">
        <div class="header-content">
            <div class="logo"><h1><i class="fas fa-hashtag"></i> Social Media API</h1></div>
            <div class="status"><span class="status-badge"></span><span>Server: ${serverStatus.status}</span><span>Uptime: ${serverStatus.uptime}</span></div>
            <div class="base-url"><i class="fas fa-link"></i> Base URL: <code>${BASE_URL}</code></div>
        </div>
    </div>
</div>
<div class="container">
  <div class="main">
    <aside class="sidebar">
      <nav><ul>
        <li><a href="#auth">🔐 Authentication</a></li>
        <li><a href="#hearts">❤️ Hearts (Favorites)</a></li>
        <li><a href="#users">👥 Users</a></li>
        <li><a href="#common">📦 Common DTOs & Errors</a></li>
      </ul></nav>
    </aside>
    <main class="content">
      <!-- ==================== AUTH SECTION ==================== -->
      <div class="section" id="auth">
        <div class="section-header" onclick="toggleSection(this)">
          <span><i class="fas fa-key"></i> Authentication</span><i class="fas fa-chevron-down"></i>
        </div>
        <div class="section-content">
          <div class="endpoint">
            <div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/signup</span></div>
            <div class="endpoint-desc">Create a new account. An <code>accessToken</code> cookie is set automatically on success.</div>
            <details class="details"><summary>Request & Response</summary>
              <p><strong>Request body (JSON):</strong></p>
              <pre><code>{
  "email": "user@example.com",
  "password": "StrongPass123"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <p><strong>Password constraints:</strong> min length 9, at least 3 uppercase, 3 lowercase, 3 digits.</p>
              <p><strong>cURL:</strong></p>
              <pre><code>curl -X POST 'https://yourapp.com/api/auth/signup' -H 'Content-Type: application/json' -d '{"email":"user@example.com","password":"StrongPass123"}'</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <p><strong>Response (201 Created):</strong></p>
              <pre><code>{
  "data": { "user": { "id": "550e8400-e29b-41d4-a716-446655440000" } },
  "message": "Logged in successfully"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
            </details>
          </div>

          <div class="endpoint">
            <div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/login</span></div>
            <div class="endpoint-desc">Authenticate and receive user id + current hearts list.</div>
            <details class="details"><summary>Request & Response</summary>
              <pre><code>{"email":"user@example.com","password":"StrongPass123"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <p><strong>Response (200 OK):</strong></p>
              <pre><code>{
  "data": {
    "user": { "id": "uuid" },
    "hearts": [123, 456]
  },
  "message": "Logged in successfully"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
            </details>
          </div>

          <div class="endpoint">
            <div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/auth/logout</span><span class="badge">🔒 Auth required</span></div>
            <div class="endpoint-desc">Invalidate session and clear the accessToken cookie.</div>
            <details class="details"><summary>Example</summary>
              <pre><code>curl -X POST 'https://yourapp.com/api/auth/logout' --cookie "accessToken=..."</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <p><strong>Response:</strong> <code>{"data":null,"message":"Logged out successfully"}</code></p>
            </details>
          </div>

          <div class="endpoint">
            <div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/auth/change-password</span><span class="badge">🔒 Auth required</span></div>
            <div class="endpoint-desc">Change password (old password must be valid, new one must be different and strong).</div>
            <details class="details"><summary>Request body</summary>
              <pre><code>{"oldPassword":"StrongPass123","newPassword":"NewerPass456"}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <p><strong>Response:</strong> <code>{"data":null,"message":"Password updated successfully"}</code></p>
            </details>
          </div>

          <div class="endpoint">
            <div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/auth/me</span><span class="badge">🔒 Auth required</span></div>
            <div class="endpoint-desc">Get current user data along with heart list.</div>
            <details class="details"><summary>Example</summary>
              <pre><code>curl -X GET 'https://yourapp.com/api/auth/me' --cookie "accessToken=..."</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <pre><code>{
  "data": {
    "user": { "id": "uuid" },
    "hearts": [101,202]
  },
  "message": "User data successfully"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
            </details>
          </div>
        </div>
      </div>

      <!-- ==================== HEARTS SECTION ==================== -->
      <div class="section" id="hearts">
        <div class="section-header" onclick="toggleSection(this)">
          <span><i class="fas fa-heart" style="color:#e11d48;"></i> Hearts (Favorites)</span><i class="fas fa-chevron-down"></i>
        </div>
        <div class="section-content">
          <div class="endpoint">
            <div><span class="endpoint-method method-get">GET</span><span class="endpoint-path">/heart</span><span class="badge">🔒 Auth required</span></div>
            <div class="endpoint-desc">Retrieve paginated list of favorite movies (cursor-based).</div>
            <details class="details"><summary>Query parameters</summary>
              <table style="width:100%; border-collapse:collapse; margin:0.5rem 0;">
                <thead><tr><th>Parameter</th><th>Type</th><th>Description</th></tr></thead>
                <tbody>
                  <tr><td><code>cursorId</code></td><td>string (UUID)</td><td>Last fetched ID for next page</td></tr>
                  <tr><td><code>limit</code></td><td>number</td><td>Between 1 and 100, default 9</td></tr>
                </tbody>
              </table>
              <p><strong>Example:</strong> <code>GET /heart?limit=5&cursorId=some-uuid</code></p>
              <pre><code>{
  "data": {
    "meta": { "cursorId": "next-uuid-or-null" },
    "hearts": [
      { "id": "uuid", "movieId": "123", "backdrop_path": "/image.jpg", "title": "Inception" }
    ]
  },
  "message": "Get All heart Successfully"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
            </details>
          </div>

          <div class="endpoint">
            <div><span class="endpoint-method method-post">POST</span><span class="endpoint-path">/heart</span><span class="badge">🔒 Auth required</span></div>
            <div class="endpoint-desc">Toggle favorite status (add if not present, remove if exists).</div>
            <details class="details"><summary>Request body (CreateHeartDto)</summary>
              <pre><code>{
  "id": "789",
  "backdrop_path": "/path/poster.webp",
  "title": "The Dark Knight"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <p><strong>Note:</strong> <code>backdrop_path</code> and <code>title</code> are required only when adding (first time).</p>
              <p><strong>Response:</strong></p>
              <pre><code>{ "data": true, "message": "filme Heart successfully" }</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
            </details>
          </div>
        </div>
      </div>

      <!-- ==================== USERS SECTION ==================== -->
      <div class="section" id="users">
        <div class="section-header" onclick="toggleSection(this)">
          <span><i class="fas fa-user-circle"></i> Users</span><i class="fas fa-chevron-down"></i>
        </div>
        <div class="section-content">
          <div class="endpoint">
            <div><span class="endpoint-method method-patch">PATCH</span><span class="endpoint-path">/users/:userId</span><span class="badge">🔒 Auth required</span></div>
            <div class="endpoint-desc">Update user profile (except email/password). The authenticated user must match the <code>userId</code> param.</div>
            <details class="details"><summary>Request body (UpdateUserDto)</summary>
              <pre><code>{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "New York"
}</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <p><strong>Response:</strong> <code>{"data":null,"message":"User updated successfully"}</code></p>
            </details>
          </div>

          <div class="endpoint">
            <div><span class="endpoint-method method-delete">DELETE</span><span class="endpoint-path">/users/:userId</span><span class="badge">🔒 Auth required</span></div>
            <div class="endpoint-desc">Permanently delete the account (only allowed for the same user).</div>
            <details class="details"><summary>Example</summary>
              <pre><code>curl -X DELETE 'https://yourapp.com/api/users/550e8400-e29b-41d4-a716-446655440000' --cookie "accessToken=..."</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
              <p><strong>Response:</strong> <code>{"data":null,"message":"User deleted successfully"}</code></p>
            </details>
          </div>
        </div>
      </div>

      <!-- ==================== COMMON SCHEMAS & ERRORS ==================== -->
      <div class="section" id="common">
        <div class="section-header" onclick="toggleSection(this)">
          <span><i class="fas fa-cubes"></i> Common DTOs & Error Handling</span><i class="fas fa-chevron-down"></i>
        </div>
        <div class="section-content">
          <h4>EmailAndPassDto</h4>
          <pre><code>{ "email": "string (email)", "password": "string (strong)" }</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
          <h4>ChangePasswordDto</h4>
          <pre><code>{ "oldPassword": "string", "newPassword": "string" }</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>
          <h4>CurseDto (pagination for hearts)</h4>
          <pre><code>{ "cursorId": "uuid (optional)", "limit": "number 1-100 (optional)" }</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>

          <h4 style="margin-top: 1rem;">📦 Standard Response Format</h4>
          <pre><code>{ "data": any | null, "message": string }</code><button class="copy-btn" onclick="copyToClipboard(this)">Copy</button></pre>

          <h4>⚠️ Common HTTP Errors</h4>
          <ul style="margin-right: 1.5rem;">
            <li><strong>400 Bad Request</strong> – Invalid input (email exists, weak password, missing fields)</li>
            <li><strong>401 Unauthorized</strong> – Missing or invalid <code>accessToken</code> cookie</li>
            <li><strong>404 Not Found</strong> – Resource not found (user, lesson, etc.)</li>
          </ul>

          <h4>🔒 Authentication Details</h4>
          <p>All endpoints marked with <span class="badge">🔒 Auth required</span> expect a valid <code>accessToken</code> cookie.<br>
          The cookie is <strong>HttpOnly, SameSite=Strict, Secure</strong> (in production) and is automatically sent after login/signup.</p>
          <p><strong>No Authorization header needed</strong> – the cookie is handled by the browser automatically. For non‑browser clients, you must manually include the cookie.</p>
        </div>
      </div>
    </main>
  </div>
        <footer><p>Net Flix API v1 | Documentation generated from source code | © ${new Date().getFullYear()}</p></footer>
</div>
<script>
  // Uptime simulation (from real server if available, otherwise static)
  function setUptime() {
    const uptimeElem = document.getElementById('uptime');
    if (uptimeElem) {
      const seconds = Math.floor(performance.now() / 1000);
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      uptimeElem.innerText = '${serverStatus.uptime}';
    }
  }
  setUptime();

  function toggleSection(header) {
    const content = header.nextElementSibling;
    content.classList.toggle('collapsed');
    const icon = header.querySelector('i:last-child');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-right');
  }

  function copyToClipboard(btn) {
    const pre = btn.closest('pre');
    if (pre) {
      const code = pre.querySelector('code');
      const text = code ? code.innerText : pre.innerText;
      navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = '✓ Copied!';
        setTimeout(() => btn.innerHTML = 'Copy', 2000);
      }).catch(() => alert('Press Ctrl+C to copy'));
    }
  }

  // Smooth sidebar navigation
  document.querySelectorAll('.sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Dark mode toggle
  const darkToggle = document.createElement('button');
  darkToggle.innerHTML = '<i class="fas fa-moon"></i> Dark mode';
  darkToggle.className = 'status';
  darkToggle.style.cursor = 'pointer';
  darkToggle.style.marginLeft = '10px';
  document.querySelector('.header-content').appendChild(darkToggle);
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('darkMode', document.body.classList.contains('dark'));
    darkToggle.innerHTML = document.body.classList.contains('dark') ? '<i class="fas fa-sun"></i> Light mode' : '<i class="fas fa-moon"></i> Dark mode';
  });
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    darkToggle.innerHTML = '<i class="fas fa-sun"></i> Light mode';
  }

  window.toggleSection = toggleSection;
  window.copyToClipboard = copyToClipboard;
</script>
</body>
</html>`;
    res.send(html);
  }

  private getServerStatus() {
    const uptime = os.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    return {
      status: 'online',
      uptime: `${days}d ${hours}h ${minutes}m`,
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      env: process.env.NODE_ENV || 'development',
    };
  }
}
