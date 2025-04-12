# Project Setup: Strapi + Directus CMS + Frontend + Training

# 1. Strapi Project Setup
mkdir strapi-cms
cd strapi-cms

# Initialize Strapi with SQLite (simpler for dev)
npx create-strapi-app@latest backend --quickstart

# Navigate to admin panel: http://localhost:1337/admin
# Create collections:
# - Pages: title (text), slug (UID), body (rich text), image (media)
# - Posts: title (text), body (rich text), published_at (datetime), author (relation or text)
# - Team: name (text), role (text), bio (rich text), photo (media)

# Set roles under Settings > Users & Permissions:
# - Admin: Full access
# - Editor: Can create/edit content
# - Viewer: Read-only

# Seed mock content (in admin or via API):
# Pages: Home, About Us, Services
# Posts: "5 Tips for Security Online", "What’s New in UI Design"
# Team: Jane Doe (UX Lead), John Smith (Security Analyst)

cd ..

# ------------------------------------------

# 2. Directus Project Setup (Docker or CLI)
mkdir directus-cms
cd directus-cms

# With npx
npx create-directus-project backend
cd backend
npx directus start

# Admin Panel: http://localhost:8055
# Create collections (tables):
# - pages: title (text), slug (text), content (WYSIWYG), image (file)
# - posts: title, body, published_at, author
# - team_members: name, role, bio, photo

# Set up roles under Settings > Roles & Permissions:
# - Admin: Full access
# - Editor: Limited write access
# - Viewer: Read-only

# Seed mock content:
# Pages: Home, About Us, Services
# Posts: "Why Data Matters", "Tips for CMS Editors"
# Team: Maya Lin (Data Analyst), Alex Green (UX/UI Designer)

cd ../..

# ------------------------------------------

# 3. Frontend Placeholder (Shared for Both CMS)
mkdir headless-frontend
cd headless-frontend

# Setup Next.js frontend
npx create-next-app@latest web
cd web
npm install axios next-auth

# Create utils/api.js:
# For Strapi example:
# export const fetchStrapiPages = async () => {
#   const res = await fetch('http://localhost:1337/api/pages?populate=*');
#   const data = await res.json();
#   return data.data;
# };
#
# For Directus example:
# export const fetchDirectusPages = async () => {
#   const res = await fetch('http://localhost:8055/items/pages');
#   const data = await res.json();
#   return data.data;
# };

# Add frontend templates:
mkdir components
cat <<EOF > components/PageCard.js
export default function PageCard({ title, body, image }) {
  return (
    <div className="rounded-xl shadow p-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: body }} />
      {image && <img src={image} alt={title} className="mt-4 rounded-lg" />}
    </div>
  );
}
EOF

cat <<EOF > pages/index.js
import { fetchStrapiPages } from '../utils/api';
import PageCard from '../components/PageCard';

export async function getStaticProps() {
  const pages = await fetchStrapiPages();
  return { props: { pages } };
}

export default function Home({ pages }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
      {pages.map(page => (
        <PageCard
          key={page.id}
          title={page.attributes.title}
          body={page.attributes.body}
          image={page.attributes.image?.data?.attributes?.url}
        />
      ))}
    </div>
  );
}
EOF

# Preview drafts:
# - In Strapi: Add a "Preview" role permission & draft status
# - On frontend: Add query param ?preview=true to bypass filtering

# Auth setup with next-auth (preview protected pages):
# - Setup API route /pages/api/auth/[...nextauth].js
# - Configure credentials or JWT provider
# - Use `useSession()` in pages to protect content previews

cd ../..

# ------------------------------------------

# 4. Training Docs & Manual
mkdir training
cd training

# Create user-guide.md
cat <<EOF > user-guide.md
# 📝 CMS Editor Guide

## 🔐 Logging In
- Strapi: http://localhost:1337/admin
- Directus: http://localhost:8055

## ✍️ Adding Content
- Go to the collection (Pages, Posts, etc.)
- Click "Create New"
- Fill in the fields (title, body, image, etc.)
- Save or Publish

## 🖼 Uploading Media
- Use the media library to upload images/files
- Drag and drop or browse from your device

## 👁 Previewing Changes
- Use the Preview button (if set up)
- Or view live site if auto-published

## ✅ Publishing Content
- Toggle "Published" or "Status" to control visibility

## 🧑‍💻 Roles Overview
- Admin: Full access
- Editor: Content creation only
- Viewer: Read-only access

## 🆘 Need Help?
- Contact IT: [stevens@316group.co.uk]
EOF

mkdir screenshots
mkdir video-scripts

cat <<EOF > video-scripts/editor-training-script.md
# 🎥 Editor Training Video Script

## Introduction
Welcome! This quick video will guide you through using the CMS as a content editor.

## Step 1: Logging In
- Navigate to the login page (Strapi or Directus)
- Enter your credentials

## Step 2: Navigating Collections
- Go to the sidebar and click on Pages, Posts, or Team
- View existing entries or click "Create New"

## Step 3: Editing Content
- Fill out the form: title, content, images
- Use the WYSIWYG editor for rich formatting

## Step 4: Uploading Media
- Upload a header image or profile picture
- Save and wait for upload confirmation

## Step 5: Publishing
- Toggle visibility to "Published"
- Click Save or Publish button

## Step 6: Finishing Up
- Log out or continue editing other content

Thanks for watching! Contact your CMS admin if you have any issues.
EOF

cd ..

# ------------------------------------------
# Final Folder Structure:
# /strapi-cms/backend
# /directus-cms/backend
# /headless-frontend/web
# /training/
#   ├── user-guide.md
#   ├── screenshots/
#   └── video-scripts/editor-training-script.md

# Run CMS and frontend in different terminals
# Train editors using the user guide and visual docs
# Use mock content to demonstrate full workflow end-to-end
# Preview drafts with `?preview=true` and role-based auth
# Frontend templates in place for quick deployment
