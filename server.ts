import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Ensure database/JSON directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DATA_FILE = path.join(DATA_DIR, 'floatdock.json');

// Default initial state matching PRD requirements
const DEFAULT_STATE = {
  admin: {
    username: 'admin',
    password: 'FloatDock@123'
  },
  version: {
    app_name: 'FloatDock',
    version_name: '1.2.0',
    version_code: 3,
    description: 'Bug fixes, layout enhancements, and an all-new custom glassmorphism floating bubble designer!',
    download_url: '/api/download-apk',
    force_update: false
  },
  about_links: {
    terms_url: '/terms',
    faq_url: '/faq',
    privacy_url: '/privacy',
    about_url: '/about'
  },
  notifications: [
    {
      id: 1,
      title: 'Welcome to FloatDock!',
      message: 'FloatDock v1.2.0 is now live! Tap to experience the fastest customizable floating sidebar for Android.',
      click_url: '/download',
      created_at: new Date('2026-07-01T12:00:00Z').toISOString()
    },
    {
      id: 2,
      title: 'Pro Customizations Unlocked',
      message: 'Customize the trigger handle sizes, drag-edge detection, and transparency slider directly inside Settings.',
      click_url: '/features',
      created_at: new Date('2026-07-05T15:30:00Z').toISOString()
    }
  ],
  home_hero: {
    tagline: 'Supercharge Your Android Screen With a Smart, Fluid Dock',
    description: 'Access your favorite apps, custom shortcuts, system settings, and floating window widgets in a single, thumb-friendly swipe. Fully customizable, glassmorphic, and optimized for battery life.'
  },
  about_page: {
    description: 'FloatDock was built out of a simple need: making large Android screens easier to navigate single-handedly. Our lightweight overlay service lets you launch shortcuts, view calendar events, toggle system controls, and access calculator widgets without leaving your current application.',
    developer_info: 'Developed with passion by the FloatDock Team. Built in 2026 for high-performance fluid desktop-to-mobile productivity.'
  },
  screenshots: [
    { id: 1, title: 'Floating Bubble Handle', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80', caption: 'Elegant translucent overlay trigger button that stays with you across any application screen.' },
    { id: 2, title: 'Expandable Shortcuts Dock', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80', caption: 'A full-height slide-out bar containing user shortcuts, dynamic quick widgets, and brightness sliders.' },
    { id: 3, title: 'Advanced Themes Panel', url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=500&q=80', caption: 'Dozens of responsive icon designs, border radiuses, and blur customization menus.' }
  ],
  faqs: [
    {
      id: 1,
      question: 'What is FloatDock?',
      answer: 'FloatDock is an advanced overlay widget and productivity companion for Android. It places an ultra-smooth, customizable trigger handle (or bubble) on your screen edge. A quick swipe opens a translucent dock containing your preferred apps, contact speed-dials, system toggles, and widget controllers.'
    },
    {
      id: 2,
      question: 'Does FloatDock require root permissions?',
      answer: 'No, root is not required. FloatDock runs entirely as a standard background overlay service. It uses the "Display over other apps" permission to render the trigger bubble, and the optional "Accessibility Service" permission if you want to trigger physical actions like opening the notifications shade, returning home, or pressing back.'
    },
    {
      id: 3,
      question: 'Will FloatDock drain my battery?',
      answer: 'Absolutely not. FloatDock is engineered with strict power lifecycle standards. It remains entirely idle when you are not actively interacting with the screen overlays, and utilizes native canvas redrawing triggers to consume negligible background memory and battery.'
    },
    {
      id: 4,
      question: 'How do I upgrade to the latest APK version?',
      answer: 'Simply navigate to the Download page on this website, tap "Download FloatDock APK", and open the downloaded installer. Your system will guide you through an in-place upgrade, preserving all your current shortcut lists, icons, and theme settings.'
    }
  ],
  blog_posts: [
    {
      id: 1,
      title: 'Unlocking Android Screen Ergonomics: Why Floating Docks are Key',
      slug: 'android-screen-ergonomics',
      excerpt: 'As smartphone screens exceed 6.5 inches, one-handed navigation is becoming a physical strain. Learn how side docks bridge the accessibility gap.',
      content: 'Smartphone displays have grown enormously over the last decade. While glorious for media, these screens pose an ergonomic nightmare: the "thumb zone" is severely limited. Swiping down the notifications shade or tapping the top-left back button often requires two hands or dynamic hand-shuffling that risks drops.\n\nFloatDock reclaims your viewport layout. By nesting your most frequently used actions, apps, and toggles within a floating trigger handle that sits right beside your thumb, you can operate even the largest devices entirely with one hand. We examine how custom touch dimensions can decrease daily wrist strain while doubling your app launching speeds.',
      author: 'Ergonomic Labs',
      date: 'July 10, 2026',
      read_time: '5 min read',
      category: 'Design'
    },
    {
      id: 2,
      title: 'FloatDock v1.2.0: Deep Dive Into Glassmorphism Blurs',
      slug: 'floatdock-glassmorphism',
      excerpt: 'Discover how we achieved 60FPS fluid blur rendering on older Android devices with the new FloatDock v1.2.0 update.',
      content: 'Our latest release, v1.2.0, introduces complete frosted glass customizers for your sidebar edge. Real-time background blurs on Android have historically been notorious battery hogs, particularly on mid-range or legacy chipsets. Under the hood, we replaced the standard render-script pipelines with a dual-pass downscaled hardware bitmap shader. This results in incredibly smooth transitions and realistic glass refractions while maintaining a solid 60 frames per second. Read on to see how you can tweak contrast ratios and lighting colors inside the updated Theme settings panel.',
      author: 'Lead Dev, FloatDock',
      date: 'July 05, 2026',
      read_time: '4 min read',
      category: 'Tech'
    },
    {
      id: 3,
      title: 'Overlay Permissions Safeguards: Protecting Your Data',
      slug: 'overlay-permissions-safeguards',
      excerpt: 'Accessibility and overlay permissions are highly powerful. Here is how FloatDock ensures perfect offline privacy and zero telemetry.',
      content: 'Android "Draw Over Other Apps" is a permission that should only be granted to developers you trust. Because overlay windows can technically intercept screen coordinates, malicious applications have used overlay layers for tapjacking attacks. \n\nAt FloatDock, security is integrated by default. FloatDock runs entirely sandboxed with zero background internet uploads for your private app launcher shortcuts or usage histories. Your dock configurations are saved locally on-device. This article explains how our offline-first architecture works, how permissions are isolated, and how you can audit our active permissions manifest to guarantee perfect peace of mind.',
      author: 'Privacy Advocate',
      date: 'June 28, 2026',
      read_time: '6 min read',
      category: 'Privacy'
    }
  ],
  messages: [
    {
      id: 1,
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      subject: 'Custom Trigger Feedback',
      message: 'Hey FloatDock Team, I love the app! Would it be possible to add a double-tap gesture on the bubble trigger to lock the screen in the next update?',
      unread: true,
      created_at: new Date('2026-07-11T09:15:00Z').toISOString()
    },
    {
      id: 2,
      name: 'Anjali Gupta',
      email: 'anjali.g@example.com',
      subject: 'FAQ Addition Suggestion',
      message: 'Great website layout. You guys should add a step-by-step FAQ point for MIUI and Realme devices since their aggressive background task managers sometimes kill the bubble service.',
      unread: false,
      created_at: new Date('2026-07-08T14:22:00Z').toISOString()
    }
  ]
};

// Database Read Helper
function readDb() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading DB, using defaults', error);
  }
  // Write default state if no file exists
  writeDb(DEFAULT_STATE);
  return DEFAULT_STATE;
}

// Database Write Helper
function writeDb(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to DB', error);
  }
}

