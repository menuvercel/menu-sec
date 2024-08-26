import { kv } from '@vercel/kv';

async function getSections() {
  return await kv.get('sections') || [];
}

async function setSections(sections) {
  await kv.set('sections', sections);
}

async function addSection(section) {
  const sections = await getSections();
  sections.push(section);
  await setSections(sections);
  return section;
}

async function updateSection(id, updatedSection) {
  const sections = await getSections();
  const index = sections.findIndex(sec => sec && sec.id === id);
  if (index === -1) {
    throw new Error('Section not found');
  }
  sections[index] = { ...sections[index], ...updatedSection, id };
  await setSections(sections);
  return sections[index];
}

async function deleteSection(id) {
  const sections = await getSections();
  const index = sections.findIndex(sec => sec && sec.id === id);
  if (index === -1) {
    throw new Error('Section not found');
  }
  sections.splice(index, 1);
  await setSections(sections);
}

// API route handlers
export async function GET() {
  try {
    const sections = await getSections();
    return new Response(JSON.stringify(sections), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return new Response(JSON.stringify({ error: 'Error fetching sections' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const section = await request.json();
    if (!section || typeof section !== 'object') {
      throw new Error('Invalid section data');
    }

    const addedSection = await addSection(section);

    return new Response(JSON.stringify(addedSection), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding section:', error);
    return new Response(JSON.stringify({ error: 'Error adding section', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new Error('Missing section id');
    }

    const updatedSection = await request.json();
    if (typeof updatedSection !== 'object') {
      throw new Error('Invalid section data');
    }

    const updated = await updateSection(id, updatedSection);

    return new Response(JSON.stringify(updated), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating section:', error);
    return new Response(JSON.stringify({ error: 'Error updating section', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      throw new Error('Missing section id');
    }

    await deleteSection(id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting section:', error);
    return new Response(JSON.stringify({ error: 'Error deleting section', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
