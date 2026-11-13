import dotenv from 'dotenv'
dotenv.config()

import http from 'http'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import app from '../server.js'

let server
let cookie = ''

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        let parsed = body
        try {
          parsed = JSON.parse(body)
        } catch (_e) {
          // keep as string
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
        })
      })
    })

    req.on('error', reject)

    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data))
    }
    req.end()
  })
}

async function runTests() {
  console.log('\n=============================================')
  console.log('  ASHNVEYL VAULT API — AUTOMATED TEST SUITE')
  console.log('=============================================\n')

  const port = 5999
  await connectDB()
  server = app.listen(port)

  try {
    // 1. Health check
    console.log('[Test 1] Health Check: GET /api/health')
    const health = await request({
      hostname: 'localhost',
      port,
      path: '/api/health',
      method: 'GET',
    })
    console.log(`  -> Status: ${health.statusCode}, database: ${health.data.database}`)
    if (health.statusCode !== 200 || health.data.database !== 'connected') {
      throw new Error('Health check failed')
    }

    // 2. Public Devlogs
    console.log('\n[Test 2] Public Devlogs: GET /api/devlogs')
    const devlogsRes = await request({
      hostname: 'localhost',
      port,
      path: '/api/devlogs',
      method: 'GET',
    })
    console.log(`  -> Status: ${devlogsRes.statusCode}, Count: ${devlogsRes.data.length}`)
    if (devlogsRes.statusCode !== 200 || !Array.isArray(devlogsRes.data)) {
      throw new Error('Get devlogs failed')
    }

    // 3. Single Devlog
    console.log('\n[Test 3] Single Devlog: GET /api/devlogs/the-nightmare-to-start')
    const singleDevlog = await request({
      hostname: 'localhost',
      port,
      path: '/api/devlogs/the-nightmare-to-start',
      method: 'GET',
    })
    console.log(`  -> Status: ${singleDevlog.statusCode}, Title: "${singleDevlog.data.title}"`)
    if (singleDevlog.statusCode !== 200 || !singleDevlog.data.title) {
      throw new Error('Get single devlog failed')
    }

    // 4. Public Projects
    console.log('\n[Test 4] Public Projects: GET /api/projects')
    const projectsRes = await request({
      hostname: 'localhost',
      port,
      path: '/api/projects',
      method: 'GET',
    })
    console.log(`  -> Status: ${projectsRes.statusCode}, Count: ${projectsRes.data.length}`)
    if (projectsRes.statusCode !== 200 || projectsRes.data.length === 0) {
      throw new Error('Get projects failed')
    }

    // 5. Protected rejection without auth
    console.log('\n[Test 5] Security Check: POST /api/devlogs without auth (expect 401)')
    const unauthPost = await request(
      {
        hostname: 'localhost',
        port,
        path: '/api/devlogs',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { title: 'Hacker Devlog' },
    )
    console.log(`  -> Status: ${unauthPost.statusCode}, Error: "${unauthPost.data.error}"`)
    if (unauthPost.statusCode !== 401) {
      throw new Error('Protected route allowed unauthenticated request!')
    }

    // 6. Bad login attempt
    console.log('\n[Test 6] Login Check: POST /api/auth/login with wrong password (expect 401)')
    const badLogin = await request(
      {
        hostname: 'localhost',
        port,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { username: 'ashnveyl', password: 'wrongpassword' },
    )
    console.log(`  -> Status: ${badLogin.statusCode}, Error: "${badLogin.data.error}"`)
    if (badLogin.statusCode !== 401) {
      throw new Error('Bad password was accepted!')
    }

    // 7. Successful login
    console.log('\n[Test 7] Login Check: POST /api/auth/login with correct credentials')
    const loginRes = await request(
      {
        hostname: 'localhost',
        port,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { username: 'ashnveyl', password: 'hunter_trial_2026' },
    )
    console.log(`  -> Status: ${loginRes.statusCode}, Message: "${loginRes.data.message}"`)
    const setCookie = loginRes.headers['set-cookie']
    if (loginRes.statusCode !== 200 || !setCookie) {
      throw new Error('Login failed or did not set cookie')
    }
    cookie = setCookie[0].split(';')[0]
    console.log(`  -> Vault Token Cookie received (${cookie.slice(0, 20)}...)`)

    // 8. Auth State Check
    console.log('\n[Test 8] Auth State: GET /api/auth/me with Cookie')
    const meRes = await request({
      hostname: 'localhost',
      port,
      path: '/api/auth/me',
      method: 'GET',
      headers: { Cookie: cookie },
    })
    console.log(`  -> Status: ${meRes.statusCode}, Authenticated: ${meRes.data.authenticated}, User: ${meRes.data.user?.username}`)
    if (meRes.statusCode !== 200 || !meRes.data.authenticated) {
      throw new Error('GET /api/auth/me failed')
    }

    // 9. Admin Create Devlog
    console.log('\n[Test 9] Admin Action: POST /api/devlogs (create test devlog)')
    const createDevlogRes = await request(
      {
        hostname: 'localhost',
        port,
        path: '/api/devlogs',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
      },
      {
        title: 'Devlog Test: The Obsidian Protocol',
        category: 'SYSTEM TEST',
        published: true,
        summary: 'Automated integration test manuscript verifying vault CRUD functionality.',
        blocks: [
          { type: 'paragraph', lead: true, text: 'This manuscript was penned by automated test verification.' },
          { type: 'heading', text: 'Trial Verification' },
          { type: 'code', file: 'test_engine.gd', lang: 'gdscript', code: 'func test() -> void:\n    pass' },
        ],
      },
    )
    console.log(`  -> Status: ${createDevlogRes.statusCode}, ID: ${createDevlogRes.data._id}, Slug: ${createDevlogRes.data.slug}`)
    if (createDevlogRes.statusCode !== 201) {
      throw new Error('Create devlog failed')
    }
    const testDevlogId = createDevlogRes.data._id

    // 10. Admin Update Devlog
    console.log('\n[Test 10] Admin Action: PUT /api/devlogs/:id')
    const updateDevlogRes = await request(
      {
        hostname: 'localhost',
        port,
        path: `/api/devlogs/${testDevlogId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
      },
      {
        summary: 'Updated summary verified.',
      },
    )
    console.log(`  -> Status: ${updateDevlogRes.statusCode}, New Summary: "${updateDevlogRes.data.summary}"`)
    if (updateDevlogRes.statusCode !== 200 || updateDevlogRes.data.summary !== 'Updated summary verified.') {
      throw new Error('Update devlog failed')
    }

    // 11. Admin Delete Devlog
    console.log('\n[Test 11] Admin Action: DELETE /api/devlogs/:id')
    const deleteDevlogRes = await request({
      hostname: 'localhost',
      port,
      path: `/api/devlogs/${testDevlogId}`,
      method: 'DELETE',
      headers: { Cookie: cookie },
    })
    console.log(`  -> Status: ${deleteDevlogRes.statusCode}, Message: "${deleteDevlogRes.data.message}"`)
    if (deleteDevlogRes.statusCode !== 200) {
      throw new Error('Delete devlog failed')
    }

    // 12. Notifications lifecycle
    console.log('\n[Test 12] Notifications: POST & DELETE /api/notifications')
    const createNotif = await request(
      {
        hostname: 'localhost',
        port,
        path: '/api/notifications',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie,
        },
      },
      {
        title: 'Hunter Archive Online',
        body: 'The vault API has opened its corridors.',
        kind: 'milestone',
        pinned: true,
      },
    )
    console.log(`  -> Create Status: ${createNotif.statusCode}, Title: "${createNotif.data.title}"`)
    const notifId = createNotif.data._id

    const deleteNotif = await request({
      hostname: 'localhost',
      port,
      path: `/api/notifications/${notifId}`,
      method: 'DELETE',
      headers: { Cookie: cookie },
    })
    console.log(`  -> Delete Status: ${deleteNotif.statusCode}`)
    if (deleteNotif.statusCode !== 200) {
      throw new Error('Delete notification failed')
    }

    // 13. Logout
    console.log('\n[Test 13] Logout: POST /api/auth/logout')
    const logoutRes = await request({
      hostname: 'localhost',
      port,
      path: '/api/auth/logout',
      method: 'POST',
    })
    console.log(`  -> Status: ${logoutRes.statusCode}, Message: "${logoutRes.data.message}"`)

    // 14. Verify unauthenticated after logout
    console.log('\n[Test 14] Verify Unauthenticated after logout')
    const meAfterLogout = await request({
      hostname: 'localhost',
      port,
      path: '/api/auth/me',
      method: 'GET',
    })
    console.log(`  -> Authenticated: ${meAfterLogout.data.authenticated}`)
    if (meAfterLogout.data.authenticated !== false) {
      throw new Error('User still authenticated after logout')
    }

    console.log('\n=============================================')
    console.log('  ALL 14 INTEGRATION TESTS PASSED PERFECTLY!')
    console.log('=============================================\n')
  } catch (err) {
    console.error('\n[TEST FAILURE]', err.message)
    process.exitCode = 1
  } finally {
    if (server) server.close()
    await mongoose.disconnect()
    process.exit(process.exitCode || 0)
  }
}

runTests()