// Ensure the db starts initialized
readDb();

// Express JSON parsing middleware
app.use(express.json());

// =========================================================================
// PUBLIC REST API ENDPOINTS
// =========================================================================

// Endpoint 1: GET /api/version
app.get('/api/version', (req, res) => {
  const db = readDb();
  res.json(db.version);
});

// Endpoint 2: GET /api/notifications
app.get('/api/notifications', (req, res) => {
  const db = readDb();
  const sinceParam = req.query.since;
  let sinceId = 0;
  
  if (sinceParam) {
    const parsed = parseInt(sinceParam as string, 10);
    if (!isNaN(parsed)) {
      sinceId = parsed;
    }
  }
  
  const filtered = db.notifications
    .filter((notif: any) => notif.id > sinceId)
    .sort((a: any, b: any) => b.id - a.id); // Newest first

  res.json(filtered);
});

// Endpoint 3: GET /api/about-links
app.get('/api/about-links', (req, res) => {
  const db = readDb();
  res.json(db.about_links);
});

// Endpoint 4: GET /api/public-settings
// Fetches FAQ, screenshots, blogs, home text, about text, etc. for frontend
app.get('/api/public-settings', (req, res) => {
  const db = readDb();
  res.json({
    home_hero: db.home_hero,
    about_page: db.about_page,
    faqs: db.faqs,
    blog_posts: db.blog_posts,
    screenshots: db.screenshots,
    about_links: db.about_links,
    version: db.version
  });
});

