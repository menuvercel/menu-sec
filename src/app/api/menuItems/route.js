import { kv } from '@vercel/kv';

// Helper functions to interact with KV storage
async function getMenuItems(secId) {
  return await kv.get(`menuItems_${secId}`) || [];
}

async function setMenuItems(secId, items) {
  await kv.set(`menuItems_${secId}`, items);
}

async function addMenuItem(secId, item) {
  const items = await getMenuItems(secId);
  items.push(item);
  await setMenuItems(secId, items);
  return item;
}

async function updateMenuItem(secId, id, updatedItem) {
  const items = await getMenuItems(secId);
  const index = items.findIndex(item => item && item.id === id);
  if (index === -1) {
    throw new Error('Item not found');
  }
  items[index] = { ...items[index], ...updatedItem, id };
  await setMenuItems(secId, items);
  return items[index];
}

async function deleteMenuItem(secId, id) {
  const items = await getMenuItems(secId);
  const index = items.findIndex(item => item && item.id === id);
  if (index === -1) {
    throw new Error('Item not found');
  }
  items.splice(index, 1);
  await setMenuItems(secId, items);
}

// API route handlers
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secId = searchParams.get('secId');

    const items = await getMenuItems(secId);
    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return new Response(JSON.stringify({ error: 'Error fetching menu items' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secId = searchParams.get('secId');

    const item = await request.json();
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid item data');
    }

    const addedItem = await addMenuItem(secId, item);

    return new Response(JSON.stringify(addedItem), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    return new Response(JSON.stringify({ error: 'Error adding menu item', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secId = searchParams.get('secId');
    const id = searchParams.get('id');

    if (!id) {
      throw new Error('Missing item id');
    }

    const updatedItem = await request.json();
    if (typeof updatedItem !== 'object') {
      throw new Error('Invalid item data');
    }

    const updated = await updateMenuItem(secId, id, updatedItem);

    return new Response(JSON.stringify(updated), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return new Response(JSON.stringify({ error: 'Error updating menu item', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secId = searchParams.get('secId');
    const id = searchParams.get('id');

    if (!id) {
      throw new Error('Missing item id');
    }

    await deleteMenuItem(secId, id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return new Response(JSON.stringify({ error: 'Error deleting menu item', details: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