// Endpoint 5: POST /api/contact
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const db = readDb();
  const newMessage = {
    id: db.messages.length > 0 ? Math.max(...db.messages.map((m: any) => m.id)) + 1 : 1,
    name,
    email,
    subject,
    message,
    unread: true,
    created_at: new Date().toISOString()
  };

  db.messages.push(newMessage);
  writeDb(db);

  res.json({ success: true, message: 'Message sent successfully!' });
});

// Endpoint 6: GET /api/download-apk
// Serves the uploaded FloatDock.apk file if it exists, otherwise falls back to a clean mock binary representation
app.get('/api/download-apk', (req, res) => {
  const filePath = path.join(process.cwd(), 'FloatDock.apk');
  
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename=FloatDock.apk');
    return res.sendFile(filePath);
  }
  
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', 'attachment; filename=FloatDock.apk');
  
  // Send a tiny valid dummy binary stream or mock installer header
  const dummyApk = Buffer.from('FloatDockAndroidApkDummyHeaderAndPayload2026');
  res.send(dummyApk);
});

// =========================================================================
// ADMIN API ENDPOINTS
// =========================================================================

// Admin login session verify helper
const validateAdminToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== 'Bearer floatdock-admin-token-secret-2026') {
    return res.status(401).json({ error: 'Unauthorized. Please login again.' });
  }
  next();
};

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDb();

  if (username === db.admin.username && password === db.admin.password) {
    res.json({
      success: true,
      token: 'floatdock-admin-token-secret-2026',
      user: { username: db.admin.username }
    });
  } else {
    res.status(401).json({ error: 'Incorrect username or password.' });
  }
});

// Change Password
app.post('/api/admin/change-password', validateAdminToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const db = readDb();

  if (currentPassword !== db.admin.password) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ error: 'New password must be at least 4 characters.' });
  }

  db.admin.password = newPassword.trim();
  writeDb(db);

  res.json({ success: true, message: 'Password updated successfully!' });
});

// Update App Version Details
app.post('/api/admin/update-version', validateAdminToken, (req, res) => {
  const { version_name, version_code, description, force_update } = req.body;
  
  if (!version_name || !version_code) {
    return res.status(400).json({ error: 'Version name and code are required.' });
  }

  const db = readDb();
  db.version.version_name = version_name;
  db.version.version_code = parseInt(version_code, 10);
  db.version.description = description || '';
  db.version.force_update = !!force_update;

  writeDb(db);
  res.json({ success: true, version: db.version });
});

// Send New System Notification
app.post('/api/admin/send-notification', validateAdminToken, (req, res) => {
  const { title, message, click_url } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: 'Title and Message are required.' });
  }

  const db = readDb();
  const nextId = db.notifications.length > 0 ? Math.max(...db.notifications.map((n: any) => n.id)) + 1 : 1;

  const newNotif = {
    id: nextId,
    title,
    message,
    click_url: click_url || '',
    created_at: new Date().toISOString()
  };

  db.notifications.unshift(newNotif); // Add to top
  writeDb(db);

  res.json({ success: true, notification: newNotif });
});

// Update About links
app.post('/api/admin/update-about-links', validateAdminToken, (req, res) => {
  const { terms_url, faq_url, privacy_url, about_url } = req.body;
  const db = readDb();

  db.about_links.terms_url = terms_url || '/terms';
  db.about_links.faq_url = faq_url || '/faq';
  db.about_links.privacy_url = privacy_url || '/privacy';
  db.about_links.about_url = about_url || '/about';

  writeDb(db);
  res.json({ success: true, about_links: db.about_links });
});

// Update FAQ content
app.post('/api/admin/update-faqs', validateAdminToken, (req, res) => {
  const { faqs } = req.body;
  if (!Array.isArray(faqs)) {
    return res.status(400).json({ error: 'FAQs must be an array.' });
  }

  const db = readDb();
  db.faqs = faqs.map((faq: any, i: number) => ({
    id: faq.id || i + 1,
    question: faq.question || '',
    answer: faq.answer || ''
  }));

  writeDb(db);
  res.json({ success: true, faqs: db.faqs });
});

// Update Blog Posts content
app.post('/api/admin/update-blogs', validateAdminToken, (req, res) => {
  const { blog_posts } = req.body;
  if (!Array.isArray(blog_posts)) {
    return res.status(400).json({ error: 'Blog posts must be an array.' });
  }

  const db = readDb();
  db.blog_posts = blog_posts.map((post: any, i: number) => ({
    id: post.id || i + 1,
    title: post.title || 'Untitled Post',
    slug: post.slug || `post-${i + 1}`,
    excerpt: post.excerpt || '',
    content: post.content || '',
    author: post.author || 'Admin',
    date: post.date || new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
    read_time: post.read_time || '3 min read',
    category: post.category || 'General'
  }));

  writeDb(db);
  res.json({ success: true, blog_posts: db.blog_posts });
});

// Update Screenshots list
app.post('/api/admin/update-screenshots', validateAdminToken, (req, res) => {
  const { screenshots } = req.body;
  if (!Array.isArray(screenshots)) {
    return res.status(400).json({ error: 'Screenshots must be an array.' });
  }

  const db = readDb();
  db.screenshots = screenshots.map((snap: any, i: number) => ({
    id: snap.id || i + 1,
    title: snap.title || 'Screenshot',
    url: snap.url || '',
    caption: snap.caption || ''
  }));

  writeDb(db);
  res.json({ success: true, screenshots: db.screenshots });
});

// Update Text Core Content (Hero and About text)
app.post('/api/admin/update-general-text', validateAdminToken, (req, res) => {
  const { home_tagline, home_description, about_description, about_dev_info } = req.body;
  const db = readDb();

  if (home_tagline) db.home_hero.home_tagline = home_tagline;
  if (home_description) db.home_hero.home_description = home_description;
  if (about_description) db.about_page.about_description = about_description;
  if (about_dev_info) db.about_page.about_dev_info = about_dev_info;

  writeDb(db);
  res.json({ success: true, home_hero: db.home_hero, about_page: db.about_page });
});

// GET Admin stats & contact messages
app.get('/api/admin/dashboard-stats', validateAdminToken, (req, res) => {
  const db = readDb();
  const unreadMessagesCount = db.messages.filter((m: any) => m.unread).length;
  
  res.json({
    total_messages: db.messages.length,
    unread_messages: unreadMessagesCount,
    total_notifications: db.notifications.length,
    total_faqs: db.faqs.length,
    total_blogs: db.blog_posts.length,
    total_screenshots: db.screenshots.length,
    app_version: db.version
  });
});

// GET Contact Messages List
app.get('/api/admin/messages', validateAdminToken, (req, res) => {
  const db = readDb();
  res.json(db.messages.sort((a: any, b: any) => b.id - a.id)); // Newest first
});

// Mark Contact Message as Read
app.post('/api/admin/messages/:id/read', validateAdminToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { unread } = req.body;
  const db = readDb();

  const msgIndex = db.messages.findIndex((m: any) => m.id === id);
  if (msgIndex !== -1) {
    db.messages[msgIndex].unread = !!unread;
    writeDb(db);
    return res.json({ success: true, message: db.messages[msgIndex] });
  }

  res.status(404).json({ error: 'Message not found.' });
});

// Delete Contact Message
app.delete('/api/admin/messages/:id', validateAdminToken, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const db = readDb();

  const initialLength = db.messages.length;
  db.messages = db.messages.filter((m: any) => m.id !== id);

  if (db.messages.length < initialLength) {
    writeDb(db);
    return res.json({ success: true, message: 'Message deleted.' });
  }

  res.status(404).json({ error: 'Message not found.' });
});

// =========================================================================
// SERVER INTEGRATION WITH VITE
// =========================================================================

async function startServer() {
  // Vite middleware setup in dev mode or static files serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
